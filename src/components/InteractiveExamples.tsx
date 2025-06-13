import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Zap, Target, Globe, BarChart3, Users, DollarSign, Activity, Sparkles, ChevronDown } from 'lucide-react'

interface ExampleData {
  id: string
  title: string
  description: string
  prompt: string
  category: 'business' | 'analytics' | 'growth' | 'performance'
  icon: React.ComponentType<any>
  gradient: string
  chartType: 'line' | 'bar' | 'area' | 'pie'
  stats?: {
    growth?: string
    total?: string
    change?: string
  }
  miniChart: number[]
}

const EXAMPLE_DATA: ExampleData[] = [
  {
    id: 'revenue-growth',
    title: 'Revenue Growth Analysis',
    description: 'Track quarterly revenue performance with trend analysis and forecasting',
    prompt: 'Create a line chart showing quarterly revenue growth from Q1 2022 to Q4 2023: Q1 2022: $1.2M, Q2: $1.5M, Q3: $1.8M, Q4: $2.1M, Q1 2023: $2.4M, Q2: $2.8M, Q3: $3.2M, Q4: $3.6M. Include trend line and growth percentages.',
    category: 'business',
    icon: TrendingUp,
    gradient: 'from-emerald-400/20 via-cyan-400/20 to-blue-500/20',
    chartType: 'line',
    stats: { growth: '+23.4%', total: '$3.6M', change: '+$2.4M' },
    miniChart: [1.2, 1.5, 1.8, 2.1, 2.4, 2.8, 3.2, 3.6]
  },
  {
    id: 'market-distribution',
    title: 'Global Market Share',
    description: 'Comprehensive breakdown of market presence across major regions worldwide',
    prompt: 'Show a pie chart of our global market share by region: North America 42%, Europe 28%, Asia Pacific 18%, Latin America 8%, Middle East & Africa 4%. Use professional colors and include percentages.',
    category: 'business',
    icon: Globe,
    gradient: 'from-blue-400/20 via-indigo-400/20 to-purple-500/20',
    chartType: 'pie',
    stats: { total: '42%', change: '+3.2%', growth: 'Leading' },
    miniChart: [42, 28, 18, 8, 4]
  },
  {
    id: 'performance-metrics',
    title: 'Multi-Channel Performance',
    description: 'Compare performance across different channels with detailed analytics',
    prompt: 'Create a bar chart comparing performance metrics across channels: Organic Search 85%, Social Media 72%, Email Marketing 68%, Paid Ads 91%, Direct Traffic 76%, Referrals 59%. Show as percentage values with different colors.',
    category: 'analytics',
    icon: BarChart3,
    gradient: 'from-purple-400/20 via-pink-400/20 to-red-400/20',
    chartType: 'bar',
    stats: { growth: '+12.8%', total: '75.2%', change: '+8.4%' },
    miniChart: [85, 72, 68, 91, 76, 59]
  },
  {
    id: 'user-engagement',
    title: 'User Engagement Trends',
    description: 'Daily active users and engagement patterns with seasonal analysis',
    prompt: 'Show an area chart of daily active users over 30 days: Start at 25,000 users, show natural fluctuations with weekends being lower (18,000-22,000) and weekdays higher (28,000-35,000), ending at 32,000. Include smooth curves and gradient fill.',
    category: 'analytics',
    icon: Users,
    gradient: 'from-cyan-400/20 via-teal-400/20 to-emerald-400/20',
    chartType: 'area',
    stats: { growth: '+28%', total: '32K', change: '+7K' },
    miniChart: [25, 30, 32, 28, 22, 19, 20, 29, 33, 35, 31, 24, 21, 23, 31, 34, 36, 32, 25, 22, 24, 30, 33, 35, 34, 26, 23, 25, 31, 32]
  }
]

const CATEGORIES = [
  { id: 'all', label: 'All Examples', icon: BarChart3 },
  { id: 'business', label: 'Business', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics', icon: Activity }
]

interface InteractiveExamplesProps {
  onExampleSelect: (prompt: string, title: string) => void
}

const MiniChart: React.FC<{ data: number[]; type: ExampleData['chartType']; gradient: string }> = ({ 
  data, 
  type, 
  gradient 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  if (type === 'pie') {
    return (
      <div className="w-16 h-16 relative">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
          <motion.circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${data[0]} ${100 - data[0]}`}
            className="text-emerald-400"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </svg>
      </div>
    )
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const normalize = (value: number) => ((value - min) / (max - min)) * 100

  return (
    <div className="w-20 h-12 relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 80 48" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(52, 211, 153, 0.8)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.8)" />
          </linearGradient>
        </defs>
        
        {type === 'line' && (
          <motion.polyline
            points={data.map((value, index) => 
              `${(index / (data.length - 1)) * 80},${48 - (normalize(value) / 100) * 44}`
            ).join(' ')}
            fill="none"
            stroke={`url(#gradient-${type})`}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        )}
        
        {type === 'area' && (
          <>
            <motion.polygon
              points={[
                ...data.map((value, index) => 
                  `${(index / (data.length - 1)) * 80},${48 - (normalize(value) / 100) * 44}`
                ),
                `80,48`,
                `0,48`
              ].join(' ')}
              fill={`url(#gradient-${type})`}
              fillOpacity="0.3"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.5 : 0.3 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
            <motion.polyline
              points={data.map((value, index) => 
                `${(index / (data.length - 1)) * 80},${48 - (normalize(value) / 100) * 44}`
              ).join(' ')}
              fill="none"
              stroke={`url(#gradient-${type})`}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </>
        )}
        
        {type === 'bar' && data.map((value, index) => (
          <motion.rect
            key={index}
            x={index * 10}
            y={48 - (normalize(value) / 100) * 44}
            width="8"
            height={(normalize(value) / 100) * 44}
            fill={`url(#gradient-${type})`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            style={{ transformOrigin: 'bottom' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        ))}
      </svg>
    </div>
  )
}

const ExampleCard: React.FC<{ 
  example: ExampleData
  onSelect: (prompt: string, title: string) => void
  delay: number
}> = ({ example, onSelect, delay }) => {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = example.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(example.prompt, example.title)}
    >
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${example.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
      
      {/* Main Card */}
      <div className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 h-full transition-all duration-500 group-hover:border-[#3a3a3a] group-hover:shadow-2xl group-hover:shadow-black/20">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${example.gradient} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#f5f5f5] group-hover:text-white transition-colors">
                {example.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${example.gradient} text-white/90 font-medium capitalize`}>
                {example.category}
              </span>
            </div>
          </div>
          
          {/* Mini Chart */}
          <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <MiniChart 
              data={example.miniChart} 
              type={example.chartType} 
              gradient={example.gradient}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-[#a3a3a3] text-sm mb-4 group-hover:text-[#c3c3c3] transition-colors leading-relaxed">
          {example.description}
        </p>

        {/* Stats */}
        {example.stats && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] group-hover:border-[#2a2a2a] transition-colors">
            <div className="flex space-x-4">
              {example.stats.growth && (
                <div className="text-center">
                  <div className={`text-sm font-medium ${example.stats.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {example.stats.growth}
                  </div>
                  <div className="text-xs text-[#666]">Growth</div>
                </div>
              )}
              {example.stats.total && (
                <div className="text-center">
                  <div className="text-sm font-medium text-[#f5f5f5]">{example.stats.total}</div>
                  <div className="text-xs text-[#666]">Total</div>
                </div>
              )}
              {example.stats.change && (
                <div className="text-center">
                  <div className={`text-sm font-medium ${example.stats.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {example.stats.change}
                  </div>
                  <div className="text-xs text-[#666]">Change</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prompt Preview */}
        <div className="p-3 bg-[#0f0f0f] rounded-lg border border-[#1a1a1a] group-hover:border-[#2a2a2a] transition-colors">
          <p className="text-xs text-[#888] font-mono leading-relaxed">
            "{example.prompt}"
          </p>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />

        {/* Action Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          className="absolute top-4 right-4 bg-[#cc785c] text-white px-3 py-1 rounded-full text-xs font-medium"
        >
          Try this →
        </motion.div>
      </div>
    </motion.div>
  )
}

export const InteractiveExamples: React.FC<InteractiveExamplesProps> = ({ onExampleSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredExamples, setFilteredExamples] = useState(EXAMPLE_DATA)

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredExamples(EXAMPLE_DATA)
    } else {
      setFilteredExamples(EXAMPLE_DATA.filter(example => example.category === selectedCategory))
    }
  }, [selectedCategory])

  return (
    <div className="space-y-8">
      {/* Hero Header with Main Messaging */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 mb-12"
      >
        <div className="relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-blue-500/10 rounded-3xl blur-3xl" />
          
          {/* Main Content */}
          <div className="relative space-y-6 py-12">
            <motion.h1 
              className="text-5xl md:text-6xl font-medium text-[#f5f5f5] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Transform{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Data into Stories
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Generate beautiful, customizable charts from any data query using AI.{' '}
              <span className="text-[#f5f5f5] font-medium">Ask about anything</span> and get instant visualizations.
            </motion.p>

            {/* Feature Pills */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: '🚀', text: 'Instant Generation' },
                { icon: '🎨', text: 'Full Customization' },
                { icon: '🧠', text: 'AI Powered' },
                { icon: '📊', text: '9+ Chart Types' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-full flex items-center space-x-2 hover:border-[#cc785c]/50 transition-colors duration-300"
                >
                  <span className="text-sm">{feature.icon}</span>
                  <span className="text-sm text-[#a3a3a3] font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-medium text-[#f5f5f5] tracking-tight">
            Start with an Example
          </h2>
          <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
            Click any card below to instantly generate that chart, or{' '}
            <span className="text-[#cc785c] font-medium">scroll down to create your own</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="flex space-x-2 p-2 bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a]">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#cc785c] text-white shadow-lg'
                    : 'text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Examples Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {filteredExamples.map((example, index) => (
            <ExampleCard
              key={example.id}
              example={example}
              onSelect={onExampleSelect}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center pt-12"
      >
        <div className="relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-red-400/10 rounded-3xl blur-2xl" />
          
          {/* Content Card */}
          <div className="relative bg-[#0f0f0f] border border-[#2a2a2a] rounded-3xl p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-[#cc785c]/20 to-[#cc785c]/10 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-[#cc785c]" />
                </div>
              </div>
              
              <h3 className="text-2xl font-medium text-[#f5f5f5] mb-3">
                Ready to Create Your Own?
              </h3>
              
              <p className="text-lg text-[#a3a3a3] leading-relaxed">
                Describe any data you want to visualize and we'll create the perfect chart for you.{' '}
                <span className="text-[#f5f5f5] font-medium">No coding required</span> – just tell us what you need.
              </p>

              {/* Example Queries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                {[
                  '📊 "Monthly sales by product category"',
                  '📈 "Stock price trends over 6 months"',
                  '🏆 "Top 10 performing regions"',
                  '⏰ "Website traffic by hour of day"'
                ].map((query, index) => (
                  <div 
                    key={index}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 rounded-xl text-sm text-[#a3a3a3] hover:border-[#cc785c]/30 transition-colors duration-300"
                  >
                    {query}
                  </div>
                ))}
              </div>

              {/* Scroll Indicator */}
              <div className="pt-6">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center space-x-2 text-[#cc785c] text-sm font-medium"
                >
                  <span>Scroll down to get started</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default InteractiveExamples