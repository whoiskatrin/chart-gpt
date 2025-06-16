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
    id: 'student-grades',
    title: 'Student Grade Distribution',
    description: 'Perfect for students and educators to track academic performance across subjects',
    prompt: 'Create a bar chart showing my semester grades: Mathematics 85, Physics 78, Chemistry 92, Biology 88, History 76, English 90. Use vibrant colors and show grade values.',
    category: 'analytics',
    icon: Target,
    gradient: 'from-emerald-400/20 via-teal-400/20 to-cyan-400/20',
    chartType: 'bar',
    stats: { growth: '85.2', total: 'Avg', change: '+3.2%' },
    miniChart: [85, 78, 92, 88, 76, 90]
  },
  {
    id: 'research-data',
    title: 'Research Survey Results',
    description: 'Ideal for researchers and academics to visualize survey and study data',
    prompt: 'Show a pie chart of survey responses for "Preferred Learning Method": Visual Learning 35%, Hands-on Practice 28%, Reading 20%, Audio Learning 12%, Group Discussion 5%. Include percentages and clear labels.',
    category: 'business',
    icon: Users,
    gradient: 'from-purple-400/20 via-indigo-400/20 to-blue-500/20',
    chartType: 'pie',
    stats: { total: '35%', change: 'Visual', growth: 'Top Choice' },
    miniChart: [35, 28, 20, 12, 5]
  },
  {
    id: 'business-revenue',
    title: 'Monthly Business Revenue',
    description: 'Essential for business owners and entrepreneurs to track financial growth',
    prompt: 'Create a line chart showing monthly revenue for small business: Jan $4,500, Feb $5,200, Mar $4,800, Apr $6,100, May $7,300, Jun $8,200, Jul $9,100, Aug $8,800. Show growth trend with smooth curves.',
    category: 'business',
    icon: TrendingUp,
    gradient: 'from-green-400/20 via-emerald-400/20 to-teal-400/20',
    chartType: 'line',
    stats: { growth: '+96%', total: '$8.8K', change: '+$4.3K' },
    miniChart: [4.5, 5.2, 4.8, 6.1, 7.3, 8.2, 9.1, 8.8]
  },
  {
    id: 'personal-fitness',
    title: 'Personal Fitness Progress',
    description: 'Great for personal tracking - fitness goals, budgets, habits, and lifestyle data',
    prompt: 'Show an area chart of weekly workout minutes over 8 weeks: Week 1: 120 min, Week 2: 150 min, Week 3: 135 min, Week 4: 180 min, Week 5: 200 min, Week 6: 225 min, Week 7: 210 min, Week 8: 240 min. Use gradient fill.',
    category: 'growth',
    icon: Activity,
    gradient: 'from-orange-400/20 via-red-400/20 to-pink-400/20',
    chartType: 'area',
    stats: { growth: '+100%', total: '240min', change: '+120min' },
    miniChart: [120, 150, 135, 180, 200, 225, 210, 240]
  }
]

const CATEGORIES = [
  { id: 'all', label: 'All Examples', icon: BarChart3 },
  { id: 'business', label: 'Business', icon: TrendingUp },
  { id: 'analytics', label: 'Academic', icon: Target },
  { id: 'growth', label: 'Personal', icon: Activity }
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
              Perfect for{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Everyone
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              From students tracking grades to businesses analyzing revenue.{' '}
              <span className="text-[#f5f5f5] font-medium">Anyone can create stunning charts</span> in seconds.
            </motion.p>

            {/* Feature Pills */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: '🎓', text: 'Students & Educators' },
                { icon: '🔬', text: 'Researchers' },
                { icon: '💼', text: 'Business Owners' },
                { icon: '📈', text: 'Personal Tracking' }
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

    </div>
  )
}

export default InteractiveExamples