# 📚 Nexa Data Platform Templates

This directory contains comprehensive templates for building consistent micro-frontends for the **Nexa Data Platform**. These templates ensure all modules follow the same design language, architecture patterns, and development standards.

## 📋 **Template Overview**

| Template | Purpose | File |
|----------|---------|------|
| **Agent Prompt Template** | AI development agent instructions for creating micro-frontends | `agent-prompt-template.md` |
| **Design System Template** | Complete design system with colors, typography, and components | `design-system-template.md` |
| **API Integration Template** | Standardized API patterns and service layers | `api-integration-template.md` |
| **Module Federation Template** | Webpack configuration and micro-frontend integration | `module-federation-template.md` |

## 🎯 **Platform Architecture**

```
Nexa Data Platform (Data Mesh)
├── Shell Application (Port 3000)
│   ├── Platform Header & Navigation
│   ├── Module Federation Host
│   └── Shared Layout Components
├── Micro-Frontends
│   ├── Nexa Lineage (Port 3001) - Data Lineage Tracking
│   ├── Nexa Analytics (Port 3002) - Data Analytics
│   ├── Nexa Governance (Port 3003) - Data Governance
│   ├── Nexa Quality (Port 3004) - Data Quality Management
│   └── Nexa Catalog (Port 3005) - Data Catalog
└── Shared Dependencies
    ├── Design System (@nexa/design-system)
    ├── Common Components (@nexa/shared-components)
    └── Utilities (@nexa/shared-utils)
```

## 🚀 **Quick Start Guide**

### **1. Using the Agent Prompt Template**

Copy the content from `agent-prompt-template.md` and use it as a prompt for AI development agents when creating new micro-frontends:

```bash
# Example usage with AI agent
cat templates/agent-prompt-template.md | your-ai-agent --create-micro-frontend nexa-analytics
```

### **2. Setting Up a New Micro-Frontend**

#### **Step 1: Create Project Structure**
```bash
mkdir nexa-analytics
cd nexa-analytics
npm init -y
```

#### **Step 2: Install Dependencies**
```bash
npm install react react-dom react-router-dom @tanstack/react-query
npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin ts-loader typescript
npm install @nexa/design-system @nexa/shared-components
```

#### **Step 3: Configure Webpack**
Copy the webpack configuration from `module-federation-template.md` and customize for your module:

```javascript
// webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  // ... base config
  plugins: [
    new ModuleFederationPlugin({
      name: 'nexaAnalytics',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './AnalyticsDashboard': './src/components/AnalyticsDashboard',
        './MetricsCard': './src/components/MetricsCard',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@nexa/design-system': { singleton: true, requiredVersion: '^1.0.0' },
      },
    }),
  ],
};
```

#### **Step 4: Implement Design System**
Copy the design system configuration from `design-system-template.md`:

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --nexa-primary-500: #3b82f6;
  --nexa-primary-600: #2563eb;
  /* ... all other colors */
}
```

#### **Step 5: Set Up API Integration**
Copy the API service patterns from `api-integration-template.md`:

```typescript
// services/AnalyticsAPI.ts
class AnalyticsAPI extends NexaPlatformAPI {
  constructor() {
    super('analytics');
  }

  async getMetrics(datasetId: string, timeRange: string) {
    return this.get(`/metrics/${datasetId}?timeRange=${timeRange}`);
  }
}
```

## 🎨 **Design System Implementation**

### **Color Palette (MUST USE)**
```css
/* Primary Brand Colors */
--nexa-primary-500: #3b82f6;  /* Main brand blue */
--nexa-primary-600: #2563eb;  /* Darker blue for hover */

/* Data Platform Specific Colors */
--nexa-data-green: #10b981;   /* Data success/health */
--nexa-data-orange: #f59e0b;  /* Data warnings */
--nexa-data-red: #ef4444;     /* Data errors/issues */
--nexa-data-purple: #8b5cf6;  /* Data insights/analytics */
```

### **Typography (MUST FOLLOW)**
```css
/* Font Family */
--nexa-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--nexa-font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
```

### **Component Library**
Use the provided component library from `design-system-template.md`:
- `NexaLogo` - Platform logo component
- `PlatformButton` - Standardized button component
- `PlatformCard` - Card layout component
- `PlatformHeader` - Navigation header component

## 🔌 **API Integration Patterns**

### **Base API Service**
```typescript
class NexaPlatformAPI {
  private baseURL: string;
  private module: string;

  constructor(module: string) {
    this.baseURL = process.env.NEXA_API_BASE_URL || 'http://localhost:8080/api';
    this.module = module;
  }

  protected async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Standardized request handling
  }
}
```

### **Module-Specific Services**
Extend the base API service for your specific module:

```typescript
class AnalyticsAPI extends NexaPlatformAPI {
  constructor() {
    super('analytics');
  }

  async getMetrics(datasetId: string, timeRange: string) {
    return this.get(`/metrics/${datasetId}?timeRange=${timeRange}`);
  }
}
```

### **React Query Integration**
```typescript
export const useMetrics = (datasetId: string, timeRange: string) => {
  return useQuery({
    queryKey: ['analytics', 'metrics', datasetId, timeRange],
    queryFn: () => new AnalyticsAPI().getMetrics(datasetId, timeRange),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
```

## 🔗 **Module Federation Setup**

### **Shell Application Configuration**
```javascript
// Shell webpack.config.js
new ModuleFederationPlugin({
  name: 'nexaShell',
  remotes: {
    nexaAnalytics: 'nexaAnalytics@http://localhost:3002/remoteEntry.js',
    // ... other modules
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    '@nexa/design-system': { singleton: true, requiredVersion: '^1.0.0' },
  },
})
```

### **Micro-Frontend Configuration**
```javascript
// Micro-frontend webpack.config.js
new ModuleFederationPlugin({
  name: 'nexaAnalytics',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
    './AnalyticsDashboard': './src/components/AnalyticsDashboard',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    '@nexa/design-system': { singleton: true, requiredVersion: '^1.0.0' },
  },
})
```

## 📝 **Development Guidelines**

### **Naming Conventions**
- **Platform**: Always refer to "Nexa Data Platform" (not "Nexa Lineage Platform")
- **Modules**: Use specific module names (Nexa Analytics, Nexa Governance, etc.)
- **Components**: Prefix with module name when specific (AnalyticsDashboard, GovernancePolicy)
- **CSS Classes**: Use `nexa-` prefix for platform-specific styles

### **File Structure**
```
nexa-analytics/
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── MetricsCard.tsx
│   │   └── TrendChart.tsx
│   ├── services/
│   │   └── AnalyticsAPI.ts
│   ├── hooks/
│   │   └── useAnalytics.ts
│   ├── types/
│   │   └── analytics.ts
│   ├── App.tsx
│   └── index.ts
├── public/
│   └── index.html
├── webpack.config.js
├── package.json
└── tsconfig.json
```

### **Component Patterns**
```typescript
// Example component following design system
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ datasetId }) => {
  const { data: metrics, isLoading } = useMetrics(datasetId, '7d');

  return (
    <div className="bg-white rounded-xl border border-nexa-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-nexa-gray-900 mb-4">
        Analytics Dashboard
      </h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexa-primary-600"></div>
        </div>
      ) : (
        <MetricsCard data={metrics} />
      )}
    </div>
  );
};
```

## 🔧 **Quality Checklist**

Before delivering a micro-frontend, ensure:

- [ ] Uses "Nexa Data Platform" branding consistently
- [ ] Implements Nexa logo and header components
- [ ] Follows the exact color palette specified
- [ ] Uses the correct typography system
- [ ] Integrates with Module Federation
- [ ] Implements proper error handling
- [ ] Includes loading states
- [ ] Meets accessibility requirements
- [ ] Optimized for performance
- [ ] Properly typed with TypeScript

## 🚀 **Deployment**

### **Development**
```bash
# Start all services
npm run start:all

# Or start individually
npm run start:shell      # Port 3000
npm run start:analytics  # Port 3002
```

### **Production**
```bash
# Build all micro-frontends
npm run build:all

# Deploy to your hosting platform
# Each micro-frontend can be deployed independently
```

## 📚 **Additional Resources**

- **Design System**: See `design-system-template.md` for complete styling guidelines
- **API Patterns**: See `api-integration-template.md` for service layer patterns
- **Module Federation**: See `module-federation-template.md` for integration details
- **Agent Prompts**: See `agent-prompt-template.md` for AI development instructions

## 🤝 **Contributing**

When contributing to the Nexa Data Platform:

1. Follow the established design system
2. Use the provided API integration patterns
3. Implement Module Federation correctly
4. Maintain consistency with existing modules
5. Update templates if new patterns are established

## 📞 **Support**

For questions about implementing these templates:

1. Check the specific template documentation
2. Review existing micro-frontend implementations
3. Follow the established patterns and conventions
4. Ensure consistency with the overall platform design

---

**Remember**: You are building modules for the **Nexa Data Platform**, not standalone applications. Each micro-frontend should feel like a natural part of the larger data mesh platform while maintaining its specific functionality.
