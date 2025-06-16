# API Reference

This document provides a comprehensive reference for Chart GPT's internal APIs, components, and services. This is primarily for developers contributing to the project.

## Table of Contents
- [File Parser API](#file-parser-api)
- [AI Providers API](#ai-providers-api)
- [Chart Configuration Types](#chart-configuration-types)
- [ECharts Integration](#echarts-integration)
- [Authentication Store](#authentication-store)
- [Database Schema](#database-schema)

## File Parser API

### `FileParser` Class

The main class for parsing uploaded files into structured data.

#### Methods

##### `parseFile(file: File): Promise<FileParseResult>`

Parses an uploaded file and returns structured data.

**Parameters:**
- `file: File` - The uploaded file object

**Returns:**
```typescript
interface FileParseResult {
  success: boolean;
  data?: ParsedData;
  error?: string;
}

interface ParsedData {
  data: Record<string, any>[];
  columns: string[];
  fileName: string;
  fileType: string;
}
```

**Example:**
```typescript
import { FileParser } from '@/lib/fileParser';

const handleFileUpload = async (file: File) => {
  const result = await FileParser.parseFile(file);
  
  if (result.success && result.data) {
    console.log(`Parsed ${result.data.data.length} rows`);
    console.log(`Columns: ${result.data.columns.join(', ')}`);
  } else {
    console.error(result.error);
  }
};
```

##### `generateDataSummary(parsedData: ParsedData): string`

Generates a human-readable summary of parsed data.

**Parameters:**
- `parsedData: ParsedData` - The parsed data object

**Returns:**
- `string` - Formatted summary including file info and sample data

**Example:**
```typescript
const summary = FileParser.generateDataSummary(parsedData);
console.log(summary);
// Output:
// File: sales_data.csv
// Rows: 150, Columns: 4
// Columns: Date, Revenue, Region, Product
// 
// Sample data:
// Row 1: {"Date":"2024-01","Revenue":125000,"Region":"North","Product":"Widget A"}
```

### Supported File Types

| Format | Parser Method | Notes |
|--------|---------------|--------|
| CSV | `parseCSV()` | Uses PapaParse with header detection |
| JSON | `parseJSON()` | Supports arrays and nested objects |
| TSV | `parseTSV()` | Tab-delimited, same as CSV with different delimiter |
| TXT | `parseTXT()` | Auto-detects delimiters or treats as line data |

## AI Providers API

### `AIProviderService` Class

Manages multiple AI providers for chart generation.

#### Constructor

```typescript
constructor(config: AIProvidersConfig)

interface AIProvidersConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  googleApiKey?: string;
}
```

#### Methods

##### `generateChart(prompt: string, model: string, dataContext?: string): Promise<string>`

Generates a chart configuration using the specified AI model.

**Parameters:**
- `prompt: string` - Natural language description of the desired chart
- `model: string` - AI model identifier (e.g., 'gpt-4', 'claude-3-sonnet')
- `dataContext?: string` - Optional data context for file-based charts

**Returns:**
- `Promise<string>` - JSON string containing chart configuration

**Example:**
```typescript
const aiService = new AIProviderService({
  openaiApiKey: 'sk-...',
  anthropicApiKey: 'sk-ant-...'
});

const chartConfig = await aiService.generateChart(
  'Create a bar chart showing quarterly sales',
  'gpt-4',
  JSON.stringify(salesData)
);
```

### Available Models

#### OpenAI Models
```typescript
{
  id: 'gpt-3.5-turbo',
  name: 'GPT-3.5 Turbo',
  provider: 'OpenAI',
  creditsPerRequest: 1,
  maxTokens: 4096
}

{
  id: 'gpt-4',
  name: 'GPT-4',
  provider: 'OpenAI', 
  creditsPerRequest: 2,
  maxTokens: 8192
}

{
  id: 'gpt-4-turbo-preview',
  name: 'GPT-4 Turbo',
  provider: 'OpenAI',
  creditsPerRequest: 3,
  maxTokens: 128000
}
```

#### Anthropic Models
```typescript
{
  id: 'claude-3-haiku-20240307',
  name: 'Claude 3 Haiku',
  provider: 'Anthropic',
  creditsPerRequest: 1,
  maxTokens: 200000
}

{
  id: 'claude-3-sonnet-20240229', 
  name: 'Claude 3 Sonnet',
  provider: 'Anthropic',
  creditsPerRequest: 2,
  maxTokens: 200000
}

{
  id: 'claude-3-opus-20240229',
  name: 'Claude 3 Opus', 
  provider: 'Anthropic',
  creditsPerRequest: 3,
  maxTokens: 200000
}
```

#### Google Models
```typescript
{
  id: 'gemini-pro',
  name: 'Gemini Pro',
  provider: 'Google',
  creditsPerRequest: 2,
  maxTokens: 32768
}

{
  id: 'gemini-pro-vision',
  name: 'Gemini Pro Vision',
  provider: 'Google', 
  creditsPerRequest: 3,
  maxTokens: 32768
}
```

## Chart Configuration Types

### `ChartConfig` Interface

The main interface for chart configurations.

```typescript
interface ChartConfig {
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
  customization: ChartCustomization;
}

type ChartType = 
  | 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter' 
  | 'area' | 'bubble' | 'radar' | 'polarArea'
  | 'histogram' | 'heatmap' | 'treemap' | 'sankey' 
  | 'funnel' | 'gauge' | 'sunburst' | 'graph'
  | 'composed' | 'tracker';
```

### `ChartData` Interface

```typescript
interface ChartData {
  labels?: string[];
  datasets: Dataset[];
}

interface Dataset {
  label: string;
  data: (number | DataPoint)[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
  [key: string]: any;
}

interface DataPoint {
  x: number | string;
  y: number;
  r?: number; // For bubble charts
}
```

### `ChartOptions` Interface

```typescript
interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio?: boolean;
  plugins: {
    title: {
      display: boolean;
      text: string;
      font?: {
        size: number;
        family: string;
        weight: string;
      };
      color?: string;
    };
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
      labels?: {
        color?: string;
        font?: {
          size: number;
          family: string;
        };
      };
    };
    tooltip?: {
      enabled: boolean;
      backgroundColor?: string;
      titleColor?: string;
      bodyColor?: string;
    };
  };
  scales?: {
    x?: ScaleConfig;
    y?: ScaleConfig;
  };
}

interface ScaleConfig {
  display: boolean;
  beginAtZero?: boolean;
  title?: {
    display: boolean;
    text: string;
  };
  grid?: {
    display: boolean;
    color?: string;
  };
  ticks?: {
    color?: string;
    font?: {
      size: number;
      family: string;
    };
  };
}
```

### `ChartCustomization` Interface

```typescript
interface ChartCustomization {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      title: number;
      labels: number;
      legend: number;
    };
  };
  layout: {
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  animations: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
  responsive: {
    enabled: boolean;
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  colorPalette: string;
  theme: 'light' | 'dark';
}
```

## ECharts Integration

### `EChartsDataTransformer` Class

Converts Chart.js-style configurations to ECharts format.

#### Methods

##### `transformToECharts(config: ChartConfig): EChartsOption`

Transforms a ChartConfig to ECharts format.

**Parameters:**
- `config: ChartConfig` - Chart configuration in Chart.js format

**Returns:**
- `EChartsOption` - ECharts-compatible configuration object

**Example:**
```typescript
import { EChartsDataTransformer } from '@/lib/echartsDataTransforms';

const echartsConfig = EChartsDataTransformer.transformToECharts(chartConfig);
```

### Color Palettes

```typescript
const ECHARTS_COLOR_PALETTES = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
  business: ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'],
  vibrant: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
  cool: ['#74b9ff', '#0984e3', '#00b894', '#00cec9', '#6c5ce7'],
  warm: ['#fd79a8', '#fdcb6e', '#e17055', '#d63031', '#e84393'],
  monochrome: ['#2d3436', '#636e72', '#b2bec3', '#ddd', '#fff'],
  ocean: ['#0077be', '#00a8cc', '#4db8d4', '#7fb3d3', '#a8c8ec'],
  sunset: ['#ff7675', '#fd79a8', '#fdcb6e', '#e17055', '#d63031'],
  nature: ['#00b894', '#55a3ff', '#fd79a8', '#fdcb6e', '#6c5ce7'],
  tech: ['#74b9ff', '#0984e3', '#00cec9', '#6c5ce7', '#a29bfe']
};
```

## Authentication Store

### `useAuthStore` Hook

Zustand store for managing authentication state.

#### State Properties

```typescript
interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}
```

#### Methods

##### `signInWithGoogle(): Promise<void>`

Initiates Google OAuth sign-in flow.

##### `signOut(): Promise<void>`

Signs out the current user and clears state.

##### `refreshUserProfile(): Promise<void>`

Fetches the latest user profile data from the database.

##### `updateCredits(amount: number): Promise<void>`

Updates the user's credit balance.

**Example:**
```typescript
import { useAuthStore } from '@/stores/authStore';

const LoginComponent = () => {
  const { user, signInWithGoogle, signOut } = useAuthStore();
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
};
```

## Database Schema

### Tables

#### `users` Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  credits INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `charts` Table

```sql
CREATE TABLE charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  prompt TEXT NOT NULL,
  config JSONB NOT NULL,
  model_used TEXT NOT NULL,
  credits_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `credit_transactions` Table

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
  amount INTEGER NOT NULL,
  description TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies

```sql
-- Users can only read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users  
  FOR UPDATE USING (auth.uid() = id);

-- Users can read their own charts
CREATE POLICY "Users can read own charts" ON charts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own charts
CREATE POLICY "Users can insert own charts" ON charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own transactions
CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);
```

## Error Handling

### Common Error Types

```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}

// File parsing errors
const FILE_ERRORS = {
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  PARSE_FAILED: 'PARSE_FAILED', 
  EMPTY_FILE: 'EMPTY_FILE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE'
};

// AI provider errors  
const AI_ERRORS = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  GENERATION_FAILED: 'GENERATION_FAILED'
};

// Credit system errors
const CREDIT_ERRORS = {
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  INVALID_TRANSACTION: 'INVALID_TRANSACTION',
  PAYMENT_FAILED: 'PAYMENT_FAILED'
};
```

### Error Handling Best Practices

```typescript
// File upload error handling
try {
  const result = await FileParser.parseFile(file);
  if (!result.success) {
    throw new Error(result.error);
  }
  // Process successful result
} catch (error) {
  if (error.message.includes('UNSUPPORTED_FORMAT')) {
    toast.error('File format not supported. Please use CSV, JSON, TXT, or TSV.');
  } else {
    toast.error(`Upload failed: ${error.message}`);
  }
}

// AI generation error handling
try {
  const chart = await aiService.generateChart(prompt, model);
  // Process successful generation
} catch (error) {
  if (error.code === 'INSUFFICIENT_CREDITS') {
    toast.error('Not enough credits. Please purchase more credits.');
  } else {
    toast.error('Chart generation failed. Please try again.');
  }
}
```

## Performance Considerations

### File Upload Optimization
- Maximum recommended file size: 10MB
- Process files client-side to reduce server load
- Show progress indicators for large files
- Implement chunked processing for very large datasets

### Chart Rendering Optimization
- Use React.memo for chart components
- Implement virtual scrolling for large datasets
- Lazy load chart libraries
- Cache generated configurations

### Memory Management
- Clear file data after processing
- Dispose of chart instances properly
- Implement garbage collection for large operations
- Monitor memory usage in development