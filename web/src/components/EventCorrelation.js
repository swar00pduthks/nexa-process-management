import React from 'react';
import './EventCorrelation.css';

const EventCorrelation = () => {
  return (
    <div className="event-correlation">
      <div className="correlation-header">
        <h2>🔗 Event Correlation</h2>
        <p>Monitor and correlate events across your data ecosystem</p>
      </div>
      
      <div className="correlation-content">
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-icon">🔗</div>
            <h3>Event Correlation Dashboard</h3>
            <p>
              Track and correlate events across your business processes. 
              Monitor dependencies, detect anomalies, and ensure data consistency.
            </p>
            <div className="feature-grid">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <h4>Real-time Monitoring</h4>
                <p>Monitor events as they happen across your systems</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <h4>Pattern Detection</h4>
                <p>Identify patterns and correlations in event data</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚠️</span>
                <h4>Anomaly Detection</h4>
                <p>Detect and alert on unusual event patterns</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <h4>Analytics</h4>
                <p>Analyze event trends and performance metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCorrelation;
