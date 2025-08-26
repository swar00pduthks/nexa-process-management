# 🔌 API Integration Template for Nexa Data Platform

## 📋 **Overview**

This template provides standardized API integration patterns for all Nexa Data Platform micro-frontends. It ensures consistent API communication, error handling, and data management across all modules.

## 🏗️ **API Architecture**

### **Base API Service Pattern**
```typescript
// Platform API Service Base
class NexaPlatformAPI {
  private baseURL: string;
  private module: string;

  constructor(module: string) {
    this.baseURL = process.env.NEXA_API_BASE_URL || 'http://localhost:8080/api';
    this.module = module;
  }

  protected async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}/${this.module}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-Nexa-Module': this.module,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Nexa Platform API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error in ${this.module}:`, error);
      throw error;
    }
  }

  private getAuthToken(): string {
    return localStorage.getItem('nexa-auth-token') || '';
  }

  // Standard CRUD operations
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
```

## 🎯 **Module-Specific API Services**

### **Nexa Lineage API Service**
```typescript
// Module-specific API service for Data Lineage
class LineageAPI extends NexaPlatformAPI {
  constructor() {
    super('lineage');
  }

  // Lineage-specific endpoints
  async getLineageGraph(datasetId: string) {
    return this.get(`/graph/${datasetId}`);
  }

  async getLineageEvents(filters?: LineageEventFilters) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.get(`/events${queryParams}`);
  }

  async getDatasetLineage(datasetId: string, depth: number = 3) {
    return this.get(`/dataset/${datasetId}/lineage?depth=${depth}`);
  }

  async createLineageEvent(event: LineageEvent) {
    return this.post('/events', event);
  }

  async updateLineageEvent(eventId: string, updates: Partial<LineageEvent>) {
    return this.put(`/events/${eventId}`, updates);
  }

  async deleteLineageEvent(eventId: string) {
    return this.delete(`/events/${eventId}`);
  }
}

// Type definitions for Lineage
interface LineageEvent {
  id: string;
  timestamp: string;
  sourceDataset: string;
  targetDataset: string;
  transformationType: string;
  metadata: Record<string, any>;
}

interface LineageEventFilters {
  startDate?: string;
  endDate?: string;
  sourceDataset?: string;
  targetDataset?: string;
  transformationType?: string;
}
```

### **Nexa Analytics API Service**
```typescript
// Module-specific API service for Data Analytics
class AnalyticsAPI extends NexaPlatformAPI {
  constructor() {
    super('analytics');
  }

  // Analytics-specific endpoints
  async getMetrics(datasetId: string, timeRange: string) {
    return this.get(`/metrics/${datasetId}?timeRange=${timeRange}`);
  }

  async getTrends(datasetId: string, metric: string, period: string) {
    return this.get(`/trends/${datasetId}?metric=${metric}&period=${period}`);
  }

  async getDataQualityScore(datasetId: string) {
    return this.get(`/quality-score/${datasetId}`);
  }

  async getAnomalies(datasetId: string, threshold: number = 0.95) {
    return this.get(`/anomalies/${datasetId}?threshold=${threshold}`);
  }

  async createCustomMetric(metric: CustomMetric) {
    return this.post('/custom-metrics', metric);
  }
}

interface CustomMetric {
  id: string;
  name: string;
  description: string;
  formula: string;
  datasetId: string;
}
```

### **Nexa Governance API Service**
```typescript
// Module-specific API service for Data Governance
class GovernanceAPI extends NexaPlatformAPI {
  constructor() {
    super('governance');
  }

  // Governance-specific endpoints
  async getPolicies(datasetId?: string) {
    const endpoint = datasetId ? `/policies?dataset=${datasetId}` : '/policies';
    return this.get(endpoint);
  }

  async createPolicy(policy: DataPolicy) {
    return this.post('/policies', policy);
  }

  async updatePolicy(policyId: string, updates: Partial<DataPolicy>) {
    return this.put(`/policies/${policyId}`, updates);
  }

  async getComplianceReport(datasetId: string, dateRange: string) {
    return this.get(`/compliance/${datasetId}?dateRange=${dateRange}`);
  }

  async getAuditLog(filters?: AuditLogFilters) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.get(`/audit-log${queryParams}`);
  }
}

interface DataPolicy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  datasets: string[];
  enforcementLevel: 'strict' | 'warning' | 'info';
}

interface PolicyRule {
  field: string;
  condition: string;
  value: any;
}
```

## 🔄 **Data Management Patterns**

### **React Query Integration**
```typescript
// Custom hooks for API integration with React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Lineage hooks
export const useLineageGraph = (datasetId: string) => {
  return useQuery({
    queryKey: ['lineage', 'graph', datasetId],
    queryFn: () => new LineageAPI().getLineageGraph(datasetId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLineageEvents = (filters?: LineageEventFilters) => {
  return useQuery({
    queryKey: ['lineage', 'events', filters],
    queryFn: () => new LineageAPI().getLineageEvents(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateLineageEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (event: LineageEvent) => new LineageAPI().createLineageEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lineage', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['lineage', 'graph'] });
    },
  });
};

// Analytics hooks
export const useMetrics = (datasetId: string, timeRange: string) => {
  return useQuery({
    queryKey: ['analytics', 'metrics', datasetId, timeRange],
    queryFn: () => new AnalyticsAPI().getMetrics(datasetId, timeRange),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Governance hooks
export const usePolicies = (datasetId?: string) => {
  return useQuery({
    queryKey: ['governance', 'policies', datasetId],
    queryFn: () => new GovernanceAPI().getPolicies(datasetId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### **Error Handling Pattern**
```typescript
// Standardized error handling
class NexaAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'NexaAPIError';
  }
}

// Error handling utility
const handleAPIError = (error: any): NexaAPIError => {
  if (error instanceof NexaAPIError) {
    return error;
  }

  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new NexaAPIError(
      'Network error - unable to connect to Nexa Data Platform',
      0,
      'NETWORK_ERROR'
    );
  }

  // Handle unknown errors
  return new NexaAPIError(
    'An unexpected error occurred',
    500,
    'UNKNOWN_ERROR',
    error
  );
};

// Error boundary component
const APIErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<NexaAPIError | null>(null);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nexa-bg-secondary">
        <div className="text-center">
          <div className="text-nexa-data-red text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-nexa-gray-900 mb-2">
            {error.message}
          </h2>
          <p className="text-nexa-gray-600 mb-4">
            Error Code: {error.code} | Status: {error.status}
          </p>
          <button
            onClick={() => setError(null)}
            className="bg-nexa-primary-600 hover:bg-nexa-primary-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={(error) => setError(handleAPIError(error))}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## 📊 **Data Types and Interfaces**

### **Common Platform Types**
```typescript
// Base types used across all modules
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface Dataset extends BaseEntity {
  name: string;
  description: string;
  namespace: string;
  schema: DatasetSchema;
  metadata: Record<string, any>;
  tags: string[];
}

interface DatasetSchema {
  fields: SchemaField[];
  version: string;
}

interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
  description?: string;
}

// API Response types
interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}
```

## 🔧 **Configuration and Environment**

### **Environment Configuration**
```typescript
// Environment configuration
interface NexaConfig {
  api: {
    baseURL: string;
    timeout: number;
    retries: number;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
  };
  modules: {
    lineage: boolean;
    analytics: boolean;
    governance: boolean;
    quality: boolean;
    catalog: boolean;
  };
}

const defaultConfig: NexaConfig = {
  api: {
    baseURL: process.env.NEXA_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 30000,
    retries: 3,
  },
  auth: {
    tokenKey: 'nexa-auth-token',
    refreshTokenKey: 'nexa-refresh-token',
  },
  modules: {
    lineage: true,
    analytics: true,
    governance: true,
    quality: true,
    catalog: true,
  },
};

// Configuration provider
const NexaConfigContext = createContext<NexaConfig>(defaultConfig);

export const NexaConfigProvider = ({ children, config }: { 
  children: React.ReactNode; 
  config?: Partial<NexaConfig>; 
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  return (
    <NexaConfigContext.Provider value={finalConfig}>
      {children}
    </NexaConfigContext.Provider>
  );
};
```

## 🚀 **Usage Examples**

### **Complete Integration Example**
```typescript
// Example: Lineage Graph Component with API Integration
const LineageGraphComponent = ({ datasetId }: { datasetId: string }) => {
  const { data: lineageData, isLoading, error } = useLineageGraph(datasetId);
  const { data: events } = useLineageEvents({ sourceDataset: datasetId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexa-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-nexa-data-red text-lg mb-2">Error loading lineage data</div>
        <div className="text-nexa-gray-600 text-sm">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-nexa-gray-200 p-6">
      <h3 className="text-lg font-semibold text-nexa-gray-900 mb-4">
        Data Lineage Graph
      </h3>
      {/* Render lineage graph with data */}
      <LineageGraph data={lineageData} events={events} />
    </div>
  );
};
```

This API integration template ensures consistent, reliable, and maintainable API communication across all Nexa Data Platform micro-frontends.
