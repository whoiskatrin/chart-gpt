import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// For development, provide fallback values or throw helpful error
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase configuration missing. Using demo mode.')
  console.log('To enable full functionality:')
  console.log('1. Create a .env file from .env.example')
  console.log('2. Add your Supabase URL and anon key')
  console.log('3. Restart the development server')
}

// Create client with fallback values for demo purposes
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key'
)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      charts: {
        Row: {
          id: string
          user_id: string
          title: string
          prompt: string
          config: any
          model_used: string
          credits_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          prompt: string
          config: any
          model_used: string
          credits_used: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          prompt?: string
          config?: any
          model_used?: string
          credits_used?: number
          created_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'purchase' | 'usage' | 'refund'
          amount: number
          description: string
          stripe_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'purchase' | 'usage' | 'refund'
          amount: number
          description: string
          stripe_payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'purchase' | 'usage' | 'refund'
          amount?: number
          description?: string
          stripe_payment_id?: string | null
          created_at?: string
        }
      }
    }
  }
}