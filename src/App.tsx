import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import Header from '@/components/Header'
import LandingPage from '@/components/LandingPage'
import PricingPage from '@/components/PricingPage'
import ChartTestSuite from '@/components/ChartTestSuite'
import EChartsDemo from '@/components/EChartsDemo'
import ResponsiveTest from '@/components/ResponsiveTest'
import './styles/globals.css'

type Page = 'landing' | 'pricing' | 'settings' | 'test-charts' | 'echarts-demo' | 'responsive-test'

function App() {
  const { user, isLoading } = useAuthStore()
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [landingPageKey, setLandingPageKey] = useState(0)

  const handleNavigate = (page: Page) => {
    setCurrentPage(page)
    // Force re-render of LandingPage to reset its state when navigating to landing
    if (page === 'landing') {
      setLandingPageKey(prev => prev + 1)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'pricing':
        return <PricingPage />
      case 'test-charts':
        return <ChartTestSuite onNavigate={handleNavigate} />
      case 'echarts-demo':
        return <EChartsDemo />
      case 'responsive-test':
        return <ResponsiveTest onNavigate={handleNavigate} />
      case 'settings':
        return (
          <div className="min-h-screen bg-[#1a1a1a] py-16">
            <div className="max-w-2xl mx-auto px-6">
              <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-8">
                <h1 className="text-3xl font-normal text-[#f5f5f5] mb-6 tracking-tight">Settings</h1>
                <p className="text-[#a3a3a3]">Settings page coming soon...</p>
              </div>
            </div>
          </div>
        )
      default:
        return <LandingPage key={landingPageKey} onNavigate={handleNavigate} />
    }
  }

  // Skip demo mode - show landing page even without Supabase configuration

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#cc785c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#a3a3a3]">Loading...</p>
        </div>
      </div>
    )
  }

  // Always show the landing page with header

  return (
    <Router>
      <div className="min-h-screen bg-[#1a1a1a]">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        {renderPage()}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#000',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#f97316',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App