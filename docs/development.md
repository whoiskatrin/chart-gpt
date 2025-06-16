# Development Setup Guide

This guide will help you set up a local development environment for Chart GPT and understand the development workflow.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Environment Setup](#local-environment-setup)
- [Database Setup](#database-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style and Standards](#code-style-and-standards)
- [Debugging](#debugging)
- [Performance Considerations](#performance-considerations)

## Prerequisites

### Required Software
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn**: Comes with Node.js (npm) or install [yarn](https://yarnpkg.com/)
- **Git**: Download from [git-scm.com](https://git-scm.com/)
- **VS Code** (recommended): Download from [code.visualstudio.com](https://code.visualstudio.com/)

### Required Accounts (for full functionality)
- **Supabase**: [supabase.com](https://supabase.com) (free tier available)
- **Stripe**: [stripe.com](https://stripe.com) (test mode free)
- **OpenAI**: [platform.openai.com](https://platform.openai.com) (credits required)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com) (credits required)
- **Google AI**: [ai.google.dev](https://ai.google.dev) (free tier available)

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## Local Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/whoiskatrin/chart-gpt.git
cd chart-gpt
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# AI Provider API Keys (Optional for development)
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=AIza...

# Development Settings
VITE_DEV_MODE=true
VITE_APP_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Setup

### Option 1: Supabase Cloud (Recommended)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project" 
   - Create a new organization and project

2. **Get Your Credentials**
   - Go to Settings → API
   - Copy the Project URL and anon public key
   - Add them to your `.env` file

3. **Run Database Migration**
   - Go to SQL Editor in Supabase dashboard
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the SQL to create tables and policies

### Option 2: Local Supabase (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

### Verify Database Setup

Test the connection in your app:
1. Start the dev server (`npm run dev`)
2. Try to sign in with Google
3. Check if user profile is created automatically

## Development Workflow

### Project Structure Understanding

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── charts/         # Chart-related components
│   └── forms/          # Form components
├── lib/                # Core business logic
│   ├── api/            # API integrations
│   ├── utils/          # Utility functions
│   └── types/          # Type definitions
├── stores/             # State management (Zustand)
├── hooks/              # Custom React hooks
├── styles/             # Global styles and themes
├── assets/             # Static assets
└── __tests__/          # Test files
```

### Key Development Files

**Core Configuration:**
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - Styling configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

**Main Entry Points:**
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app component with routing
- `src/components/LandingPage.tsx` - Primary interface

### Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Create Components**
   ```bash
   # Create new component
   touch src/components/YourComponent.tsx
   
   # Create corresponding test
   touch src/__tests__/YourComponent.test.tsx
   ```

3. **Follow TypeScript Patterns**
   ```typescript
   // Example component structure
   import React from 'react';
   import { SomeIcon } from 'lucide-react';
   
   interface YourComponentProps {
     title: string;
     onAction: (data: string) => void;
     optional?: boolean;
   }
   
   export const YourComponent: React.FC<YourComponentProps> = ({
     title,
     onAction,
     optional = false
   }) => {
     return (
       <div className="bg-gray-100 p-4 rounded-lg">
         <h3 className="text-lg font-semibold">{title}</h3>
         {/* Component content */}
       </div>
     );
   };
   ```

4. **Add Tests**
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { YourComponent } from '../components/YourComponent';
   
   describe('YourComponent', () => {
     it('renders with title', () => {
       render(
         <YourComponent 
           title="Test Title" 
           onAction={() => {}} 
         />
       );
       
       expect(screen.getByText('Test Title')).toBeInTheDocument();
     });
   });
   ```

### File Upload Feature Development

When working on file upload functionality:

1. **Test with Sample Files**
   ```bash
   # Create test data directory
   mkdir test-data
   
   # Add sample files
   echo "Name,Age,City
   John,25,NYC
   Jane,30,LA" > test-data/sample.csv
   ```

2. **Debug File Parsing**
   ```typescript
   // Add console logs for debugging
   console.log('File type:', file.type);
   console.log('File size:', file.size);
   console.log('Parsed data:', result.data);
   ```

3. **Test Error Handling**
   - Upload invalid files
   - Upload very large files
   - Upload empty files
   - Test network failures

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```typescript
// __tests__/fileParser.test.ts
import { FileParser } from '../lib/fileParser';

describe('FileParser', () => {
  describe('parseCSV', () => {
    it('should parse valid CSV data', async () => {
      const csvContent = 'Name,Age\nJohn,25\nJane,30';
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
      
      const result = await FileParser.parseFile(file);
      
      expect(result.success).toBe(true);
      expect(result.data?.data).toHaveLength(2);
      expect(result.data?.columns).toEqual(['Name', 'Age']);
    });
    
    it('should handle parsing errors', async () => {
      const invalidFile = new File(['invalid content'], 'test.txt', { type: 'text/plain' });
      
      const result = await FileParser.parseFile(invalidFile);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

### Integration Testing

Test the complete file upload flow:

```typescript
// __tests__/integration/fileUpload.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from '../components/FileUpload';

describe('File Upload Integration', () => {
  it('should handle complete upload flow', async () => {
    const onFileProcessed = jest.fn();
    const onError = jest.fn();
    
    render(
      <FileUpload 
        onFileProcessed={onFileProcessed}
        onError={onError}
      />
    );
    
    const csvContent = 'Name,Value\nTest,123';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const input = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(onFileProcessed).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({ Name: 'Test', Value: 123 })
          ])
        })
      );
    });
  });
});
```

## Code Style and Standards

### ESLint Configuration

The project uses ESLint with TypeScript rules:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### TypeScript Standards

1. **Always use TypeScript**
   ```typescript
   // ✅ Good
   interface User {
     id: string;
     name: string;
   }
   
   // ❌ Avoid
   const user: any = { id: '1', name: 'John' };
   ```

2. **Use proper exports**
   ```typescript
   // ✅ Good - Named exports for components
   export const MyComponent: React.FC = () => { ... };
   
   // ✅ Good - Default exports for pages/main components
   export default MyPage;
   ```

3. **Props interfaces**
   ```typescript
   // ✅ Good
   interface ButtonProps {
     onClick: () => void;
     disabled?: boolean;
     children: React.ReactNode;
   }
   
   export const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, children }) => {
     // ...
   };
   ```

### CSS/Tailwind Standards

1. **Use Tailwind utility classes**
   ```typescript
   // ✅ Good
   <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
   
   // ❌ Avoid custom CSS unless necessary
   <div className="custom-card">
   ```

2. **Responsive design**
   ```typescript
   // ✅ Good - Mobile first
   <div className="text-sm md:text-base lg:text-lg">
   
   // ✅ Good - Responsive layouts
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
   ```

3. **Dark mode support**
   ```typescript
   // ✅ Good - Support both themes
   <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
   ```

### Git Commit Standards

Use conventional commits:

```bash
# Feature additions
git commit -m "feat: add file upload drag and drop functionality"

# Bug fixes  
git commit -m "fix: resolve CSV parsing issue with empty cells"

# Documentation
git commit -m "docs: update API reference for file parser"

# Refactoring
git commit -m "refactor: extract chart generation logic to separate service"

# Tests
git commit -m "test: add integration tests for file upload component"
```

## Debugging

### Browser Developer Tools

1. **Network Tab**
   - Monitor API calls to Supabase
   - Check file upload progress
   - Verify environment variables

2. **Console Tab**
   - Check for JavaScript errors
   - View custom console.log statements
   - Monitor file parsing logs

3. **React Developer Tools**
   - Install React DevTools extension
   - Inspect component state
   - Profile component renders

### VS Code Debugging

1. **Create `.vscode/launch.json`**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Launch Chrome",
         "request": "launch",
         "type": "chrome",
         "url": "http://localhost:3000",
         "webRoot": "${workspaceFolder}/src",
         "breakOnLoad": true,
         "sourceMaps": true
       }
     ]
   }
   ```

2. **Set Breakpoints**
   - Click in the gutter next to line numbers
   - Use `debugger;` statements in code
   - Inspect variables and call stack

### Common Issues and Solutions

**File Upload Not Working**
```typescript
// Debug file parsing
console.log('File details:', {
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified
});

// Check file content
const text = await file.text();
console.log('File content preview:', text.substring(0, 200));
```

**Chart Not Rendering**
```typescript
// Debug chart configuration
console.log('Chart config:', JSON.stringify(chartConfig, null, 2));

// Check ECharts errors
useEffect(() => {
  const handleEChartsError = (error: any) => {
    console.error('ECharts error:', error);
  };
  
  window.addEventListener('error', handleEChartsError);
  return () => window.removeEventListener('error', handleEChartsError);
}, []);
```

**Environment Variables Not Loading**
```typescript
// Debug environment
console.log('Environment check:', {
  nodeEnv: import.meta.env.MODE,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasStripeKey: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
});
```

## Performance Considerations

### Development Performance

1. **Hot Module Replacement**
   - Vite provides fast HMR out of the box
   - Avoid full page refreshes when possible
   - Use React Fast Refresh for component updates

2. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npm run build
   npx vite-bundle-analyzer dist
   ```

3. **Memory Usage**
   - Monitor memory in Chrome DevTools
   - Clear file data after processing
   - Dispose of chart instances properly

### Code Splitting

```typescript
// Lazy load heavy components
const ChartTestSuite = lazy(() => import('./components/ChartTestSuite'));
const PricingPage = lazy(() => import('./components/PricingPage'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <ChartTestSuite />
</Suspense>
```

### Data Handling

```typescript
// Limit data for development
const sampleData = import.meta.env.DEV 
  ? data.slice(0, 100) // Limit to 100 rows in dev
  : data;

// Use React.memo for expensive components
export const ChartRenderer = React.memo<ChartRendererProps>(({ config }) => {
  // Heavy chart rendering logic
});
```

## Environment-Specific Configuration

### Development Mode Features

```typescript
// lib/devTools.ts
export const devTools = {
  logChartConfig: (config: ChartConfig) => {
    if (import.meta.env.DEV) {
      console.group('Chart Configuration');
      console.log('Type:', config.type);
      console.log('Data:', config.data);
      console.log('Options:', config.options);
      console.groupEnd();
    }
  },
  
  measurePerformance: (label: string, fn: () => void) => {
    if (import.meta.env.DEV) {
      console.time(label);
      fn();
      console.timeEnd(label);
    } else {
      fn();
    }
  }
};
```

### Mock Data for Development

```typescript
// lib/mockData.ts
export const mockChartData = {
  sales: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Sales',
      data: [120000, 135000, 142000, 158000]
    }]
  },
  
  userGrowth: {
    labels: Array.from({length: 12}, (_, i) => `Month ${i + 1}`),
    datasets: [{
      label: 'Users',
      data: Array.from({length: 12}, () => Math.floor(Math.random() * 1000))
    }]
  }
};

// Use in development
const chartData = import.meta.env.DEV 
  ? mockChartData.sales 
  : realChartData;
```

### API Mocking

```typescript
// lib/apiMocks.ts
export const mockAIResponse = (prompt: string) => {
  if (import.meta.env.DEV && !import.meta.env.VITE_OPENAI_API_KEY) {
    // Return mock chart configuration
    return Promise.resolve(JSON.stringify({
      type: 'bar',
      data: mockChartData.sales,
      options: { responsive: true }
    }));
  }
  
  // Use real AI service
  return realAIService.generateChart(prompt);
};
```

This development setup provides a solid foundation for contributing to Chart GPT with proper tooling, testing, and debugging capabilities.