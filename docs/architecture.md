# Architecture Overview

This document provides a comprehensive overview of Chart GPT's system architecture, design decisions, and technical implementation.

## Table of Contents
- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Services](#backend-services)
- [Data Flow](#data-flow)
- [File Processing Pipeline](#file-processing-pipeline)
- [Chart Generation Pipeline](#chart-generation-pipeline)
- [State Management](#state-management)
- [Security Architecture](#security-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Design Decisions](#design-decisions)

## System Overview

Chart GPT is a modern web application built with a **serverless-first architecture** that leverages cloud services for scalability and cost-effectiveness.

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Backend APIs   │    │  External APIs  │
│                 │    │                 │    │                 │
│ • React 18      │◄──►│ • Supabase      │◄──►│ • OpenAI        │
│ • TypeScript    │    │ • Stripe        │    │ • Anthropic     │
│ • Tailwind CSS │    │ • Cloudflare    │    │ • Google AI     │
│ • ECharts       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Upload   │    │   Database      │    │   AI Models     │
│                 │    │                 │    │                 │
│ • Client-side   │    │ • PostgreSQL    │    │ • GPT-4/3.5     │
│ • PapaParse     │    │ • Row Level     │    │ • Claude 3      │
│ • Drag & Drop   │    │   Security      │    │ • Gemini Pro    │
│                 │    │ • Real-time     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- **React 18** with hooks and concurrent features
- **TypeScript** for type safety and developer experience
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **ECharts** for professional chart rendering
- **Framer Motion** for smooth animations
- **Zustand** for lightweight state management

**Backend Services:**
- **Supabase** for database, authentication, and real-time features
- **Stripe** for payment processing and subscription management
- **Cloudflare Pages** for hosting and CDN
- **Multiple AI Providers** for chart generation diversity

**Development Tools:**
- **Vitest** for unit and integration testing
- **ESLint + Prettier** for code quality
- **GitHub Actions** for CI/CD
- **Wrangler** for Cloudflare deployment

## Frontend Architecture

### Component Hierarchy

```
App
├── Header
│   ├── Navigation
│   ├── AuthButton
│   └── UserMenu
├── Router
│   ├── LandingPage
│   │   ├── FileUpload
│   │   ├── ChartRenderer
│   │   │   └── EChartsRenderer
│   │   ├── EChartsCustomizationPanel
│   │   ├── ModelSelector
│   │   └── InteractiveExamples
│   ├── PricingPage
│   ├── ChartTestSuite
│   └── EChartsDemo
└── Providers
    ├── AuthProvider
    ├── ThemeProvider
    └── ErrorBoundary
```

### Module Structure

```
src/
├── components/          # UI Components
│   ├── ui/             # Reusable UI primitives
│   ├── charts/         # Chart-specific components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── lib/                # Business Logic
│   ├── api/            # API integrations
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript definitions
├── stores/             # State Management
├── styles/             # Global styles
└── assets/             # Static assets
```

### Design Patterns

**Component Patterns:**
- **Compound Components** for complex UI (FileUpload, CustomizationPanel)
- **Render Props** for data fetching and state sharing
- **Higher-Order Components** for authentication and error handling
- **Custom Hooks** for reusable logic

**State Management Patterns:**
- **Local State** for component-specific data
- **Zustand Store** for global application state
- **React Query** for server state (if implemented)
- **Context API** for theme and authentication

## Backend Services

### Supabase Architecture

```
Supabase Instance
├── PostgreSQL Database
│   ├── auth.users (managed by Supabase)
│   ├── public.users (extended user profiles)
│   ├── public.charts (saved charts)
│   └── public.credit_transactions (payment history)
├── Auth Service
│   ├── Google OAuth integration
│   ├── JWT token management
│   └── Row Level Security policies
├── Real-time Service
│   ├── Chart updates
│   └── Credit balance changes
└── Edge Functions (future)
    ├── AI provider routing
    └── Webhook handlers
```

### Database Schema Design

**Normalized Schema:**
```sql
-- Core user management
users (1) ──── (N) charts
  │
  └──── (N) credit_transactions

-- Relationships
users.id = charts.user_id
users.id = credit_transactions.user_id
```

**Key Design Decisions:**
- **UUID Primary Keys** for security and distributed systems
- **JSONB for chart configs** for flexibility and performance
- **Timestamps with timezone** for accurate time tracking
- **Enum constraints** for data integrity (transaction types)

### Security Layer

**Row Level Security (RLS):**
```sql
-- Users can only access their own data
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Charts are user-isolated
CREATE POLICY "Users can read own charts" ON charts
  FOR SELECT USING (auth.uid() = user_id);

-- Transactions are user-isolated
CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);
```

## Data Flow

### Authentication Flow

```
User → Google OAuth → Supabase Auth → JWT Token → Client Store
  ↓
Database Trigger → Create User Profile → Update Client State
  ↓
Credit Balance Check → Enable/Disable Features → UI Updates
```

### Chart Generation Flow

```
User Input (Text/File) → Input Validation → AI Provider Selection
  ↓
Credit Check → AI API Call → Response Parsing → Chart Config
  ↓
ECharts Transformation → Render Chart → Update Credit Balance
  ↓
Save to Database (optional) → Export Options → User Download
```

## File Processing Pipeline

### Upload Pipeline

```
File Drop/Select → File Validation → Type Detection → Parser Selection
  ↓
CSV → PapaParse → Data Transformation → Column Detection
JSON → JSON.parse → Structure Analysis → Nested Object Flattening
TXT → Delimiter Detection → Auto-parsing → Data Normalization
TSV → Tab-specific PapaParse → Same as CSV flow
  ↓
Data Preview Generation → User Confirmation → Chart Generation
```

### Data Transformation

```typescript
// Pipeline stages
RawFile → ParsedData → NormalizedData → ChartData → EChartsConfig

interface ParsedData {
  data: Record<string, any>[];    // Raw parsed rows
  columns: string[];              // Column names
  fileName: string;               // Original filename
  fileType: string;              // Detected file type
}

interface NormalizedData extends ParsedData {
  numericColumns: string[];       // Detected numeric columns
  categoryColumns: string[];      // Detected category columns
  dateColumns: string[];          // Detected date columns
  dataTypes: Record<string, DataType>; // Column type mapping
}
```

### Parser Architecture

```typescript
abstract class FileParser {
  abstract parse(file: File): Promise<ParseResult>;
  
  static getParser(fileType: string): FileParser {
    switch (fileType) {
      case 'csv': return new CSVParser();
      case 'json': return new JSONParser();
      case 'txt': return new TXTParser();
      case 'tsv': return new TSVParser();
      default: throw new Error('Unsupported format');
    }
  }
}

// Strategy pattern for different file types
class CSVParser extends FileParser {
  async parse(file: File): Promise<ParseResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(this.transformResults(results))
      });
    });
  }
}
```

## Chart Generation Pipeline

### AI Integration Architecture

```typescript
interface AIProvider {
  generateChart(prompt: string, context?: string): Promise<string>;
  validateApiKey(key: string): Promise<boolean>;
  getCost(): number;
}

class AIProviderService {
  private providers: Map<string, AIProvider> = new Map();
  
  constructor(config: AIConfig) {
    this.providers.set('openai', new OpenAIProvider(config.openaiKey));
    this.providers.set('anthropic', new AnthropicProvider(config.anthropicKey));
    this.providers.set('google', new GoogleProvider(config.googleKey));
  }
  
  async generateChart(prompt: string, model: string, context?: string): Promise<string> {
    const provider = this.getProvider(model);
    return provider.generateChart(prompt, context);
  }
}
```

### Chart Configuration Pipeline

```
AI Response (JSON string) → Parse & Validate → Chart.js Format
  ↓
Data Transformation → ECharts Format → Apply Customizations
  ↓
Theme Application → Responsive Settings → Animation Configuration
  ↓
Final ECharts Config → Render to DOM → Export Capabilities
```

### ECharts Integration

```typescript
// Transformation pipeline
interface ChartTransformer {
  transform(config: ChartConfig): EChartsOption;
}

class EChartsDataTransformer implements ChartTransformer {
  transform(config: ChartConfig): EChartsOption {
    const baseConfig = this.createBaseConfig(config);
    const seriesConfig = this.transformSeries(config);
    const styleConfig = this.applyCustomization(config.customization);
    
    return mergeDeep(baseConfig, seriesConfig, styleConfig);
  }
  
  private transformSeries(config: ChartConfig): Partial<EChartsOption> {
    switch (config.type) {
      case 'bar': return this.transformBarChart(config);
      case 'line': return this.transformLineChart(config);
      case 'pie': return this.transformPieChart(config);
      // ... other chart types
    }
  }
}
```

## State Management

### Zustand Store Architecture

```typescript
// Auth Store
interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  
  // Actions
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateCredits: (amount: number) => void;
}

// Chart Store (if needed)
interface ChartState {
  currentChart: ChartConfig | null;
  savedCharts: Chart[];
  isGenerating: boolean;
  
  // Actions
  setCurrentChart: (chart: ChartConfig) => void;
  saveChart: (chart: Chart) => Promise<void>;
  loadCharts: () => Promise<void>;
}
```

### State Flow Patterns

```
Component → Action → Store Update → Derived State → Re-render
    ↓
Side Effects → API Calls → Store Update → UI Update
    ↓
Error Handling → Error State → User Notification
```

## Security Architecture

### Authentication Security

```
Google OAuth → Supabase Auth → JWT Token (httpOnly cookie)
    ↓
Row Level Security → Database Access Control
    ↓
API Key Management → User-controlled or Server-provided
```

### Data Security

**Client-side File Processing:**
- Files never leave the user's browser for parsing
- Data is only sent to AI providers for chart generation
- No file storage on servers

**Database Security:**
- Row Level Security (RLS) policies
- UUID-based primary keys
- Encrypted connections (SSL/TLS)
- Regular security updates

**API Security:**
- Rate limiting on client and server side
- Input validation and sanitization
- CORS configuration
- Content Security Policy (CSP)

### Privacy Considerations

```
Data Flow Privacy:
User Files → Client-side Parsing → Minimal Data → AI Provider
                ↓
         No file storage → No personal data retention
                ↓
         Chart configs only → Database storage
```

## Performance Optimizations

### Frontend Optimizations

**Bundle Optimization:**
```typescript
// Code splitting by route
const PricingPage = lazy(() => import('./components/PricingPage'));
const ChartTestSuite = lazy(() => import('./components/ChartTestSuite'));

// Vendor chunk separation
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['echarts', 'echarts-for-react'],
          ai: ['openai', '@anthropic-ai/sdk']
        }
      }
    }
  }
});
```

**Rendering Optimizations:**
```typescript
// React.memo for expensive components
export const ChartRenderer = React.memo<ChartRendererProps>(({ config }) => {
  return <EChartsRenderer config={config} />;
}, (prevProps, nextProps) => {
  return isEqual(prevProps.config, nextProps.config);
});

// Virtual scrolling for large datasets
const VirtualizedTable = ({ data }: { data: any[] }) => {
  return (
    <FixedSizeList
      height={400}
      itemCount={data.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
};
```

### Backend Optimizations

**Database Optimizations:**
```sql
-- Indexes for common queries
CREATE INDEX idx_charts_user_id ON charts(user_id);
CREATE INDEX idx_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_charts_created_at ON charts(created_at DESC);

-- Partial indexes for performance
CREATE INDEX idx_active_users ON users(id) WHERE credits > 0;
```

**Caching Strategy:**
```typescript
// Client-side caching
const chartCache = new Map<string, ChartConfig>();

const getCachedChart = (prompt: string): ChartConfig | null => {
  return chartCache.get(prompt) || null;
};

// Service worker caching for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

## Design Decisions

### Technology Choices

**React over Vue/Angular:**
- Rich ecosystem and community
- Better TypeScript integration
- Performance with concurrent features
- Team expertise and hiring considerations

**ECharts over D3/Chart.js:**
- Professional-grade chart library
- Comprehensive chart type support
- Better performance for complex visualizations
- Built-in animations and interactions

**Supabase over Firebase:**
- PostgreSQL over NoSQL for relational data
- Better pricing model for our use case
- Row Level Security built-in
- Real-time features without vendor lock-in

**Zustand over Redux:**
- Simpler API and less boilerplate
- Better TypeScript support out of the box
- Smaller bundle size
- Easier testing and debugging

### Architecture Decisions

**Client-side File Processing:**
- **Pro:** Enhanced privacy, reduced server costs, faster processing
- **Con:** Limited by browser memory, no server-side validation
- **Decision:** Privacy and cost benefits outweigh limitations

**Multi-AI Provider Support:**
- **Pro:** Redundancy, cost optimization, feature diversity
- **Con:** Increased complexity, multiple API integrations
- **Decision:** User choice and reliability justify complexity

**Serverless Architecture:**
- **Pro:** Cost-effective scaling, reduced maintenance, faster deployment
- **Con:** Cold starts, vendor lock-in, debugging complexity
- **Decision:** Benefits align with startup constraints and growth plans

### Scalability Considerations

**Horizontal Scaling:**
```
Current: Single-region deployment
Future: Multi-region with edge computing
    ↓
CDN → Edge Functions → Regional Databases
    ↓
Global user base → Reduced latency → Better UX
```

**Vertical Scaling:**
- Database connection pooling
- Read replicas for analytics
- Caching layers (Redis)
- Background job processing

**Feature Scaling:**
- Microservices extraction (AI service, file processing)
- API versioning strategy
- Feature flags for gradual rollouts
- A/B testing infrastructure

This architecture provides a solid foundation for Chart GPT's current needs while maintaining flexibility for future growth and feature additions.