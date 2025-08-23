# 🔗 Module Federation Template for Nexa Data Platform

## 📋 **Overview**

This template provides the Module Federation configuration and integration patterns for the Nexa Data Platform micro-frontend architecture. It enables seamless composition of multiple micro-frontends into a unified platform experience.

## 🏗️ **Architecture Overview**

```
Nexa Data Platform
├── Shell Application (Main Platform)
│   ├── Platform Header & Navigation
│   ├── Module Federation Host
│   └── Shared Layout Components
├── Micro-Frontends
│   ├── Nexa Lineage (Port 3001)
│   ├── Nexa Analytics (Port 3002)
│   ├── Nexa Governance (Port 3003)
│   ├── Nexa Quality (Port 3004)
│   └── Nexa Catalog (Port 3005)
└── Shared Dependencies
    ├── Design System
    ├── Common Components
    └── Utilities
```

## ⚙️ **Webpack Configuration**

### **Shell Application (Host)**
```javascript
// webpack.config.js - Shell Application
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    publicPath: 'http://localhost:3000/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'nexaShell',
      filename: 'remoteEntry.js',
      remotes: {
        nexaLineage: 'nexaLineage@http://localhost:3001/remoteEntry.js',
        nexaAnalytics: 'nexaAnalytics@http://localhost:3002/remoteEntry.js',
        nexaGovernance: 'nexaGovernance@http://localhost:3003/remoteEntry.js',
        nexaQuality: 'nexaQuality@http://localhost:3004/remoteEntry.js',
        nexaCatalog: 'nexaCatalog@http://localhost:3005/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '^4.0.0' },
        '@nexa/design-system': { singleton: true, requiredVersion: '^1.0.0' },
        '@nexa/shared-components': { singleton: true, requiredVersion: '^1.0.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
};
```

### **Micro-Frontend (Remote) - Nexa Lineage Example**
```javascript
// webpack.config.js - Nexa Lineage Micro-Frontend
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    publicPath: 'http://localhost:3001/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'nexaLineage',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './LineageGraph': './src/components/LineageGraph',
        './LineageTable': './src/components/LineageTable',
        './LineageEvents': './src/components/LineageEvents',
        './LineageFilters': './src/components/LineageFilters',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '^4.0.0' },
        '@nexa/design-system': { singleton: true, requiredVersion: '^1.0.0' },
        '@nexa/shared-components': { singleton: true, requiredVersion: '^1.0.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true,
  },
};
```

## 🔧 **TypeScript Configuration**

### **Shell Application Types**
```typescript
// types/remote-modules.d.ts
declare module 'nexaLineage/App' {
  const App: React.ComponentType<{
    currentModule?: string;
    onModuleChange?: (module: string) => void;
  }>;
  export default App;
}

declare module 'nexaLineage/LineageGraph' {
  const LineageGraph: React.ComponentType<{
    datasetId: string;
    height?: number;
    width?: number;
  }>;
  export default LineageGraph;
}

declare module 'nexaLineage/LineageTable' {
  const LineageTable: React.ComponentType<{
    data: any[];
    onRowClick?: (row: any) => void;
  }>;
  export default LineageTable;
}

declare module 'nexaAnalytics/App' {
  const App: React.ComponentType<{
    currentModule?: string;
    onModuleChange?: (module: string) => void;
  }>;
  export default App;
}

declare module 'nexaGovernance/App' {
  const App: React.ComponentType<{
    currentModule?: string;
    onModuleChange?: (module: string) => void;
  }>;
  export default App;
}

declare module 'nexaQuality/App' {
  const App: React.ComponentType<{
    currentModule?: string;
    onModuleChange?: (module: string) => void;
  }>;
  export default App;
}

declare module 'nexaCatalog/App' {
  const App: React.ComponentType<{
    currentModule?: string;
    onModuleChange?: (module: string) => void;
  }>;
  export default App;
}
```

## 🚀 **Integration Components**

### **Micro-Frontend Wrapper**
```typescript
// components/MicroFrontendWrapper.tsx
import React, { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface MicroFrontendWrapperProps {
  name: string;
  host: string;
  containerId: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error }>;
  props?: Record<string, any>;
}

const MicroFrontendWrapper: React.FC<MicroFrontendWrapperProps> = ({
  name,
  host,
  containerId,
  fallback = <div>Loading {name}...</div>,
  errorFallback = ({ error }) => (
    <div className="text-center p-4">
      <div className="text-nexa-data-red text-lg mb-2">Error loading {name}</div>
      <div className="text-nexa-gray-600 text-sm">{error.message}</div>
    </div>
  ),
  props = {},
}) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMicroFrontend = async () => {
      try {
        // Load the remote entry
        await loadScript(`${host}/remoteEntry.js`);
        
        // Get the container
        const container = (window as any)[name];
        await container.init({
          shared: {
            react: React,
            'react-dom': ReactDOM,
          },
        });

        // Get the module
        const factory = await container.get('./App');
        const Module = factory();
        setComponent(() => Module.default);
      } catch (err) {
        console.error(`Error loading ${name}:`, err);
        setError(err as Error);
      }
    };

    loadMicroFrontend();
  }, [name, host]);

  if (error) {
    return React.createElement(errorFallback, { error });
  }

  if (!Component) {
    return <>{fallback}</>;
  }

  return (
    <ErrorBoundary
      FallbackComponent={errorFallback}
      onError={(error) => console.error(`Error in ${name}:`, error)}
    >
      <Suspense fallback={fallback}>
        <div id={containerId}>
          <Component {...props} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

// Utility function to load scripts
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

export default MicroFrontendWrapper;
```

### **Platform Shell Application**
```typescript
// App.tsx - Shell Application
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MicroFrontendWrapper from './components/MicroFrontendWrapper';
import PlatformHeader from './components/PlatformHeader';
import { NexaConfigProvider } from './context/NexaConfigContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState('lineage');
  const [user] = useState({ name: 'Admin User', role: 'admin' });

  const moduleConfig = {
    lineage: { port: 3001, name: 'nexaLineage' },
    analytics: { port: 3002, name: 'nexaAnalytics' },
    governance: { port: 3003, name: 'nexaGovernance' },
    quality: { port: 3004, name: 'nexaQuality' },
    catalog: { port: 3005, name: 'nexaCatalog' },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NexaConfigProvider>
        <Router>
          <div className="min-h-screen bg-nexa-bg-secondary">
            <PlatformHeader 
              currentModule={currentModule} 
              user={user}
              onModuleChange={setCurrentModule}
            />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/lineage" replace />} />
                <Route 
                  path="/lineage/*" 
                  element={
                    <MicroFrontendWrapper
                      name={moduleConfig.lineage.name}
                      host={`http://localhost:${moduleConfig.lineage.port}`}
                      containerId="lineage-container"
                      props={{
                        currentModule: 'lineage',
                        onModuleChange: setCurrentModule,
                      }}
                    />
                  } 
                />
                <Route 
                  path="/analytics/*" 
                  element={
                    <MicroFrontendWrapper
                      name={moduleConfig.analytics.name}
                      host={`http://localhost:${moduleConfig.analytics.port}`}
                      containerId="analytics-container"
                      props={{
                        currentModule: 'analytics',
                        onModuleChange: setCurrentModule,
                      }}
                    />
                  } 
                />
                <Route 
                  path="/governance/*" 
                  element={
                    <MicroFrontendWrapper
                      name={moduleConfig.governance.name}
                      host={`http://localhost:${moduleConfig.governance.port}`}
                      containerId="governance-container"
                      props={{
                        currentModule: 'governance',
                        onModuleChange: setCurrentModule,
                      }}
                    />
                  } 
                />
                <Route 
                  path="/quality/*" 
                  element={
                    <MicroFrontendWrapper
                      name={moduleConfig.quality.name}
                      host={`http://localhost:${moduleConfig.quality.port}`}
                      containerId="quality-container"
                      props={{
                        currentModule: 'quality',
                        onModuleChange: setCurrentModule,
                      }}
                    />
                  } 
                />
                <Route 
                  path="/catalog/*" 
                  element={
                    <MicroFrontendWrapper
                      name={moduleConfig.catalog.name}
                      host={`http://localhost:${moduleConfig.catalog.port}`}
                      containerId="catalog-container"
                      props={{
                        currentModule: 'catalog',
                        onModuleChange: setCurrentModule,
                      }}
                    />
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </NexaConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
```

## 📦 **Package.json Configuration**

### **Shell Application**
```json
{
  "name": "nexa-data-platform-shell",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-query": "^4.29.0",
    "@nexa/design-system": "^1.0.0",
    "@nexa/shared-components": "^1.0.0"
  },
  "devDependencies": {
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.0",
    "webpack-dev-server": "^4.11.0",
    "html-webpack-plugin": "^5.5.0",
    "ts-loader": "^9.4.0",
    "typescript": "^4.9.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

### **Micro-Frontend (Nexa Lineage)**
```json
{
  "name": "nexa-lineage",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-query": "^4.29.0",
    "@nexa/design-system": "^1.0.0",
    "@nexa/shared-components": "^1.0.0"
  },
  "devDependencies": {
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.0",
    "webpack-dev-server": "^4.11.0",
    "html-webpack-plugin": "^5.5.0",
    "ts-loader": "^9.4.0",
    "typescript": "^4.9.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

## 🔄 **Development Workflow**

### **Starting All Services**
```bash
# Start all micro-frontends in parallel
npm run start:all

# Or start individually
npm run start:shell      # Port 3000
npm run start:lineage    # Port 3001
npm run start:analytics  # Port 3002
npm run start:governance # Port 3003
npm run start:quality    # Port 3004
npm run start:catalog    # Port 3005
```

### **Package.json Scripts for All Services**
```json
{
  "scripts": {
    "start:all": "concurrently \"npm run start:shell\" \"npm run start:lineage\" \"npm run start:analytics\" \"npm run start:governance\" \"npm run start:quality\" \"npm run start:catalog\"",
    "start:shell": "cd shell && npm start",
    "start:lineage": "cd micro-frontends/nexa-lineage && npm start",
    "start:analytics": "cd micro-frontends/nexa-analytics && npm start",
    "start:governance": "cd micro-frontends/nexa-governance && npm start",
    "start:quality": "cd micro-frontends/nexa-quality && npm start",
    "start:catalog": "cd micro-frontends/nexa-catalog && npm start",
    "build:all": "npm run build:shell && npm run build:lineage && npm run build:analytics && npm run build:governance && npm run build:quality && npm run build:catalog"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

## 🎯 **Best Practices**

### **Module Federation Best Practices**
1. **Shared Dependencies**: Always share React, React-DOM, and other core libraries
2. **Version Management**: Use exact versions for shared dependencies
3. **Error Boundaries**: Implement proper error boundaries for each micro-frontend
4. **Loading States**: Provide meaningful loading states during module loading
5. **Type Safety**: Use TypeScript declarations for all exposed modules

### **Performance Optimization**
1. **Lazy Loading**: Load micro-frontends only when needed
2. **Caching**: Implement proper caching strategies for remote entries
3. **Bundle Splitting**: Optimize bundle sizes for each micro-frontend
4. **Preloading**: Preload critical micro-frontends

### **Development Tips**
1. **Hot Reloading**: Ensure hot reloading works across all micro-frontends
2. **Debugging**: Use browser dev tools to debug module federation issues
3. **Testing**: Test each micro-frontend independently and as part of the shell
4. **Deployment**: Deploy micro-frontends independently with proper versioning

This Module Federation template provides a robust foundation for building scalable micro-frontend architectures for the Nexa Data Platform.
