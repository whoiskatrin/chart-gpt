import React, { useState } from 'react'
import { BarChart3, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

export const AuthForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { signInWithGoogle } = useAuthStore()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(error)
      }
      // Success handling is done by the auth state change listener
    } catch (error) {
      toast.error('Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vercel-lightest-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-10 w-10 text-orange-500" />
              <span className="text-2xl font-bold text-vercel-black">Chart GPT</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-vercel-black">
            Welcome to Chart GPT
          </h2>
          <p className="mt-2 text-sm text-vercel-gray">
            Generate beautiful charts with AI using natural language
          </p>
        </div>

        {/* Google Sign In */}
        <div className="bg-white py-8 px-6 shadow-vercel rounded-lg">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-vercel-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-vercel-gray">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Free Credits Notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <p className="text-sm text-orange-800">
            🎉 <strong>Get 20 free test credits</strong> when you sign in!
          </p>
          <p className="text-xs text-orange-700 mt-1">
            Try all AI models and features before purchasing
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-lg shadow-vercel border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-vercel-black mb-4 text-center">What you get:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-vercel-gray">Access to GPT-4, Claude, and Gemini</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-vercel-gray">Advanced chart customization</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-vercel-gray">Export in PNG, JPG, SVG formats</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-vercel-gray">Natural language chart generation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm