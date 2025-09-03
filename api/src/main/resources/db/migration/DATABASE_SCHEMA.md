# Database Schema Documentation

## Overview

This document describes the database schema for the Nexa Process Management system. The system uses a unified approach where both business processes and event correlations are stored in the same format using nodes and edges.

## Tables

### 1. `users` Table

Stores user information for authentication and authorization.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `process_configs` Table

**Unified table for storing business processes, event correlations, and data flows.**

This table uses a unified node-edge structure where all process types (business processes, event correlations, data flows) are stored in the same format, making them consistent and interchangeable.

```sql
CREATE TABLE process_configs (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    process_type VARCHAR(50) NOT NULL CHECK (process_type IN ('business-process', 'event-correlation', 'data-flow')),
    execution_mode VARCHAR(50) DEFAULT 'sequential' CHECK (execution_mode IN ('sequential', 'parallel', 'mixed')),
    nodes JSONB NOT NULL, -- Unified node structure for all types
    edges JSONB NOT NULL, -- Unified edge structure for all types
    metadata JSONB DEFAULT '{}', -- Additional metadata (triggers, schedules, etc.)
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    version INTEGER DEFAULT 1,
    
    UNIQUE(uuid)
);
```

#### Process Types

1. **`business-process`**: Traditional business process workflows with phases and tasks
2. **`event-correlation`**: Event monitoring and correlation rules
3. **`data-flow`**: Data transformation and ETL workflows

#### Execution Modes

1. **`sequential`**: Processes execute one after another
2. **`parallel`**: Processes execute simultaneously
3. **`mixed`**: Combination of sequential and parallel execution

## Unified Data Structure

### Node Structure

All process types use the same node structure with type-specific data:

```json
{
  "id": "node-1",
  "type": "phaseNode|eventCorrelationNode|entityNode|actionNode|correlationNode",
  "position": {"x": 100, "y": 100},
  "data": {
    // Type-specific data
  }
}
```

### Edge Structure

All process types use the same edge structure:

```json
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "type": "smoothstep",
  "style": {"stroke": "#111827", "strokeWidth": 3},
  "data": {
    // Type-specific edge data
  }
}
```

## Data Examples

### 1. Business Process Example

```json
{
  "name": "Customer Data Pipeline",
  "process_type": "business-process",
  "execution_mode": "mixed",
  "nodes": [
    {
      "id": "phase-1",
      "type": "phaseNode",
      "position": {"x": 100, "y": 100},
      "data": {
        "label": "Data Ingestion",
        "phaseType": "ingestion",
        "executionMode": "parallel",
        "calculators": [
          {
            "id": "calc-1",
            "name": "Load Customer Data",
            "application": "ETL Tool",
            "dependencies": [],
            "parallelGroup": "group-1"
          }
        ]
      }
    },
    {
      "id": "action-1",
      "type": "actionNode",
      "position": {"x": 400, "y": 100},
      "data": {
        "label": "Process Completion",
        "actionType": "notification",
        "eventType": "business-process-completed"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "phase-1",
      "target": "action-1",
      "type": "smoothstep",
      "data": {"dependencyType": "completion"}
    }
  ],
  "metadata": {
    "triggers": ["daily-schedule"],
    "timeout": 3600,
    "retryPolicy": {"maxRetries": 3},
    "tags": ["data-pipeline", "customer"]
  }
}
```

### 2. Event Correlation Example

```json
{
  "name": "Customer Order Event Correlation",
  "process_type": "event-correlation",
  "execution_mode": "parallel",
  "nodes": [
    {
      "id": "event-1",
      "type": "eventCorrelationNode",
      "position": {"x": 100, "y": 100},
      "data": {
        "label": "Customer Data Ingestion",
        "eventType": "data-ingestion",
        "status": "completed",
        "timestamp": "2024-01-15T10:00:00Z",
        "duration": "2m 30s",
        "impact": "medium",
        "source": "crm_system",
        "conditions": {"status": "active"}
      }
    },
    {
      "id": "correlation-1",
      "type": "correlationNode",
      "position": {"x": 400, "y": 100},
      "data": {
        "label": "Order Completion Trigger",
        "correlationType": "sequence",
        "ruleId": "rule_001",
        "condition": "event-1 AND event-2",
        "timeout": 300,
        "action": "trigger_order_completion"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "event-1",
      "target": "correlation-1",
      "type": "smoothstep",
      "data": {"correlationType": "dependency"}
    }
  ],
  "metadata": {
    "monitoring": {"enabled": true, "interval": 30},
    "alerts": {"email": true, "slack": true},
    "retention": {"days": 30},
    "tags": ["order-processing", "customer"]
  }
}
```

### 3. Data Flow Example

```json
{
  "name": "Customer Data Flow",
  "process_type": "data-flow",
  "execution_mode": "sequential",
  "nodes": [
    {
      "id": "entity-1",
      "type": "entityNode",
      "position": {"x": 100, "y": 100},
      "data": {
        "label": "Customer Data",
        "entityType": "customer",
        "attributes": ["id", "name", "email"],
        "selectedAttributes": ["id", "name"],
        "source": "customer_database"
      }
    },
    {
      "id": "join-1",
      "type": "joinNode",
      "position": {"x": 300, "y": 100},
      "data": {
        "label": "Join Condition",
        "joinConditions": [
          {
            "field": "region",
            "operator": "equals",
            "value": "APAC"
          }
        ]
      }
    },
    {
      "id": "action-1",
      "type": "actionNode",
      "position": {"x": 500, "y": 100},
      "data": {
        "label": "Process Customer",
        "actionType": "data-processing",
        "parameters": {
          "outputFormat": "json",
          "batchSize": 1000
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "entity-1",
      "target": "join-1",
      "type": "smoothstep"
    },
    {
      "id": "edge-2",
      "source": "join-1",
      "target": "action-1",
      "type": "smoothstep"
    }
  ],
  "metadata": {
    "scheduling": {"frequency": "daily", "time": "02:00"},
    "dataRetention": {"days": 90},
    "tags": ["data-flow", "customer", "etl"]
  }
}
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_process_configs_uuid ON process_configs(uuid);
CREATE INDEX idx_process_configs_type ON process_configs(process_type);
CREATE INDEX idx_process_configs_active ON process_configs(is_active);
CREATE INDEX idx_process_configs_created_by ON process_configs(created_by);
CREATE INDEX idx_process_configs_nodes ON process_configs USING GIN(nodes);
CREATE INDEX idx_process_configs_edges ON process_configs USING GIN(edges);
CREATE INDEX idx_process_configs_metadata ON process_configs USING GIN(metadata);
CREATE INDEX idx_process_configs_created_at ON process_configs(created_at);
```

## Views

### Active Process Configurations
```sql
CREATE VIEW active_process_configs AS
SELECT * FROM process_configs 
WHERE is_active = true;
```

### Process Statistics by Type
```sql
CREATE VIEW process_configs_by_type AS
SELECT 
    process_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE is_active = true) as active_count
FROM process_configs 
GROUP BY process_type;
```

## Functions

### Get Process Statistics
```sql
CREATE OR REPLACE FUNCTION get_process_stats()
RETURNS TABLE (
    total_processes BIGINT,
    business_processes BIGINT,
    event_correlations BIGINT,
    data_flows BIGINT,
    active_processes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_processes,
        COUNT(*) FILTER (WHERE process_type = 'business-process') as business_processes,
        COUNT(*) FILTER (WHERE process_type = 'event-correlation') as event_correlations,
        COUNT(*) FILTER (WHERE process_type = 'data-flow') as data_flows,
        COUNT(*) FILTER (WHERE is_active = true) as active_processes
    FROM process_configs;
END;
$$ LANGUAGE plpgsql;
```

## Benefits of Unified Structure

1. **Consistency**: All process types use the same visual representation
2. **Interoperability**: Business processes can trigger event correlations and vice versa
3. **Reusability**: Nodes and edges can be shared between different process types
4. **Scalability**: Easy to add new process types without schema changes
5. **Maintenance**: Single codebase for handling all process types
6. **Analytics**: Unified reporting and monitoring across all process types

## Migration Notes

- The old `correlation_configs` table has been replaced with `process_configs`
- All existing data has been migrated to the new unified format
- The new structure is backward compatible with existing UI components
- New features like parallel execution and metadata are now supported


