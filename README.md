# Chart GPT - AI-Powered Chart Generation

<div align="center">
    <img src="https://raw.githubusercontent.com/whoiskatrin/chart-gpt/main/public/chartgpt-og.png" width="600" />
</div>

Transform your data into beautiful, interactive charts using natural language or file uploads. Powered by multiple AI providers (OpenAI, Anthropic, Google) with a modern, credit-based system.

## ✨ Features

### 🔥 **NEW: File Upload Support**
- 📁 **Multiple File Formats**: Upload CSV, JSON, TXT, and TSV files
- 🚀 **Drag & Drop Interface**: Intuitive file upload with real-time preview
- 🧠 **Smart Chart Detection**: AI automatically selects the best chart type for your data
- 📊 **Data Analysis**: Automatic column detection and data type inference

### 🎯 **Core Features**
- 🔐 **Google Authentication**: Secure login with Google OAuth via Supabase
- 💳 **Credit System**: Pay-per-use model with Stripe integration
- 🤖 **Multiple AI Providers**: OpenAI GPT-4, Anthropic Claude, Google Gemini
- 📈 **Advanced Chart Types**: Bar, line, pie, scatter, area, bubble, radar, heatmap, treemap, sankey, and more
- 🎨 **ECharts Integration**: Professional-grade charts with full customization
- 📱 **Responsive Design**: Modern dark theme UI that adapts to all devices
- 💾 **Export Options**: PNG, JPG, SVG, PDF formats with custom dimensions
- ☁️ **Cloudflare Ready**: Optimized for Cloudflare Pages deployment
- ⚡ **Modern Stack**: Vite, React 18, TypeScript, Tailwind CSS, Zustand

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account ([create one free](https://supabase.com))
- Stripe account for payments ([create one](https://stripe.com))
- AI provider API keys (OpenAI, Anthropic, or Google)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/whoiskatrin/chart-gpt.git
   cd chart-gpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # AI Provider Keys (Server-side - Optional)
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_ANTHROPIC_API_KEY=your_anthropic_key
   VITE_GOOGLE_API_KEY=your_google_key
   ```

4. **Set up Supabase database**
   - Run the migration in `supabase/migrations/001_initial_schema.sql`
   - Or use the Supabase dashboard to create the tables

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 File Upload Guide

### Supported File Formats

| Format | Extension | Description | Example Use Case |
|--------|-----------|-------------|------------------|
| **CSV** | `.csv` | Comma-separated values | Sales data, analytics exports |
| **JSON** | `.json` | JavaScript Object Notation | API responses, structured data |
| **TSV** | `.tsv` | Tab-separated values | Database exports |
| **TXT** | `.txt` | Plain text with delimiters | Log files, simple datasets |

### How to Use File Upload

1. **Choose Input Method**: Switch from "Text Prompt" to "Upload File"
2. **Upload Your Data**: Drag & drop or click to browse for files
3. **Review Data Preview**: Automatically generated summary shows columns and sample data
4. **Add Optional Prompt**: Describe specific chart preferences (e.g., "Show as a line chart")
5. **Generate Chart**: AI analyzes your data and creates the optimal visualization

### File Format Examples

**CSV Example:**
```csv
Month,Sales,Profit
January,12000,3000
February,15000,4500
March,18000,5400
```

**JSON Example:**
```json
[
  {"month": "January", "sales": 12000, "profit": 3000},
  {"month": "February", "sales": 15000, "profit": 4500},
  {"month": "March", "sales": 18000, "profit": 5400}
]
```

## 🏗️ Database Setup

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
3. The migration will create:
   - `users` table with credit tracking
   - `charts` table for saved charts
   - `credit_transactions` table for transaction history
   - Row Level Security (RLS) policies
   - Automatic user profile creation trigger

### Required Tables

```sql
-- Users (extends auth.users)
users (id, email, full_name, credits, created_at, updated_at)

-- Charts
charts (id, user_id, title, prompt, config, model_used, credits_used, created_at)

-- Credit Transactions
credit_transactions (id, user_id, type, amount, description, stripe_payment_id, created_at)
```

## 💰 Pricing & Credits

### Credit Packages

| Package | Credits | Price | Price per Credit | Savings |
|---------|---------|-------|------------------|---------|
| Starter | 50 | $9.99 | $0.20 | - |
| Pro | 150 | $24.99 | $0.17 | 15% |
| Enterprise | 500 | $79.99 | $0.16 | 20% |

### Model Costs

| Model | Provider | Credits per Request |
|-------|----------|-------------------|
| GPT-3.5 Turbo | OpenAI | 1 credit |
| GPT-4 | OpenAI | 2 credits |
| GPT-4 Turbo | OpenAI | 3 credits |
| Claude 3 Haiku | Anthropic | 1 credit |
| Claude 3 Sonnet | Anthropic | 2 credits |
| Claude 3 Opus | Anthropic | 3 credits |
| Gemini Pro | Google | 2 credits |
| Gemini Pro Vision | Google | 3 credits |

## 🎯 Usage

### Text Prompt Method
1. **Sign in with Google** - Get 20 free trial credits
2. **Select an AI model** based on your needs and credit balance
3. **Describe your chart**:
   - "Create a bar chart showing monthly sales data for Q1-Q4"
   - "Generate a line chart of stock prices over the last year"
   - "Make a pie chart of customer demographics by age group"

### File Upload Method
1. **Switch to "Upload File" mode**
2. **Upload your data file** (CSV, JSON, TXT, TSV)
3. **Review the data preview** to ensure correct parsing
4. **Add optional instructions** for chart style or focus
5. **Generate your chart** with AI-powered optimization

### Chart Customization
- **Real-time customization panel** with live preview
- **10+ color palettes**: Business, vibrant, cool, warm, monochrome, and more
- **Typography controls**: Font family, sizes, weights
- **Layout options**: Padding, spacing, responsive breakpoints
- **Animation settings**: Duration, easing, enable/disable
- **Export options**: PNG, JPG, SVG, PDF with custom dimensions

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Header.tsx       # Navigation header
│   ├── LandingPage.tsx  # Main interface with file upload
│   ├── FileUpload.tsx   # File upload component
│   ├── PricingPage.tsx  # Credit packages
│   ├── ModelSelector.tsx # AI model selection
│   ├── ChartRenderer.tsx # Chart display
│   ├── EChartsRenderer.tsx # ECharts implementation
│   └── EChartsCustomizationPanel.tsx # Chart customization
├── lib/                # Core services
│   ├── supabase.ts     # Database client
│   ├── aiProviders.ts  # AI provider integrations
│   ├── fileParser.ts   # File parsing logic
│   ├── echartsDataTransforms.ts # Chart data transformation
│   └── stripe.ts       # Payment processing
├── stores/             # State management
│   └── authStore.ts    # Authentication state
├── types/              # TypeScript definitions
└── styles/             # CSS and styling
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run type-check` - TypeScript type checking
- `npm run lint` - ESLint code linting
- `npm run test` - Run tests with Vitest

### Key Dependencies

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ECharts** - Professional charting library (primary)
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **PapaParse** - CSV/TSV file parsing
- **Lucide React** - Beautiful icons

## 🎨 Design System

### Modern Dark Theme
- **Primary Color**: Orange (#cc785c) for accents and CTAs
- **Background**: Deep blacks (#0a0a0a, #1a1a1a, #2a2a2a)
- **Text**: Light grays (#f5f5f5, #a3a3a3)
- **Borders**: Subtle grays (#2a2a2a, #3a3a3a)

### Typography
- **Font Family**: Inter system font stack
- **Responsive sizing**: Mobile-first with consistent scale
- **Weight variations**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🔐 Authentication & Security

- **Google OAuth**: Secure authentication via Google with Supabase integration
- **Row Level Security**: Database-level security policies
- **File Processing**: Client-side file parsing for data privacy
- **Secure Payments**: Stripe-handled payment processing
- **Credit Validation**: Server-side credit balance checks

## 🌐 Deployment

### Cloudflare Pages

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set build output directory: `dist`
   - Add environment variables

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_STRIPE_PUBLISHABLE_KEY=your_production_stripe_key
```

## 📚 Documentation

- [File Upload Guide](docs/file-upload.md) - Detailed guide for file upload feature
- [API Reference](docs/api-reference.md) - Complete API documentation
- [Deployment Guide](docs/deployment.md) - Step-by-step deployment instructions
- [Development Setup](docs/development.md) - Local development environment setup
- [Architecture Overview](docs/architecture.md) - System architecture and design decisions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add TypeScript types for all new code
- Test file upload functionality with various formats
- Ensure responsive design for all new components
- Use the established dark theme design tokens

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [ECharts](https://echarts.apache.org/) for professional chart rendering
- [Supabase](https://supabase.com/) for backend-as-a-service
- [Stripe](https://stripe.com/) for payment processing
- [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/), [Google](https://ai.google.dev/) for AI models
- [PapaParse](https://www.papaparse.com/) for CSV parsing
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📧 Support

For support, please:
- Open an issue on GitHub for bugs or feature requests
- Contact [@whoiskatrin](https://twitter.com/whoiskatrin) on Twitter
- Check our documentation for detailed guides

## 🔮 Roadmap

- [ ] Excel (.xlsx) file support
- [ ] Real-time collaborative editing
- [ ] Chart templates library
- [ ] Advanced data transformation tools
- [ ] Integration with Google Sheets/Airtable
- [ ] API access for developers
- [ ] Bulk chart generation
- [ ] Custom branding options
- [ ] Team workspaces
- [ ] Advanced analytics dashboard