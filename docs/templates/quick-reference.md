# ⚡ Quick Reference for AI Assistants

## 🎨 **Design System Quick Reference**

### **Colors (MUST USE EXACTLY)**
```css
/* Primary Brand */
--nexa-primary-500: #3b82f6;  /* Main blue */
--nexa-primary-600: #2563eb;  /* Hover blue */

/* Data Platform Colors */
--nexa-data-green: #10b981;   /* Success */
--nexa-data-orange: #f59e0b;  /* Warning */
--nexa-data-red: #ef4444;     /* Error */
--nexa-data-purple: #8b5cf6;  /* Analytics */

/* Neutral Grays */
--nexa-gray-50: #f9fafb;
--nexa-gray-200: #e5e7eb;
--nexa-gray-500: #6b7280;
--nexa-gray-900: #111827;
```

### **Typography (MUST USE)**
```css
/* Font Families */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
```

### **Component Patterns**
```tsx
// Standard Card Pattern
<div className="bg-white rounded-xl border border-nexa-gray-200 p-6">
  <h3 className="text-lg font-semibold text-nexa-gray-900 mb-4">Title</h3>
  {/* Content */}
</div>

// Standard Button Pattern
<button className="bg-nexa-primary-600 hover:bg-nexa-primary-700 text-white px-4 py-2 rounded-lg">
  Button Text
</button>
```

## 🔌 **API Integration Quick Reference**

### **Base API Service**
```typescript
class NexaPlatformAPI {
  constructor(module: string) {
    this.baseURL = process.env.NEXA_API_BASE_URL || 'http://localhost:8080/api';
    this.module = module;
  }
}

// Extend for specific modules
class AnalyticsAPI extends NexaPlatformAPI {
  constructor() {
    super('analytics');
  }
}
```

### **React Query Pattern**
```typescript
export const useData = (id: string) => {
  return useQuery({
    queryKey: ['module', 'data', id],
    queryFn: () => new ServiceAPI().getData(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## 🔗 **Module Federation Quick Reference**

### **Webpack Configuration**
```javascript
new ModuleFederationPlugin({
  name: 'nexaModuleName',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
    './ComponentName': './src/components/ComponentName',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    '@nexa/design-system': { singleton: true, requiredVersion: '^1.0.0' },
  },
})
```

### **Port Assignments**
- Shell: 3000
- Lineage: 3001
- Analytics: 3002
- Governance: 3003
- Quality: 3004
- Catalog: 3005

## 📝 **Naming Conventions**

### **Platform References**
- ✅ **CORRECT**: "Nexa Data Platform"
- ❌ **WRONG**: "Nexa Lineage Platform"

### **CSS Classes**
- ✅ **CORRECT**: `nexa-primary-600`, `nexa-data-green`
- ❌ **WRONG**: `primary-blue`, `success-green`

### **Component Names**
- ✅ **CORRECT**: `AnalyticsDashboard`, `GovernancePolicy`
- ❌ **WRONG**: `Dashboard`, `Policy`

## 🚀 **Common AI Commands**

### **For New Projects**
```
"Create Nexa Analytics micro-frontend following templates"
"Set up Module Federation for Nexa Governance"
"Implement design system in React component"
```

### **For Existing Projects**
```
"Update component to follow Nexa Data Platform design system"
"Add API integration following template patterns"
"Configure webpack for Module Federation"
```

## ⚠️ **Critical Rules**

1. **ALWAYS** use exact color hex values from design system
2. **ALWAYS** use Inter font for text, JetBrains Mono for code
3. **ALWAYS** extend `NexaPlatformAPI` for new services
4. **ALWAYS** use `nexa-` prefixed CSS classes
5. **ALWAYS** reference "Nexa Data Platform" (not "Nexa Lineage")
6. **ALWAYS** follow Module Federation patterns
7. **ALWAYS** implement TypeScript interfaces
8. **ALWAYS** use standardized error handling

## 📚 **Template Files**
- `agent-prompt-template.md` - Complete development context
- `design-system-template.md` - Full design system
- `api-integration-template.md` - API patterns
- `module-federation-template.md` - Webpack configuration
- `ai-instructions.md` - Detailed AI instructions
- `README.md` - Quick start guide
