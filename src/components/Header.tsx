import React, { useState } from 'react'
import { BarChart3, User, LogOut, Settings, CreditCard, Menu, X, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

interface HeaderProps {
  onNavigate?: (page: 'landing' | 'pricing' | 'settings' | 'test-charts' | 'echarts-demo' | 'responsive-test') => void
  currentPage?: string
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, userProfile, signOut, signInWithGoogle } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(error)
      }
    } catch (error) {
      toast.error('Failed to sign in with Google')
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <header className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo */}
          <button
            onClick={() => onNavigate && onNavigate('landing')}
            className="flex items-center space-x-2 text-[#f5f5f5] hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-[#cc785c]/20 to-[#cc785c]/10 rounded-xl">
              <BarChart3 className="h-6 w-6 text-[#cc785c]" />
            </div>
            <span className="text-xl font-medium tracking-tight">Chart GPT</span>
          </button>

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Credits Display */}
                <div className="flex items-center space-x-2 bg-[#2a2a2a] px-4 py-2 rounded-full border border-[#3a3a3a]">
                  <CreditCard className="h-4 w-4 text-[#cc785c]" />
                  <span className="text-sm font-medium text-[#cc785c]">
                    {userProfile?.credits || 0} credits
                  </span>
                </div>

                {/* Buy Credits Button */}
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="px-4 py-2 text-sm font-medium bg-[#cc785c] text-white rounded-full hover:bg-[#b8694f] transition-all duration-300"
                  >
                    Buy Credits
                  </button>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#cc785c] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-[#f5f5f5]">
                      {userProfile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] rounded-xl shadow-xl border border-[#3a3a3a] py-2 z-50">
                      {onNavigate && (
                        <button
                          onClick={() => {
                            onNavigate('settings')
                            setIsMenuOpen(false)
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#3a3a3a] transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-[#cc785c] hover:bg-[#cc785c]/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Not logged in - Show Buy Credits and Google Sign In */
              <div className="flex items-center space-x-4">
                {/* Buy Credits Button for non-logged users */}
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="px-4 py-2 text-sm font-medium bg-[#cc785c] text-white rounded-full hover:bg-[#b8694f] transition-all duration-300"
                  >
                    Buy Credits
                  </button>
                )}

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center space-x-3 px-6 py-3 border border-[#3a3a3a] rounded-full shadow-sm text-sm font-medium text-[#f5f5f5] bg-[#2a2a2a] hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#cc785c] disabled:opacity-50 transition-all duration-300"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Sign in</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-[#f5f5f5]" />
                ) : (
                  <Menu className="h-6 w-6 text-[#f5f5f5]" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && user && (
          <div className="md:hidden border-t border-[#2a2a2a] py-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  onNavigate && onNavigate('landing')
                  setIsMenuOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  currentPage === 'landing'
                    ? 'text-[#cc785c] bg-[#cc785c]/20'
                    : 'text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#2a2a2a]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate && onNavigate('pricing')
                  setIsMenuOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  currentPage === 'pricing'
                    ? 'text-[#cc785c] bg-[#cc785c]/20'
                    : 'text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#2a2a2a]'
                }`}
              >
                Pricing
              </button>
              
              <div className="border-t border-[#2a2a2a] pt-2 mt-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <CreditCard className="h-4 w-4 text-[#cc785c]" />
                  <span className="text-sm font-medium text-[#f5f5f5]">
                    {userProfile?.credits || 0} credits
                  </span>
                </div>
                <button
                  onClick={() => {
                    onNavigate && onNavigate('settings')
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#2a2a2a] rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-[#cc785c] hover:bg-[#cc785c]/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header