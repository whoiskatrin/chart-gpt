import React, { useState } from 'react'
import { Check, Zap, Star, Crown, Sparkles, Loader2, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

interface PricingTier {
  id: string
  name: string
  credits: number
  price: number
  priceId: string // Stripe price ID
  popular?: boolean
  icon: React.ComponentType<any>
  features: string[]
  savings?: string
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 50,
    price: 9.99,
    priceId: 'price_starter_pack',
    icon: Sparkles,
    features: [
      '50 AI-generated charts',
      'All chart types available',
      'Full customization options',
      'Export to PNG, JPG, SVG',
      'Access to all AI models',
      'Email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 200,
    price: 29.99,
    priceId: 'price_professional_pack',
    popular: true,
    icon: Zap,
    features: [
      '200 AI-generated charts',
      'All chart types available',
      'Full customization options',
      'Export to PNG, JPG, SVG',
      'Access to all AI models',
      'Priority support',
      'Advanced data analysis',
      '15% cost savings'
    ],
    savings: '15% off'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 750,
    price: 89.99,
    priceId: 'price_enterprise_pack',
    icon: Crown,
    features: [
      '750 AI-generated charts',
      'All chart types available',
      'Full customization options',
      'Export to PNG, JPG, SVG',
      'Access to all AI models',
      'Priority support',
      'Advanced data analysis',
      'Custom chart templates',
      'Bulk operations',
      '25% cost savings'
    ],
    savings: '25% off'
  }
]

const AI_MODELS = [
  { name: 'GPT-3.5 Turbo', cost: 1, description: 'Fast and efficient' },
  { name: 'GPT-4', cost: 2, description: 'High quality responses' },
  { name: 'GPT-4 Turbo', cost: 3, description: 'Most capable OpenAI model' },
  { name: 'Claude 3 Haiku', cost: 1, description: 'Quick and accurate' },
  { name: 'Claude 3 Sonnet', cost: 2, description: 'Balanced performance' },
  { name: 'Claude 3 Opus', cost: 3, description: 'Most intelligent Claude model' },
  { name: 'Gemini Pro', cost: 2, description: 'Google\'s powerful model' },
  { name: 'Gemini Pro Vision', cost: 3, description: 'Advanced multimodal model' }
]

export const PricingPage: React.FC = () => {
  const { user, userProfile } = useAuthStore()
  const [loading, setLoading] = useState<string | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)

  const handlePurchase = async (tier: PricingTier) => {
    if (!user) {
      toast.error('Please sign in to purchase credits')
      return
    }

    setLoading(tier.id)
    
    try {
      // This would integrate with Stripe
      // For now, simulate the purchase
      toast.success(`Redirecting to Stripe for ${tier.name}...`)
      
      // In a real implementation, you would:
      // 1. Create a Stripe checkout session
      // 2. Redirect to Stripe
      // 3. Handle the webhook to add credits
      
      setTimeout(() => {
        setLoading(null)
        toast.success('Purchase completed! Credits added to your account.')
      }, 2000)
      
    } catch (error) {
      console.error('Purchase failed:', error)
      toast.error('Purchase failed. Please try again.')
      setLoading(null)
    }
  }

  const openBillingPortal = async () => {
    if (!user) {
      toast.error('Please sign in to manage billing')
      return
    }

    setBillingLoading(true)
    
    try {
      // This would open Stripe's customer portal
      toast.success('Opening billing portal...')
      
      setTimeout(() => {
        setBillingLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Failed to open billing portal:', error)
      toast.error('Failed to open billing portal')
      setBillingLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#cc785c]/5 via-transparent to-[#2563eb]/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-[#cc785c]" />
              <span className="text-sm text-[#a3a3a3]">Pay-as-you-go Pricing</span>
            </div>
            
            {/* Hero Title */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Simple
              <span className="block bg-gradient-to-r from-[#cc785c] to-[#2563eb] bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h1>
            
            {/* Hero Subtitle */}
            <p className="text-xl lg:text-2xl text-[#a3a3a3] mb-12 max-w-3xl mx-auto leading-relaxed">
              Pay only for what you use. No subscriptions, no hidden fees.
              Generate unlimited charts with our credit-based system.
            </p>
            
            {user && userProfile && (
              <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#cc785c] to-[#b8694f] rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Current Balance</div>
                  <div className="text-sm text-[#cc785c]">{userProfile.credits} credits</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">

        {/* AI Models Pricing */}
        <section className="py-20 bg-[#0f0f0f] rounded-3xl border border-[#1a1a1a] mb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                AI Model Pricing
              </h2>
              <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
                Different AI models consume different amounts of credits based on their capabilities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {AI_MODELS.map((model) => (
                <div key={model.name} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-[#f5f5f5] text-sm">{model.name}</h3>
                    <span className="px-3 py-1 bg-[#cc785c]/20 text-[#cc785c] text-xs rounded-full font-medium">
                      {model.cost} credit{model.cost > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-[#a3a3a3] leading-relaxed">{model.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
              Select the perfect credit package for your needs. All plans include access to every feature.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {PRICING_TIERS.map((tier) => {
              const IconComponent = tier.icon
              const isPopular = tier.popular
              
              return (
                <div
                  key={tier.id}
                  className={`relative bg-[#1a1a1a] rounded-2xl border-2 p-8 transition-all duration-300 hover:border-[#cc785c]/50 hover:shadow-2xl hover:shadow-black/20 ${
                    isPopular 
                      ? 'border-[#cc785c] ring-4 ring-[#cc785c]/20 transform scale-105' 
                      : 'border-[#2a2a2a]'
                  }`}
                >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#cc785c] text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {tier.savings && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-medium">
                      {tier.savings}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#cc785c]/20 rounded-full mb-6">
                    <IconComponent className="w-8 h-8 text-[#cc785c]" />
                  </div>
                  <h3 className="text-2xl font-normal text-[#f5f5f5] mb-3 tracking-tight">{tier.name}</h3>
                  <div className="text-4xl font-normal text-[#f5f5f5] mb-2">
                    ${tier.price}
                  </div>
                  <div className="text-[#a3a3a3]">
                    {tier.credits} credits ({(tier.price / tier.credits).toFixed(3)}¢ per credit)
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-[#a3a3a3]">
                      <Check className="w-5 h-5 text-[#4ade80] mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(tier)}
                  disabled={loading === tier.id}
                  className={`w-full py-4 px-6 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isPopular
                      ? 'bg-[#cc785c] hover:bg-[#b8694f] text-white shadow-lg'
                      : 'bg-[#3a3a3a] hover:bg-[#4a4a4a] text-[#f5f5f5] border border-[#4a4a4a]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === tier.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Purchase {tier.credits} Credits</span>
                    </>
                  )}
                </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Billing Management */}
        {user && (
          <section className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Manage Your Account
              </h2>
              <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
                Access your billing history and manage payment methods
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#3a3a3a] transition-colors">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#cc785c]/20 to-[#cc785c]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-[#cc785c]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#f5f5f5] mb-2">Billing Management</h3>
                  <p className="text-[#a3a3a3] text-sm">
                    View purchase history, download invoices, and update payment methods
                  </p>
                </div>
                
                <button
                  onClick={openBillingPortal}
                  disabled={billingLoading}
                  className="w-full bg-[#cc785c] hover:bg-[#b8694f] text-white py-4 px-6 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {billingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Open Billing Portal</span>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
              Everything you need to know about our pricing and credits system
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-colors">
              <h3 className="text-lg font-medium text-[#f5f5f5] mb-3">How do credits work?</h3>
              <p className="text-[#a3a3a3] leading-relaxed">
                Each chart generation consumes credits based on the AI model used. 
                More advanced models cost more credits but provide better results.
              </p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-colors">
              <h3 className="text-lg font-medium text-[#f5f5f5] mb-3">Do credits expire?</h3>
              <p className="text-[#a3a3a3] leading-relaxed">
                No! Your credits never expire. Use them whenever you need to create charts.
              </p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-colors">
              <h3 className="text-lg font-medium text-[#f5f5f5] mb-3">Can I get a refund?</h3>
              <p className="text-[#a3a3a3] leading-relaxed">
                We offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-colors">
              <h3 className="text-lg font-medium text-[#f5f5f5] mb-3">Do you offer volume discounts?</h3>
              <p className="text-[#a3a3a3] leading-relaxed">
                Yes! Larger credit packages offer better value per credit. 
                Contact us for custom enterprise pricing.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PricingPage