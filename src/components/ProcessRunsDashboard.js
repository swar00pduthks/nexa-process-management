import React, { useState, useMemo, useEffect } from 'react';
import './ProcessRunsDashboard.css';

const ProcessRunsDashboard = ({ onCreateNewProcess, onViewProcessRun }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('startTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50);

  // Mock data - in real app this would come from API with pagination
  const mockProcessRuns = useMemo(() => {
    const runs = [];
    const statuses = ['completed', 'in-progress', 'stuck', 'failed', 'pending'];
    const regions = ['APAC', 'EMEA', 'US', 'AUSTRALIA', 'LATAM', 'MEA'];
    const processTypes = ['Daily P&L Calculation', 'Monthly Reconciliation', 'Quarterly Reporting', 'Data Pipeline', 'ML Model Training'];
    
    // Generate 1000 mock runs for demonstration
    for (let i = 1; i <= 1000; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const processType = processTypes[Math.floor(Math.random() * processTypes.length)];
      
      runs.push({
        id: `RUN-2024-${String(i).padStart(3, '0')}`,
        processName: processType,
        status,
        context: {
          region,
          businessDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          agentId: `AGENT-${Math.floor(Math.random() * 10) + 1}`,
          priority: Math.floor(Math.random() * 5) + 1
        },
        progress: status === 'completed' ? 100 : Math.floor(Math.random() * 100),
        currentPhase: status === 'completed' ? 'completed' : ['Data Ingestion', 'Data Processing', 'Validation', 'Reporting'][Math.floor(Math.random() * 4)],
        startTime: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        duration: status === 'completed' ? `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m` : null,
        stuckReason: status === 'stuck' ? ['Waiting for upstream data', 'Database timeout', 'Resource constraints', 'Dependency failed'][Math.floor(Math.random() * 4)] : null,
        errorMessage: status === 'failed' ? ['Connection timeout', 'Data validation failed', 'System error', 'Memory exceeded'][Math.floor(Math.random() * 4)] : null,
        lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        agentStatus: ['active', 'idle', 'busy', 'error'][Math.floor(Math.random() * 4)],
        eventCount: Math.floor(Math.random() * 100) + 10
      });
    }
    return runs;
  }, []);

  // Filter and sort data
  const filteredAndSortedRuns = useMemo(() => {
    let filtered = mockProcessRuns.filter(run => {
      const matchesSearch = run.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           run.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           run.context.region.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
      const matchesRegion = regionFilter === 'all' || run.context.region === regionFilter;
      
      return matchesSearch && matchesStatus && matchesRegion;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'startTime':
          aValue = new Date(a.startTime);
          bValue = new Date(b.startTime);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'region':
          aValue = a.context.region;
          bValue = b.context.region;
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'priority':
          aValue = a.context.priority;
          bValue = b.context.priority;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockProcessRuns, searchTerm, statusFilter, regionFilter, sortBy, sortOrder]);

  const paginatedRuns = filteredAndSortedRuns.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredAndSortedRuns.length / itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    const total = mockProcessRuns.length;
    const completed = mockProcessRuns.filter(run => run.status === 'completed').length;
    const inProgress = mockProcessRuns.filter(run => run.status === 'in-progress').length;
    const failed = mockProcessRuns.filter(run => run.status === 'failed').length;
    const stuck = mockProcessRuns.filter(run => run.status === 'stuck').length;

    return {
      total,
      completed,
      inProgress,
      failed,
      stuck,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [mockProcessRuns]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'failed': return '#ef4444';
      case 'stuck': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'failed': return '❌';
      case 'stuck': return '⚠️';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  return (
    <div className="dashboard">
      {/* Main Cards Grid - Matching Nexa Lineage Design */}
      <div className="cards-grid">
        <div className="card">
          <div className="card-icon">📊</div>
          <div className="card-title">Process Dashboard</div>
          <div className="card-description">
            Monitor and manage all business process runs across your data ecosystem
          </div>
          <button className="card-button" onClick={onCreateNewProcess}>
            View Dashboard
          </button>
        </div>

        <div className="card">
          <div className="card-icon">🔄</div>
          <div className="card-title">Process Orchestration</div>
          <div className="card-description">
            Create and configure business processes with visual workflow builder
          </div>
          <button className="card-button" onClick={onCreateNewProcess}>
            Create Process
          </button>
        </div>

        <div className="card">
          <div className="card-icon">🔗</div>
          <div className="card-title">Event Correlation</div>
          <div className="card-description">
            Build business-friendly rules to correlate events and trigger processes
          </div>
          <button className="card-button">
            View Correlation Rules
          </button>
        </div>
      </div>

      {/* API Status Section - Matching Nexa Lineage */}
      <div className="api-status">
        <h3>API Status</h3>
        <div className="status-list">
          <div className="status-item">
            <div className="status-indicator"></div>
            <span>API Connected</span>
          </div>
          <div className="status-item">
            <div className="status-indicator"></div>
            <span>PostgreSQL</span>
          </div>
          <div className="status-item">
            <div className="status-indicator"></div>
            <span>Neo4j</span>
          </div>
        </div>
      </div>

      {/* Process Runs Section */}
      <div className="process-runs-section">
        <div className="section-header">
          <h2>Recent Process Runs</h2>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search runs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="failed">Failed</option>
              <option value="stuck">Stuck</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Regions</option>
              <option value="APAC">APAC</option>
              <option value="EMEA">EMEA</option>
              <option value="US">US</option>
              <option value="AUSTRALIA">Australia</option>
              <option value="LATAM">LATAM</option>
              <option value="MEA">MEA</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Runs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.successRate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>

        {/* Process Runs List */}
        <div className={`runs-container ${viewMode}`}>
          {paginatedRuns.map((run) => (
            <div key={run.id} className="run-tile" onClick={() => onViewProcessRun(run)}>
              <div className="run-header">
                <div className="run-id">{run.id}</div>
                <div className="run-status" style={{ color: getStatusColor(run.status) }}>
                  {getStatusIcon(run.status)} {run.status}
                </div>
              </div>
              <div className="run-name">{run.processName}</div>
              <div className="run-context">
                <span className="context-item">Region: {run.context.region}</span>
                <span className="context-item">Date: {run.context.businessDate}</span>
              </div>
              {run.status !== 'completed' && (
                <div className="run-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${run.progress}%`,
                        backgroundColor: getStatusColor(run.status)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{run.progress}%</span>
                </div>
              )}
              <div className="run-meta">
                <span>Started: {new Date(run.startTime).toLocaleString()}</span>
                {run.duration && <span>Duration: {run.duration}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessRunsDashboard;
