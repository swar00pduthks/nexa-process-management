# 🗄️ Database Schema Documentation (UI-Aligned)

This document provides information about the simplified database schema for the Nexa Process Management platform, aligned with the actual UI components.

## 📋 Overview

The database schema is designed to support the three main UI screens:
- **Process Orchestration**: Business process management with phases and calculators
- **Flow Builder**: Visual flow building with entities, joins, and actions
- **Event Correlation**: Event monitoring and correlation (placeholder for future)

## 🏗️ Database Tables

### 1. **users** Table

**Purpose**: Store user information for authentication and authorization.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **correlation_configs** Table

**Purpose**: Store configurations for all three UI screens in a unified way.

```sql
CREATE TABLE correlation_configs (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config_type VARCHAR(50) NOT NULL CHECK (config_type IN ('process-orchestration', 'event-correlation', 'flow-builder')),
    config_data JSONB NOT NULL,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    UNIQUE(uuid)
);
```

**Key Features**:
- **Simple structure**: Only essential fields needed by UI
- **JSONB storage**: Flexible storage for different UI screen data
- **Type classification**: Maps to UI components (ProcessOrchestrator, FlowBuilder, EventCorrelation)
- **Soft delete**: Via `is_active` flag

## 📊 Data Types and Storage

### Process Orchestration Data (from ProcessOrchestrator.js)
```json
{
  "id": "test-process-1",
  "name": "Customer Data Pipeline",
  "description": "End-to-end customer data processing pipeline",
  "phases": [
    {
      "id": "phase-1",
      "name": "Data Ingestion",
      "description": "Ingest customer data from multiple sources",
      "calculators": [
        {
          "id": "calc-1",
          "name": "Load Customer Data",
          "application": "ETL Tool"
        }
      ],
      "subPhases": [...]
    }
  ],
  "processAction": {
    "eventType": "business-process-completed",
    "eventName": "customer-pipeline-completed",
    "contextMapping": {
      "businessDate": "${businessDate}",
      "region": "${region}",
      "processId": "${processId}"
    }
  }
}
```

### Flow Builder Data (from FlowBuilder.js)
```json
{
  "nodes": [
    {
      "id": "entity-1",
      "type": "entityNode",
      "position": {"x": 100, "y": 100},
      "data": {
        "label": "Customer Data",
        "entityType": "customer",
        "attributes": ["id", "name", "email", "region"],
        "selectedAttributes": ["id", "name"]
      }
    },
    {
      "id": "join-1",
      "type": "joinNode",
      "position": {"x": 300, "y": 100},
      "data": {
        "label": "Join Condition",
        "joinConditions": [...],
        "contextMapping": {...}
      }
    },
    {
      "id": "action-1",
      "type": "actionNode",
      "position": {"x": 500, "y": 100},
      "data": {
        "label": "Process Customer",
        "actionType": "data-processing",
        "parameters": {...}
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "entity-1",
      "target": "join-1",
      "type": "smoothstep"
    }
  ]
}
```

### Event Correlation Data (placeholder)
```json
{
  "events": [
    {
      "name": "customer_created",
      "source": "crm_system",
      "conditions": {"status": "active"}
    }
  ],
  "correlation_rules": [
    {
      "rule_id": "rule_001",
      "condition": "customer_created AND profile_updated",
      "action": "trigger_onboarding_workflow",
      "timeout": 300
    }
  ]
}
```

## 🔍 Indexing Strategy

### Performance Indexes
```sql
-- UUID-based lookups
CREATE INDEX idx_correlation_configs_uuid ON correlation_configs(uuid);

-- Type-based filtering (for UI screen filtering)
CREATE INDEX idx_correlation_configs_type ON correlation_configs(config_type);

-- Active configurations
CREATE INDEX idx_correlation_configs_active ON correlation_configs(is_active);

-- User-based filtering
CREATE INDEX idx_correlation_configs_created_by ON correlation_configs(created_by);

-- JSONB queries
CREATE INDEX idx_correlation_configs_config_data ON correlation_configs USING GIN(config_data);

-- Date-based queries
CREATE INDEX idx_correlation_configs_created_at ON correlation_configs(created_at);
```

## 🚀 Database Views

### Active Configurations
```sql
CREATE VIEW active_correlation_configs AS
SELECT * FROM correlation_configs 
WHERE is_active = true;
```

## 📈 Query Patterns

### Common Queries

1. **Get all process orchestrations**
   ```sql
   SELECT * FROM correlation_configs 
   WHERE config_type = 'process-orchestration' AND is_active = true;
   ```

2. **Get all flow builders**
   ```sql
   SELECT * FROM correlation_configs 
   WHERE config_type = 'flow-builder' AND is_active = true;
   ```

3. **Get configurations by user**
   ```sql
   SELECT * FROM correlation_configs 
   WHERE created_by = 1 AND is_active = true;
   ```

4. **Search by name**
   ```sql
   SELECT * FROM correlation_configs 
   WHERE name ILIKE '%customer%' AND is_active = true;
   ```

5. **Get recent configurations**
   ```sql
   SELECT * FROM correlation_configs 
   WHERE is_active = true 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

## 🔄 Triggers and Functions

### Automatic Timestamp Updates
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_correlation_configs_updated_at 
    BEFORE UPDATE ON correlation_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🎯 UI Alignment

### Process Orchestration Screen
- **Data Structure**: Matches `ProcessOrchestrator.js` component
- **Fields**: phases, calculators, subPhases, processAction
- **Usage**: Business process visualization and management

### Flow Builder Screen
- **Data Structure**: Matches `FlowBuilder.js` component
- **Fields**: nodes (entityNode, joinNode, actionNode), edges
- **Usage**: Visual flow building and configuration

### Event Correlation Screen
- **Data Structure**: Placeholder for future implementation
- **Fields**: events, correlation_rules
- **Usage**: Event monitoring and correlation (not yet implemented)

## 🧪 Testing Data

The migration includes sample data that matches the UI components:

1. **Process Orchestration**: Customer Data Pipeline (matches ProcessOrchestrator.js)
2. **Flow Builder**: Customer Data Flow (matches FlowBuilder.js)
3. **Event Correlation**: System Event Monitoring (placeholder)

## 📚 Best Practices

1. **UI-First Design**: Schema designed around actual UI requirements
2. **JSONB Flexibility**: Allows UI components to store their specific data structures
3. **Simple Structure**: Only essential fields, no over-engineering
4. **Type Safety**: Config types map directly to UI components
5. **Soft Delete**: Maintains data integrity with `is_active` flag

## 🔒 Security Considerations

1. **User-based Access**: All configurations linked to users
2. **Audit Trail**: Timestamps for creation and updates
3. **Data Validation**: Validate JSONB data at application level

---

**This simplified schema provides a clean, UI-aligned foundation that supports the current screens without unnecessary complexity.**
