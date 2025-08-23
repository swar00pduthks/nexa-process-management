# 🤖 AI Assistant Instructions for Nexa Data Platform Templates

## 📋 **For Cursor IDE, GitHub Copilot, and Other AI Coding Assistants**

### **How to Use These Templates**

1. **Read the Template First**: Always start by reading the relevant template file
2. **Follow Exact Specifications**: Use the exact colors, fonts, and patterns specified
3. **Maintain Consistency**: Ensure all components follow the established patterns
4. **Reference Platform Context**: Remember this is for "Nexa Data Platform" (not "Nexa Lineage")

## 🎯 **Template Usage Scenarios**

### **Scenario 1: Creating a New Micro-Frontend**
```
User: "Create a new Nexa Analytics micro-frontend"

AI Assistant Should:
1. Read agent-prompt-template.md for context
2. Read design-system-template.md for styling
3. Read module-federation-template.md for webpack config
4. Read api-integration-template.md for service patterns
5. Create the complete project structure
```

### **Scenario 2: Modifying Existing Project**
```
User: "Update this component to follow Nexa Data Platform design system"

AI Assistant Should:
1. Read design-system-template.md
2. Replace colors with exact hex values
3. Update typography to use Inter font
4. Implement standardized component patterns
5. Use nexa- prefixed CSS classes
```

### **Scenario 3: Adding New Features**
```
User: "Add a new API endpoint for data quality metrics"

AI Assistant Should:
1. Read api-integration-template.md
2. Extend the base NexaPlatformAPI class
3. Follow the established naming conventions
4. Use the standardized error handling patterns
5. Implement React Query integration
```

## 🔧 **Specific Instructions for Each Template**

### **Design System Template**
- **MUST USE**: Exact color hex values (e.g., `#3b82f6` for primary blue)
- **MUST USE**: Inter font family for all text
- **MUST USE**: `nexa-` prefixed CSS classes
- **MUST FOLLOW**: Component patterns exactly as specified

### **API Integration Template**
- **MUST EXTEND**: `NexaPlatformAPI` base class
- **MUST USE**: Standardized error handling
- **MUST FOLLOW**: React Query patterns
- **MUST IMPLEMENT**: TypeScript interfaces

### **Module Federation Template**
- **MUST CONFIGURE**: Webpack with ModuleFederationPlugin
- **MUST SHARE**: React, React-DOM, and design system packages
- **MUST EXPOSE**: Components following naming conventions
- **MUST USE**: Correct port assignments

### **Agent Prompt Template**
- **MUST REFERENCE**: "Nexa Data Platform" (not "Nexa Lineage")
- **MUST FOLLOW**: All technical specifications
- **MUST IMPLEMENT**: Quality checklist items
- **MUST MAINTAIN**: Platform consistency

## 📝 **Code Generation Patterns**

### **When Creating Components**
```typescript
// AI should generate this pattern:
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  return (
    <div className="bg-white rounded-xl border border-nexa-gray-200 p-6">
      <h3 className="text-lg font-semibold text-nexa-gray-900 mb-4">
        Component Title
      </h3>
      {/* Component content */}
    </div>
  );
};
```

### **When Creating API Services**
```typescript
// AI should generate this pattern:
class ServiceNameAPI extends NexaPlatformAPI {
  constructor() {
    super('serviceName');
  }

  async getData(id: string) {
    return this.get(`/data/${id}`);
  }
}
```

### **When Configuring Webpack**
```javascript
// AI should generate this pattern:
new ModuleFederationPlugin({
  name: 'nexaServiceName',
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

## 🎨 **Design System Enforcement**

### **Color Usage**
```css
/* AI MUST use these exact values: */
--nexa-primary-500: #3b82f6;  /* Main brand blue */
--nexa-primary-600: #2563eb;  /* Darker blue for hover */
--nexa-data-green: #10b981;   /* Data success/health */
--nexa-data-orange: #f59e0b;  /* Data warnings */
--nexa-data-red: #ef4444;     /* Data errors/issues */
--nexa-data-purple: #8b5cf6;  /* Data insights/analytics */
```

### **Typography Usage**
```css
/* AI MUST use these fonts: */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
```

## 🔍 **Quality Assurance Checklist**

Before completing any task, AI should verify:

- [ ] Uses correct platform name ("Nexa Data Platform")
- [ ] Implements exact color values from design system
- [ ] Uses correct typography (Inter font)
- [ ] Follows component patterns from templates
- [ ] Implements proper error handling
- [ ] Uses TypeScript for type safety
- [ ] Follows Module Federation patterns
- [ ] Maintains consistency with existing code

## 🚀 **Example AI Commands**

### **For New Projects**
```
"Create a new Nexa Analytics micro-frontend following the templates"
"Set up Module Federation for Nexa Governance module"
"Implement the design system in this React component"
```

### **For Existing Projects**
```
"Update this component to follow Nexa Data Platform design system"
"Add API integration following the template patterns"
"Configure webpack for Module Federation"
"Implement error handling using the template patterns"
```

## 📚 **Template References**

- **Agent Prompt**: `agent-prompt-template.md` - Complete development context
- **Design System**: `design-system-template.md` - Colors, fonts, components
- **API Integration**: `api-integration-template.md` - Service patterns
- **Module Federation**: `module-federation-template.md` - Webpack configuration
- **README**: `README.md` - Quick start and guidelines

## ⚠️ **Important Notes for AI Assistants**

1. **Always reference the templates** before generating code
2. **Maintain platform consistency** across all modules
3. **Use exact specifications** from the design system
4. **Follow established patterns** for maintainability
5. **Consider the larger platform context** when making decisions

Remember: You are building modules for the **Nexa Data Platform**, a comprehensive data mesh solution, not standalone applications.
