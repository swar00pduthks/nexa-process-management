-- Create Unified Process Configuration Table
-- This table stores both business processes and event correlations in the same format
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

-- Create indexes for better performance
CREATE INDEX idx_process_configs_uuid ON process_configs(uuid);
CREATE INDEX idx_process_configs_type ON process_configs(process_type);
CREATE INDEX idx_process_configs_active ON process_configs(is_active);
CREATE INDEX idx_process_configs_created_by ON process_configs(created_by);
CREATE INDEX idx_process_configs_nodes ON process_configs USING GIN(nodes);
CREATE INDEX idx_process_configs_edges ON process_configs USING GIN(edges);
CREATE INDEX idx_process_configs_metadata ON process_configs USING GIN(metadata);
CREATE INDEX idx_process_configs_created_at ON process_configs(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for process_configs table
CREATE TRIGGER update_process_configs_updated_at 
    BEFORE UPDATE ON process_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (unified format)
INSERT INTO process_configs (
    name, 
    description, 
    process_type,
    execution_mode,
    nodes,
    edges,
    metadata,
    created_by
) VALUES 
-- Sample Business Process (Customer Data Pipeline)
(
    'Customer Data Pipeline',
    'End-to-end customer data processing pipeline with parallel execution',
    'business-process',
    'mixed',
    '[
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
                    },
                    {
                        "id": "calc-2",
                        "name": "Validate Data Quality",
                        "application": "Data Quality",
                        "dependencies": ["calc-1"],
                        "parallelGroup": "group-1"
                    }
                ],
                "subPhases": [
                    {
                        "id": "subphase-1-1",
                        "name": "Batch Processing",
                        "executionMode": "sequential",
                        "calculators": [
                            {
                                "id": "calc-1-1",
                                "name": "Historical Load",
                                "application": "Batch ETL"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "phase-2",
            "type": "phaseNode",
            "position": {"x": 400, "y": 100},
            "data": {
                "label": "Data Transformation",
                "phaseType": "transformation",
                "executionMode": "sequential",
                "dependencies": ["phase-1"],
                "calculators": [
                    {
                        "id": "calc-3",
                        "name": "Data Cleansing",
                        "application": "Data Wrangler"
                    },
                    {
                        "id": "calc-4",
                        "name": "Feature Engineering",
                        "application": "ML Pipeline",
                        "dependencies": ["calc-3"]
                    }
                ]
            }
        },
        {
            "id": "action-1",
            "type": "actionNode",
            "position": {"x": 700, "y": 100},
            "data": {
                "label": "Process Completion",
                "actionType": "notification",
                "eventType": "business-process-completed",
                "eventName": "customer-pipeline-completed",
                "contextMapping": {
                    "businessDate": "${businessDate}",
                    "region": "${region}",
                    "processId": "${processId}"
                }
            }
        }
    ]',
    '[
        {
            "id": "edge-1-2",
            "source": "phase-1",
            "target": "phase-2",
            "type": "smoothstep",
            "style": {"stroke": "#111827", "strokeWidth": 3},
            "data": {"dependencyType": "completion"}
        },
        {
            "id": "edge-2-action",
            "source": "phase-2",
            "target": "action-1",
            "type": "smoothstep",
            "style": {"stroke": "#111827", "strokeWidth": 3},
            "data": {"dependencyType": "completion"}
        }
    ]',
    '{
        "triggers": ["daily-schedule"],
        "timeout": 3600,
        "retryPolicy": {"maxRetries": 3, "backoff": "exponential"},
        "notifications": ["email", "slack"],
        "tags": ["data-pipeline", "customer", "etl"]
    }',
    1
),
-- Sample Event Correlation (Customer Order Processing)
(
    'Customer Order Event Correlation',
    'Monitor and correlate customer order events across systems',
    'event-correlation',
    'parallel',
    '[
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
                "description": "Customer data loaded from CRM system",
                "source": "crm_system",
                "conditions": {"status": "active"}
            }
        },
        {
            "id": "event-2",
            "type": "eventCorrelationNode",
            "position": {"x": 100, "y": 300},
            "data": {
                "label": "Order Processing",
                "eventType": "data-processing",
                "status": "running",
                "timestamp": "2024-01-15T10:02:00Z",
                "duration": "1m 45s",
                "impact": "high",
                "description": "Processing customer orders from e-commerce platform",
                "source": "ecommerce_system",
                "conditions": {"order_status": "pending"}
            }
        },
        {
            "id": "event-3",
            "type": "eventCorrelationNode",
            "position": {"x": 400, "y": 200},
            "data": {
                "label": "Payment Processing",
                "eventType": "data-processing",
                "status": "warning",
                "timestamp": "2024-01-15T10:03:00Z",
                "duration": "3m 15s",
                "impact": "high",
                "description": "Processing payment transactions",
                "source": "payment_gateway",
                "conditions": {"payment_status": "processing"}
            }
        },
        {
            "id": "correlation-1",
            "type": "correlationNode",
            "position": {"x": 700, "y": 200},
            "data": {
                "label": "Order Completion Trigger",
                "correlationType": "sequence",
                "ruleId": "rule_001",
                "condition": "event-1 AND event-2 AND event-3",
                "timeout": 300,
                "action": "trigger_order_completion"
            }
        }
    ]',
    '[
        {
            "id": "edge-1-3",
            "source": "event-1",
            "target": "event-3",
            "type": "smoothstep",
            "style": {"stroke": "#10b981", "strokeWidth": 3},
            "data": {"correlationType": "dependency"}
        },
        {
            "id": "edge-2-3",
            "source": "event-2",
            "target": "event-3",
            "type": "smoothstep",
            "style": {"stroke": "#3b82f6", "strokeWidth": 3},
            "data": {"correlationType": "trigger"}
        },
        {
            "id": "edge-3-correlation",
            "source": "event-3",
            "target": "correlation-1",
            "type": "smoothstep",
            "style": {"stroke": "#f59e0b", "strokeWidth": 3},
            "data": {"correlationType": "influence"}
        }
    ]',
    '{
        "monitoring": {"enabled": true, "interval": 30},
        "alerts": {"email": true, "slack": true, "webhook": "https://api.example.com/alerts"},
        "retention": {"days": 30},
        "tags": ["order-processing", "customer", "payment"]
    }',
    1
),
-- Sample Data Flow (Customer Data Flow)
(
    'Customer Data Flow',
    'Customer data correlation and processing flow',
    'data-flow',
    'sequential',
    '[
        {
            "id": "entity-1",
            "type": "entityNode",
            "position": {"x": 100, "y": 100},
            "data": {
                "label": "Customer Data",
                "entityType": "customer",
                "attributes": ["id", "name", "email", "region"],
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
                ],
                "contextMapping": {
                    "businessDate": "${businessDate}"
                }
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
    ]',
    '[
        {
            "id": "edge-1",
            "source": "entity-1",
            "target": "join-1",
            "type": "smoothstep",
            "style": {"stroke": "#111827", "strokeWidth": 3}
        },
        {
            "id": "edge-2",
            "source": "join-1",
            "target": "action-1",
            "type": "smoothstep",
            "style": {"stroke": "#111827", "strokeWidth": 3}
        }
    ]',
    '{
        "scheduling": {"frequency": "daily", "time": "02:00"},
        "dataRetention": {"days": 90},
        "tags": ["data-flow", "customer", "etl"]
    }',
    1
);

-- Create view for active configurations
CREATE VIEW active_process_configs AS
SELECT * FROM process_configs 
WHERE is_active = true;

-- Create view for configurations by type
CREATE VIEW process_configs_by_type AS
SELECT 
    process_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE is_active = true) as active_count
FROM process_configs 
GROUP BY process_type;

-- Create function to get process statistics
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
