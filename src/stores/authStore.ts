import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  userProfile: {
    id: string
    email: string
    full_name: string | null
    credits: number
  } | null
  isLoading: boolean
  signInWithGoogle: () => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateCredits: (amount: number) => Promise<void>
  refreshProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: true,

  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  signIn: async (email: string, password: string) => {
    // Deprecated - redirect to Google Auth
    return { error: 'Please use Google Sign In' }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    // Deprecated - redirect to Google Auth
    return { error: 'Please use Google Sign In' }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, userProfile: null })
  },

  updateCredits: async (amount: number) => {
    const { userProfile, user } = get()
    if (!user || !userProfile) return

    const newCredits = userProfile.credits + amount

    const { error } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', user.id)

    if (!error) {
      set({
        userProfile: {
          ...userProfile,
          credits: newCredits,
        },
      })
    }
  },

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      set({ userProfile: data })
    }
  },
}))

// Initialize auth state
const initializeAuth = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      useAuthStore.setState({ user: session.user })
      await useAuthStore.getState().refreshProfile()
    }
  } catch (error) {
    console.warn('Auth initialization failed - running in demo mode')
  } finally {
    useAuthStore.setState({ isLoading: false })
  }
}

// Initialize auth
initializeAuth()

// Listen for auth changes
try {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      useAuthStore.setState({ user: session.user })
      await useAuthStore.getState().refreshProfile()
    } else {
      useAuthStore.setState({ user: null, userProfile: null })
    }
    useAuthStore.setState({ isLoading: false })
  })
} catch (error) {
  console.warn('Auth listener setup failed - running in demo mode')
}