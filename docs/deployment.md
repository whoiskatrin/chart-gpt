# Deployment Guide

This guide covers deploying Chart GPT to production environments, with a focus on Cloudflare Pages as the primary platform.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
- [Alternative Deployment Options](#alternative-deployment-options)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)

## Prerequisites

Before deploying Chart GPT, ensure you have:

### Required Accounts
- **GitHub Account**: For code repository and CI/CD
- **Cloudflare Account**: For hosting (free tier available)
- **Supabase Account**: For database and authentication
- **Stripe Account**: For payment processing
- **AI Provider Accounts**: OpenAI, Anthropic, and/or Google

### Required Tools
- **Node.js 18+**: For building the application
- **Git**: For version control
- **wrangler CLI**: For Cloudflare Pages deployment (optional)

```bash
npm install -g wrangler
```

## Environment Setup

### 1. Create Production Environment Files

Create separate environment configurations for production:

**`.env.production`**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration  
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# AI Provider Keys (Optional - can be user-provided)
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=AIza...

# App Configuration
VITE_APP_URL=https://your-domain.com
VITE_APP_NAME=Chart GPT
```

### 2. Build Configuration

Update `vite.config.ts` for production optimizations:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['echarts', 'echarts-for-react'],
          ui: ['framer-motion', 'lucide-react'],
          ai: ['openai', '@anthropic-ai/sdk', '@google/generative-ai']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    global: 'globalThis',
  }
})
```

## Cloudflare Pages Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to **Pages** → **Create a project**
   - Select **Connect to Git**
   - Choose your GitHub repository
   - Configure build settings:
     - **Production branch**: `main`
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`

3. **Add Environment Variables**
   In Cloudflare Pages settings, add:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_OPENAI_API_KEY=sk-...
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   VITE_GOOGLE_API_KEY=AIza...
   ```

4. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will automatically build and deploy your app
   - Your app will be available at `https://your-project.pages.dev`

### Method 2: Direct Upload

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Upload via Wrangler**
   ```bash
   npx wrangler pages deploy dist --project-name chart-gpt
   ```

3. **Configure Environment Variables**
   ```bash
   npx wrangler pages secret put VITE_SUPABASE_URL
   npx wrangler pages secret put VITE_SUPABASE_ANON_KEY
   npx wrangler pages secret put VITE_STRIPE_PUBLISHABLE_KEY
   ```

## Alternative Deployment Options

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure `vercel.json`**
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/.*",
         "dest": "/index.html"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Configure `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Docker Deployment

1. **Create `Dockerfile`**
   ```dockerfile
   FROM node:18-alpine AS builder

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create `nginx.conf`**
   ```nginx
   events {
     worker_connections 1024;
   }

   http {
     include /etc/nginx/mime.types;
     default_type application/octet-stream;

     server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;

       location / {
         try_files $uri $uri/ /index.html;
       }

       location /api {
         proxy_pass http://backend:3001;
       }
     }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t chart-gpt .
   docker run -p 80:80 chart-gpt
   ```

## Database Configuration

### Supabase Production Setup

1. **Create Production Database**
   - Create a new Supabase project for production
   - Or upgrade your existing project to Pro tier

2. **Run Migrations**
   ```sql
   -- Copy the contents of supabase/migrations/001_initial_schema.sql
   -- And run in the SQL editor of your production Supabase project
   ```

3. **Configure Row Level Security**
   Ensure RLS policies are properly configured:
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
   ```

4. **Set Up Realtime (Optional)**
   If using realtime features:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE charts;
   ALTER PUBLICATION supabase_realtime ADD TABLE credit_transactions;
   ```

### Database Backups

1. **Automated Backups**
   - Supabase Pro plans include automated daily backups
   - Configure backup retention period in dashboard

2. **Manual Backups**
   ```bash
   # Using pg_dump (requires database access)
   pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
   ```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_OPENAI_API_KEY` | OpenAI API key | User-provided |
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key | User-provided |
| `VITE_GOOGLE_API_KEY` | Google AI API key | User-provided |
| `VITE_APP_URL` | Application URL | Auto-detected |
| `VITE_APP_NAME` | Application name | `Chart GPT` |

### Security Best Practices

1. **Never commit secrets to Git**
   ```bash
   # Add to .gitignore
   .env.production
   .env.local
   *.key
   ```

2. **Use environment-specific keys**
   - Development: `sk_test_...` (Stripe), test projects (Supabase)
   - Production: `sk_live_...` (Stripe), production projects (Supabase)

3. **Rotate keys regularly**
   - Set up key rotation schedule
   - Monitor for unauthorized usage

## Monitoring and Analytics

### Application Monitoring

1. **Cloudflare Analytics**
   - Built-in analytics for Pages
   - Page views, unique visitors, bandwidth usage
   - Core Web Vitals monitoring

2. **Supabase Analytics**
   - Database performance metrics
   - API usage statistics
   - Real-time connection monitoring

3. **Custom Analytics**
   Add Google Analytics or Plausible:
   ```html
   <!-- In index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_TRACKING_ID');
   </script>
   ```

### Error Monitoring

1. **Sentry Integration**
   ```bash
   npm install @sentry/react
   ```

   ```typescript
   // src/main.tsx
   import * as Sentry from "@sentry/react";

   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     environment: "production",
   });
   ```

2. **Custom Error Tracking**
   ```typescript
   // lib/errorTracking.ts
   export const trackError = (error: Error, context?: any) => {
     if (import.meta.env.PROD) {
       // Send to error tracking service
       console.error('Production Error:', error, context);
     }
   };
   ```

### Performance Monitoring

1. **Core Web Vitals**
   ```typescript
   // lib/performance.ts
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

   function sendToAnalytics(metric: any) {
     // Send metrics to your analytics service
     console.log(metric);
   }

   getCLS(sendToAnalytics);
   getFID(sendToAnalytics);
   getFCP(sendToAnalytics);
   getLCP(sendToAnalytics);
   getTTFB(sendToAnalytics);
   ```

## Performance Optimization

### Build Optimizations

1. **Bundle Analysis**
   ```bash
   npm install --save-dev bundle-analyzer
   npx vite-bundle-analyzer
   ```

2. **Code Splitting**
   ```typescript
   // Lazy load components
   const PricingPage = lazy(() => import('./components/PricingPage'));
   const ChartTestSuite = lazy(() => import('./components/ChartTestSuite'));

   // Route-based code splitting
   <Route path="/pricing" element={
     <Suspense fallback={<Loading />}>
       <PricingPage />
     </Suspense>
   } />
   ```

3. **Asset Optimization**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           assetFileNames: (assetInfo) => {
             const info = assetInfo.name.split('.');
             const ext = info[info.length - 1];
             if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
               return `assets/images/[name]-[hash][extname]`;
             }
             return `assets/[name]-[hash][extname]`;
           },
         },
       },
     },
   });
   ```

### Runtime Optimizations

1. **Service Worker**
   ```javascript
   // public/sw.js
   self.addEventListener('fetch', (event) => {
     if (event.request.destination === 'image') {
       event.respondWith(
         caches.match(event.request).then((response) => {
           return response || fetch(event.request);
         })
       );
     }
   });
   ```

2. **Preloading**
   ```html
   <!-- In index.html -->
   <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preconnect" href="https://api.openai.com">
   <link rel="preconnect" href="https://api.anthropic.com">
   ```

## Security Considerations

### HTTPS and SSL

1. **Force HTTPS**
   ```javascript
   // Cloudflare Pages automatically handles this
   // For custom domains, ensure SSL certificate is configured
   ```

2. **Security Headers**
   ```typescript
   // _headers file for Cloudflare Pages
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: camera=(), microphone=(), geolocation=()
   ```

### Content Security Policy

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com;
">
```

### API Security

1. **Rate Limiting**
   - Implement client-side rate limiting
   - Use Supabase's built-in rate limiting
   - Consider Cloudflare's rate limiting rules

2. **Input Validation**
   ```typescript
   const validateFileUpload = (file: File) => {
     const maxSize = 10 * 1024 * 1024; // 10MB
     const allowedTypes = ['text/csv', 'application/json', 'text/plain', 'text/tab-separated-values'];
     
     if (file.size > maxSize) {
       throw new Error('File too large');
     }
     
     if (!allowedTypes.includes(file.type)) {
       throw new Error('Invalid file type');
     }
   };
   ```

## Troubleshooting

### Common Deployment Issues

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variable Issues**
```bash
# Check if variables are loaded
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

**Database Connection Issues**
- Verify Supabase URL and keys
- Check RLS policies
- Ensure database migrations are applied

**Stripe Integration Issues**
- Verify publishable key format
- Check webhook endpoints
- Test in Stripe dashboard

### Performance Issues

**Large Bundle Size**
- Analyze bundle with `vite-bundle-analyzer`
- Implement code splitting
- Remove unused dependencies

**Slow Chart Rendering**
- Limit data points for large datasets
- Implement virtualization
- Use chart caching

**Database Performance**
- Add appropriate indexes
- Optimize queries
- Monitor Supabase performance dashboard

## Rollback Strategy

### Quick Rollback

1. **Cloudflare Pages**
   - Go to deployments tab
   - Click "Rollback" on previous deployment

2. **Git-based Rollback**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Database Rollback**
   ```sql
   -- Restore from backup if needed
   -- Test in development first
   ```

### Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate active
- [ ] Domain properly configured
- [ ] Error monitoring active
- [ ] Performance monitoring setup
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Team notified of deployment