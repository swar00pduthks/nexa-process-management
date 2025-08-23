import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProcessOrchestrator from './components/ProcessOrchestrator';
import EventCorrelation from './components/EventCorrelation';
import FlowBuilder from './components/FlowBuilder';
import './App.css';

const NexaLogo = () => (
  <div className="nexa-logo">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 32 32" 
      width="40" 
      height="40"
      className="nexa-logo-svg"
    >
      {/* SVG path data from nexadatamesh-lineage/web/src/components/NexaLogo.tsx */}
      <rect x="0" y="0" width="32" height="32" fill="#FFFFFF"/>
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#000000" stroke="#000000" strokeWidth="1"/>
      <circle cx="16" cy="16" r="2.5" fill="#FFFFFF"/>
      <circle cx="16" cy="8" r="1.8" fill="#FFFFFF"/>
      <circle cx="16" cy="24" r="1.8" fill="#FFFFFF"/>
      <circle cx="8" cy="16" r="1.8" fill="#FFFFFF"/>
      <circle cx="24" cy="16" r="1.8" fill="#FFFFFF"/>
      <line x1="16" y1="13.5" x2="16" y2="9.8" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="16" y1="18.5" x2="16" y2="22.2" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="13.5" y1="16" x2="9.8" y2="16" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="18.5" y1="16" x2="22.2" y2="16" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="8" y1="8" x2="24" y2="24" stroke="#FFFFFF" strokeWidth="1.5"/>
      <line x1="24" y1="8" x2="8" y2="24" stroke="#FFFFFF" strokeWidth="1.5"/>
    </svg>
    <div className="logo-text">
      <h1>Nexa Business Process Management</h1>
      <p>Orchestrate and monitor business processes across your data ecosystem.</p>
    </div>
  </div>
);

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/process-orchestrator', label: 'Process Orchestrator', icon: '🏗️' },
    { path: '/event-correlation', label: 'Event Correlation', icon: '🔗' },
    { path: '/flow-builder', label: 'Flow Builder', icon: '⚡' }
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
      <button className="theme-toggle">
        <span>🌙</span>
      </button>
    </nav>
  );
};

const AppContent = () => {
  return (
    <div className="App">
      <header className="app-header">
        <NexaLogo />
        <Navigation />
      </header>
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/process-orchestrator" element={<ProcessOrchestrator />} />
          <Route path="/event-correlation" element={<EventCorrelation />} />
          <Route path="/flow-builder" element={<FlowBuilder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
