# 🎨 Nexa Data Platform Design System Template

## 📋 **Brand Identity Guidelines**

### **Platform Branding**
- **Platform Name**: "Nexa Data Platform" (not "Nexa Lineage")
- **Logo**: Nexa Data Platform logo with consistent placement
- **Brand Colors**: Professional blue theme with data-focused aesthetics
- **Typography**: Modern, clean fonts for enterprise data platform

## 🎨 **Color Palette (MUST USE EXACTLY)**

```css
/* Primary Brand Colors */
:root {
  --nexa-primary-50: #eff6ff;
  --nexa-primary-100: #dbeafe;
  --nexa-primary-200: #bfdbfe;
  --nexa-primary-300: #93c5fd;
  --nexa-primary-400: #60a5fa;
  --nexa-primary-500: #3b82f6;  /* Main brand blue */
  --nexa-primary-600: #2563eb;  /* Darker blue for hover */
  --nexa-primary-700: #1d4ed8;  /* Active states */
  --nexa-primary-800: #1e40af;
  --nexa-primary-900: #1e3a8a;
  
  /* Data Platform Specific Colors */
  --nexa-data-green: #10b981;   /* Data success/health */
  --nexa-data-orange: #f59e0b;  /* Data warnings */
  --nexa-data-red: #ef4444;     /* Data errors/issues */
  --nexa-data-purple: #8b5cf6;  /* Data insights/analytics */
  
  /* Neutral Platform Colors */
  --nexa-gray-50: #f9fafb;
  --nexa-gray-100: #f3f4f6;
  --nexa-gray-200: #e5e7eb;
  --nexa-gray-300: #d1d5db;
  --nexa-gray-400: #9ca3af;
  --nexa-gray-500: #6b7280;
  --nexa-gray-600: #4b5563;
  --nexa-gray-700: #374151;
  --nexa-gray-800: #1f2937;
  --nexa-gray-900: #111827;
  
  /* Platform Background Colors */
  --nexa-bg-primary: #ffffff;
  --nexa-bg-secondary: #f8fafc;
  --nexa-bg-tertiary: #f1f5f9;
  --nexa-bg-dark: #0f172a;
}
```

## 📝 **Typography System (MUST FOLLOW)**

```css
/* Font Family - Nexa Data Platform */
:root {
  --nexa-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --nexa-font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  --nexa-font-display: 'Inter', system-ui, sans-serif; /* For headings */
}

/* Typography Scale - Professional Data Platform */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }

/* Font Weights - Professional */
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

## 🧩 **Component Library**

### **Logo Component**
```tsx
// Nexa Data Platform Logo Component
const NexaLogo = ({ size = 'md', variant = 'full' }) => (
  <div className={`flex items-center space-x-2 ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
    <div className="w-8 h-8 bg-nexa-primary-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-sm">N</span>
    </div>
    {variant === 'full' && (
      <span className="font-semibold text-nexa-gray-900">
        Nexa Data Platform
      </span>
    )}
  </div>
);
```

### **Button Components**
```tsx
// Platform Button Component
const PlatformButton = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => (
  <button
    className={`
      inline-flex items-center justify-center rounded-lg font-medium transition-all
      ${variant === 'primary' 
        ? 'bg-nexa-primary-600 hover:bg-nexa-primary-700 text-white shadow-sm' 
        : variant === 'secondary'
        ? 'bg-white hover:bg-nexa-gray-50 text-nexa-gray-700 border border-nexa-gray-300'
        : 'bg-nexa-data-green hover:bg-nexa-data-green/90 text-white'
      }
      ${size === 'sm' ? 'px-3 py-1.5 text-sm' : 
        size === 'lg' ? 'px-6 py-3 text-lg' : 
        'px-4 py-2 text-base'}
    `}
    {...props}
  >
    {children}
  </button>
);
```

### **Card Components**
```tsx
// Platform Card Component
const PlatformCard = ({ title, subtitle, children, actions }) => (
  <div className="bg-white rounded-xl border border-nexa-gray-200 shadow-sm hover:shadow-md transition-shadow">
    {(title || actions) && (
      <div className="px-6 py-4 border-b border-nexa-gray-200">
        <div className="flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-nexa-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-nexa-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      </div>
    )}
    <div className="px-6 py-4">{children}</div>
  </div>
);
```

### **Header Component**
```tsx
// Platform Header Component
const PlatformHeader = ({ currentModule, user }) => (
  <header className="bg-white border-b border-nexa-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <NexaLogo size="md" variant="full" />
          <nav className="flex space-x-8">
            <a href="/lineage" className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentModule === 'lineage' 
                ? 'bg-nexa-primary-100 text-nexa-primary-700' 
                : 'text-nexa-gray-500 hover:text-nexa-gray-700'
            }`}>
              Data Lineage
            </a>
            <a href="/analytics" className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentModule === 'analytics' 
                ? 'bg-nexa-primary-100 text-nexa-primary-700' 
                : 'text-nexa-gray-500 hover:text-nexa-gray-700'
            }`}>
              Analytics
            </a>
            <a href="/governance" className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentModule === 'governance' 
                ? 'bg-nexa-primary-100 text-nexa-primary-700' 
                : 'text-nexa-gray-500 hover:text-nexa-gray-700'
            }`}>
              Governance
            </a>
            <a href="/quality" className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentModule === 'quality' 
                ? 'bg-nexa-primary-100 text-nexa-primary-700' 
                : 'text-nexa-gray-500 hover:text-nexa-gray-700'
            }`}>
              Data Quality
            </a>
            <a href="/catalog" className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentModule === 'catalog' 
                ? 'bg-nexa-primary-100 text-nexa-primary-700' 
                : 'text-nexa-gray-500 hover:text-nexa-gray-700'
            }`}>
              Data Catalog
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <UserMenu user={user} />
        </div>
      </div>
    </div>
  </header>
);
```

## 📐 **Layout Guidelines**

### **Spacing System**
```css
/* Spacing Scale */
.space-1 { margin: 0.25rem; }
.space-2 { margin: 0.5rem; }
.space-3 { margin: 0.75rem; }
.space-4 { margin: 1rem; }
.space-6 { margin: 1.5rem; }
.space-8 { margin: 2rem; }
.space-12 { margin: 3rem; }
.space-16 { margin: 4rem; }
```

### **Container Widths**
```css
/* Container Classes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }
.container-7xl { max-width: 80rem; } /* Platform standard */
```

## 🎯 **Usage Guidelines**

### **Color Usage Rules**
1. **Primary Blue**: Use for main actions, links, and brand elements
2. **Data Colors**: Use for status indicators and data-specific information
3. **Gray Scale**: Use for text, borders, and neutral backgrounds
4. **Background Colors**: Use for page backgrounds and card backgrounds

### **Typography Rules**
1. **Headings**: Use Inter font with appropriate weights
2. **Body Text**: Use Inter font with normal weight
3. **Code**: Use JetBrains Mono for code snippets and technical content
4. **Line Heights**: Follow the specified line-height ratios

### **Component Rules**
1. **Consistency**: Always use the provided component library
2. **Accessibility**: Ensure proper contrast ratios and keyboard navigation
3. **Responsive**: Design for mobile-first approach
4. **Performance**: Optimize for fast loading and smooth interactions

## 🔧 **Implementation Notes**

### **Tailwind CSS Configuration**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nexa-primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'nexa-data': {
          green: '#10b981',
          orange: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
        },
        'nexa-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'nexa-bg': {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        'nexa-sans': ['Inter', 'system-ui', 'sans-serif'],
        'nexa-mono': ['JetBrains Mono', 'monospace'],
        'nexa-display': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### **CSS Variables for Global Use**
```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  /* Include all color variables from above */
}

body {
  font-family: var(--nexa-font-sans);
  background-color: var(--nexa-bg-secondary);
  color: var(--nexa-gray-900);
}
```

This design system ensures consistency across all Nexa Data Platform micro-frontends while maintaining the professional, data-focused aesthetic.
