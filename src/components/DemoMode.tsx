import React from 'react'
import { AlertCircle, ExternalLink, Database, CreditCard } from 'lucide-react'

export const DemoMode: React.FC = () => {
  return (
    <div className="min-h-screen bg-vercel-lightest-gray flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-vercel border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-vercel-black">Demo Mode</h1>
              <p className="text-vercel-gray">Configuration required for full functionality</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800">
                Welcome to Chart GPT! To enable Google Auth and the full application, you'll need to set up a few services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-vercel-black">Required Setup:</h2>
              
              {/* Supabase */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Database className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium text-vercel-black">1. Supabase (Database & Auth)</h3>
                </div>
                <p className="text-sm text-vercel-gray mb-3">
                  Create a free Supabase project for Google authentication and data storage.
                </p>
                <div className="space-y-2">
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-green-600 hover:text-green-700"
                  >
                    <span>Create Supabase Project</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <div className="text-xs text-vercel-gray">
                    Then run the SQL migration from <code>supabase/migrations/001_initial_schema.sql</code>
                  </div>
                </div>
              </div>

              {/* Stripe */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium text-vercel-black">2. Stripe (Payments)</h3>
                </div>
                <p className="text-sm text-vercel-gray mb-3">
                  Set up Stripe for credit purchases and payment processing.
                </p>
                <a
                  href="https://stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  <span>Create Stripe Account</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Environment Variables */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-vercel-black mb-3">3. Environment Variables</h3>
                <p className="text-sm text-vercel-gray mb-3">
                  Add your API keys to the <code>.env</code> file:
                </p>
                <div className="bg-gray-50 rounded p-3 text-xs font-mono text-vercel-black">
                  <div>VITE_SUPABASE_URL=your_supabase_project_url</div>
                  <div>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                  <div>VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-vercel-black mb-3">What's Included:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Google authentication & profiles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>20 free test credits per user</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>OpenAI, Anthropic, Google AI</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Advanced chart customization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Multiple export formats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Responsive Vercel-inspired UI</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-vercel-gray">
                Once configured, restart the development server to enable full functionality
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">npm run dev</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoMode