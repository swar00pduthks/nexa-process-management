# Web Frontend

This folder contains the React-based frontend application for the Nexa Process Management platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📁 Project Structure

```
web/
├── public/                 # Static assets
│   ├── index.html         # Main HTML file
│   ├── manifest.json      # PWA manifest
│   └── favicon.ico        # App icon
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── nodes/        # ReactFlow node components
│   │   ├── modals/       # Modal components
│   │   └── sidebar/      # Sidebar components
│   ├── App.js            # Main application component
│   ├── App.css           # Application styles
│   └── index.js          # Application entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── webpack.config.js      # Webpack configuration
```

## 🌟 Features

### 🏗️ Process Orchestrator
- **Visual Process Design**: Create and visualize complex business processes
- **Multi-phase Workflows**: Design hierarchical processes with phases and sub-phases
- **Real-time Monitoring**: Track process execution and dependencies
- **Elizabeth Line Style Layout**: Intuitive horizontal process visualization
- **Statistics Dashboard**: Monitor process metrics and performance

### 🔗 Event Correlation
- **Real-time Event Monitoring**: Track events across your systems
- **Pattern Detection**: Identify correlations in event data
- **Anomaly Detection**: Alert on unusual event patterns
- **Analytics Dashboard**: Analyze event trends and metrics

### ⚡ Flow Builder
- **Visual Flow Design**: Build data flows and transformations
- **Node-based Interface**: Drag-and-drop flow construction
- **Integration Support**: Connect various data sources and applications
- **Rule Configuration**: Define business rules and logic

### 📊 Dashboard
- **Process Overview**: Monitor all active processes
- **Performance Metrics**: Track key performance indicators
- **Quick Actions**: Access frequently used features
- **Status Monitoring**: Real-time status updates

## 🌐 Available Routes

- **`/`** - Dashboard (main page)
- **`/process-orchestrator`** - Process Orchestration
- **`/event-correlation`** - Event Correlation
- **`/flow-builder`** - Flow Builder

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router DOM
- **UI Components**: Material-UI, AG Grid
- **Flow Visualization**: ReactFlow
- **Styling**: CSS3, Tailwind CSS (utility classes)
- **Build Tool**: Create React App

## 🎨 Design System

The application follows the Nexa Design System with:
- **Consistent Color Palette**: Professional dark/light themes
- **Typography**: Clean, readable fonts
- **Component Library**: Reusable UI components
- **Responsive Design**: Mobile-friendly interface

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive logging

## 📱 Responsive Design

- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with mobile navigation

## 🌙 Theme Support

- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Easy on the eyes for extended use
- **Auto-detect**: Automatically matches system preference

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Component Testing
```bash
npm run test:components
```

### E2E Testing
```bash
npm run test:e2e
```

## 📦 Build & Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Docker Build
```bash
docker build -t nexa-process-management-web .
docker run -p 3000:3000 nexa-process-management-web
```

## 🔍 Performance

- **Code Splitting**: Lazy loading for better performance
- **Bundle Optimization**: Minimized bundle size
- **Image Optimization**: Compressed and optimized assets
- **Caching**: Efficient caching strategies

## 🚀 Deployment

### Static Hosting
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Container Deployment
- Docker
- Kubernetes
- AWS ECS
- Google Cloud Run

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Nexa Process Management Web** - Modern, responsive frontend for business process orchestration.
