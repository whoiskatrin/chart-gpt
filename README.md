# Chart GPT - AI-Powered Chart Generation with Credits System

<div align="center">
    <img src="https://raw.githubusercontent.com/whoiskatrin/chart-gpt/main/public/chartgpt-og.png" width="600" />
</div>

Generate beautiful, customizable charts from natural language using multiple AI providers (OpenAI, Anthropic, Google). Features user authentication, credit-based pricing, and Vercel-inspired design.

## ✨ Features

- 🔐 **Google Authentication**: Secure login with Google OAuth via Supabase
- 💳 **Credit System**: Pay-per-use model with Stripe integration
- 🤖 **Multiple AI Providers**: OpenAI GPT-4, Anthropic Claude, Google Gemini
- 📊 **Advanced Chart Types**: Bar, line, pie, scatter, heatmap, treemap, sankey, and more
- 🎨 **Full Customization**: Colors, typography, layout, animations, and responsive design
- 📱 **Responsive Design**: Vercel-inspired UI that adapts to all devices
- 💾 **Export Options**: PNG, JPG, SVG formats with custom dimensions
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

1. **Sign in with Google** - Get 20 free test credits
2. **Add your AI provider API keys** in the dashboard
3. **Select an AI model** based on your needs and credit balance
4. **Describe your chart and data requirements**:
   - "Create a bar chart showing monthly sales data for Q1-Q4"
   - "Generate a line chart of stock prices over the last year"
   - "Make a pie chart of customer demographics by age group"
5. **Customize your chart** with the advanced customization panel
6. **Export in multiple formats** (PNG, JPG, SVG)
7. **Buy more credits** when needed through integrated Stripe checkout

## 🎨 Design System

### Vercel-Inspired UI
- Clean, minimal design with orange accent color (#f97316)
- Consistent spacing and typography
- Subtle shadows and borders
- Responsive layout with mobile-first approach

### Color Palette
- **Primary Orange**: #f97316 (buttons, accents, highlights)
- **Vercel Black**: #000000 (headings, primary text)
- **Vercel Gray**: #666666 (secondary text)
- **Light Grays**: #fafafa, #eaeaea (backgrounds, borders)

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── AuthForm.tsx     # Login/signup form
│   ├── Header.tsx       # Navigation header
│   ├── Dashboard.tsx    # Main dashboard
│   ├── PricingPage.tsx  # Credit packages
│   ├── ModelSelector.tsx # AI model selection
│   ├── ChartRenderer.tsx # Chart display
│   └── CustomizationPanel.tsx # Chart customization
├── lib/                # Core services
│   ├── supabase.ts     # Database client
│   ├── aiProviders.ts  # AI provider integrations
│   ├── creditSystem.ts # Credit management
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

## 🔐 Authentication & Security

- **Google OAuth**: Secure authentication via Google with Supabase integration
- **Row Level Security**: Database-level security policies
- **API Key Storage**: Users enter their own AI provider keys (not stored on backend)
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

## 🧪 Testing

### Manual Testing Checklist

- [ ] Google OAuth authentication
- [ ] User login/logout functionality
- [ ] Credit balance display and updates
- [ ] AI model selection based on credit availability
- [ ] Chart generation with all supported models
- [ ] Chart customization and export
- [ ] Credit purchase flow (demo mode)
- [ ] Responsive design on mobile/tablet/desktop

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add TypeScript types for all new code
- Update tests for any new functionality
- Ensure responsive design for all new components
- Use the established color palette and design tokens

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Vercel](https://vercel.com/) for design inspiration
- [Supabase](https://supabase.com/) for backend-as-a-service
- [Stripe](https://stripe.com/) for payment processing
- [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/), [Google](https://ai.google.dev/) for AI models
- [Chart.js](https://www.chartjs.org/) and [Plotly.js](https://plotly.com/javascript/) for chart rendering

## 📧 Support

For support, please:
- Open an issue on GitHub for bugs or feature requests
- Contact [@whoiskatrin](https://twitter.com/whoiskatrin) on Twitter
- Check our [documentation](https://docs.your-domain.com) for detailed guides

## 🔮 Roadmap

- [ ] API access for developers
- [ ] Bulk chart generation
- [ ] Chart templates library
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Custom branding options
- [ ] Integration with popular data sources
