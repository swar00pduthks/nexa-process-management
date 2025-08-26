# Data Pipeline Event Correlation Use Cases

## Use Case 1: Multi-Input Job Orchestration

### Business Scenario
**Problem**: A business process requires data from 2 different sources to be available before a job can run. Currently, teams manually check if both datasets are ready, leading to delays and inefficiencies.

**Solution**: Automatically trigger the job when both input datasets are refreshed for the same business date.

### Business-Friendly Rule Template

#### Visual Rule Builder Interface
```
┌─────────────────────────────────────────────────────────────┐
│              Data Pipeline Orchestration Rule               │
├─────────────────────────────────────────────────────────────┤
│ Rule Name: [Auto-Trigger Job When Both Datasets Ready]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    CONDITIONS                           │ │
│ │                                                         │ │
│ │ WHEN: Dataset A ingestion event received               │ │
│ │ AND: Dataset B ingestion event received                │ │
│ │ AND: Both events have same business date               │ │
│ │ AND: Both datasets are successfully processed          │ │
│ │                                                         │ │
│ │ THEN: Trigger downstream job execution                 │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Natural Language Description
```
When both input datasets (Dataset A and Dataset B) are successfully 
ingested for the same business date, automatically trigger the 
downstream processing job.
```

### Technical Implementation

#### Context ID Flow Through Workflow (Multi-Application)
```
┌─────────────────────────────────────────────────────────────┐
│              Multi-Application Context Flow                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Business Process Initiated                              │
│    Global Context ID: correlation-2024-01-15-001          │
│    Expected: [customer_transactions, order_data]           │
│                                                             │
│ 2. CRM Application Event                                   │
│    App Context: crm-batch-2024-01-15-001                  │
│    Dataset: customer_transactions                          │
│    Mapping: crm-batch-2024-01-15-001 → correlation-2024-01-15-001 │
│                                                             │
│ 3. ERP Application Event                                   │
│    App Context: erp-daily-2024-01-15-002                  │
│    Dataset: order_data                                     │
│    Mapping: erp-daily-2024-01-15-002 → correlation-2024-01-15-001 │
│                                                             │
│ 4. Correlation Engine                                      │
│    Normalizes: Different app contexts to global context   │
│    Matches: Global context_id + business_date             │
│    Validates: All expected datasets received              │
│                                                             │
│ 5. Downstream Job Triggered                                │
│    Global Context ID: correlation-2024-01-15-001          │
│    Job: daily_customer_analysis                            │
│                                                             │
│ 6. Job Execution                                           │
│    Uses: Global correlation_id for tracking               │
│    Reports: Progress with global context_id               │
└─────────────────────────────────────────────────────────────┘
```

#### Event Structure Examples (Multi-Application CloudEvents)

##### CRM Application Event
```json
{
  "specversion": "1.0",
  "id": "crm-ingestion-2024-01-15-10-30-00-001",
  "source": "/crm/data/ingestion",
  "type": "com.crm.dataset.ingestion.completed",
  "time": "2024-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "dataset_name": "customer_transactions",
    "business_date": "2024-01-15",
    "ingestion_status": "success",
    "record_count": 15000,
    "processing_duration_seconds": 45,
    "data_quality_score": 0.98
  },
  "context_id": "crm-batch-2024-01-15-001",
  "context": {
    "batch_id": "crm-batch-2024-01-15-001",
    "application": "CRM",
    "process_type": "daily_batch",
    "priority": "normal",
    "owner": "crm_team"
  }
}
```

##### ERP Application Event
```json
{
  "specversion": "1.0",
  "id": "erp-ingestion-2024-01-15-11-15-00-002",
  "source": "/erp/data/ingestion",
  "type": "com.erp.dataset.ingestion.completed",
  "time": "2024-01-15T11:15:00Z",
  "datacontenttype": "application/json",
  "data": {
    "dataset_name": "order_data",
    "business_date": "2024-01-15",
    "ingestion_status": "success",
    "record_count": 8500,
    "processing_duration_seconds": 30,
    "data_quality_score": 0.99
  },
  "context_id": "erp-daily-2024-01-15-002",
  "context": {
    "daily_run_id": "erp-daily-2024-01-15-002",
    "application": "ERP",
    "process_type": "daily_extraction",
    "priority": "high",
    "owner": "erp_team"
  }
}
```

##### Context Normalization Mapping
```yaml
context_mapping:
  # CRM Application Mapping
  crm:
    source_pattern: "/crm/data/ingestion"
    context_mapping:
      batch_id: "context_id"
      application: "context.application"
      process_type: "context.process_type"
      priority: "context.priority"
      owner: "context.owner"
    
  # ERP Application Mapping  
  erp:
    source_pattern: "/erp/data/ingestion"
    context_mapping:
      daily_run_id: "context_id"
      application: "context.application"
      process_type: "context.process_type"
      priority: "context.priority"
      owner: "context.owner"
      
  # Global Context Generation
  global_context:
    correlation_id: "correlation-{business_date}-{sequence}"
    business_process: "daily_reporting"
    expected_datasets: ["customer_transactions", "order_data"]
    downstream_job: "daily_customer_analysis"
    sla_minutes: 120
    owner: "data_engineering_team"
```

#### Correlation Rule Configuration (Multi-Application)
```yaml
rule_name: "multi_input_job_trigger"
description: "Trigger job when both input datasets are ready for same business date"

# Context Normalization
context_normalization:
  enabled: true
  global_correlation_id: "correlation-${data.business_date}-${sequence}"
  
  # Application-specific mappings
  application_mappings:
    crm:
      source_pattern: "/crm/data/ingestion"
      context_id_mapping: "context.batch_id"
      priority_mapping: "context.priority"
      
    erp:
      source_pattern: "/erp/data/ingestion" 
      context_id_mapping: "context.daily_run_id"
      priority_mapping: "context.priority"

conditions:
  # CRM Dataset Condition
  - event_type: "com.crm.dataset.ingestion.completed"
    data.dataset_name: "customer_transactions"
    data.ingestion_status: "success"
    source: "/crm/data/ingestion"
    
  # ERP Dataset Condition  
  - event_type: "com.erp.dataset.ingestion.completed"
    data.dataset_name: "order_data"
    data.ingestion_status: "success"
    source: "/erp/data/ingestion"
    
correlation_logic:
  # Match business date across all events
  - match_field: "data.business_date"
    operator: "equals"
    
  # Use normalized global correlation ID
  - match_field: "normalized_context_id"
    operator: "equals"
    
  # Time window for correlation
  - time_window: "24h"
    operator: "within"
    
  # Validate all expected datasets received
  - context.validation:
      expected_datasets: ["customer_transactions", "order_data"]
      received_datasets: "data.dataset_name"
      operator: "all_received"
    
actions:
  - action_type: "trigger_job"
    job_name: "daily_customer_analysis"
    parameters:
      correlation_id: "${normalized_context_id}"
      business_date: "${data.business_date}"
      input_datasets: ["customer_transactions", "order_data"]
      priority: "${normalized_priority}"
      sla_minutes: 120
      source_applications: ["CRM", "ERP"]
      
  - action_type: "send_notification"
    channel: "slack"
    message: "Job triggered: daily_customer_analysis for ${data.business_date} (Correlation: ${normalized_context_id})"
    
  - action_type: "update_dashboard"
    metric: "jobs_auto_triggered"
    increment: 1
    tags:
      correlation_id: "${normalized_context_id}"
      business_process: "daily_reporting"
      applications: "CRM,ERP"
```

### Business Benefits

#### Before (Manual Process)
- ❌ Teams manually check dataset availability
- ❌ Delays in job execution (hours to days)
- ❌ Inconsistent timing
- ❌ Human errors in coordination
- ❌ No audit trail
- ❌ No end-to-end tracking

#### After (Automated Correlation with CloudEvents)
- ✅ Instant job triggering when conditions are met
- ✅ Consistent execution timing
- ✅ Reduced manual overhead
- ✅ Complete audit trail with context ID
- ✅ Real-time notifications
- ✅ End-to-end workflow tracking
- ✅ SLA monitoring and alerting
- ✅ Business process visibility

#### CloudEvents Context ID Benefits
- **End-to-End Tracking**: Follow entire workflow from start to finish
- **Business Process Visibility**: See which business process each job belongs to
- **SLA Management**: Automatic SLA monitoring and alerting
- **Priority Handling**: High-priority processes get faster attention
- **Audit Compliance**: Complete traceability for compliance requirements
- **Troubleshooting**: Quick identification of issues using correlation ID

#### Multi-Application Context Normalization Benefits
- **Application Agnostic**: Works with any application's context structure
- **Flexible Mapping**: Configurable mappings for different application patterns
- **Global Correlation**: Single correlation ID across all applications
- **Backward Compatibility**: Existing applications don't need to change
- **Extensible**: Easy to add new applications and context patterns
- **Audit Trail**: Complete mapping history for troubleshooting

### Monitoring Dashboard

#### Real-Time Status
```
┌─────────────────────────────────────────────────────────────┐
│              Data Pipeline Orchestration                    │
├─────────────────────────────────────────────────────────────┤
│ Business Date: 2024-01-15                                  │
│                                                             │
│ Dataset A: ✅ Ready (10:30 AM)                             │
│ Dataset B: ✅ Ready (11:15 AM)                             │
│                                                             │
│ Job Status: 🚀 Triggered (11:15 AM)                        │
│                                                             │
│ Time Saved: 4 hours (vs manual process)                    │
└─────────────────────────────────────────────────────────────┘
```

#### Performance Metrics
- **Auto-triggered jobs**: 45 this week
- **Time saved**: 180 hours
- **Success rate**: 98%
- **Average trigger time**: 15 minutes after both datasets ready

### Context Normalization Process

#### How Context Normalization Works
```
┌─────────────────────────────────────────────────────────────┐
│              Context Normalization Flow                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Event Received                                          │
│    Source: /crm/data/ingestion                            │
│    App Context: crm-batch-2024-01-15-001                  │
│                                                             │
│ 2. Application Detection                                   │
│    Pattern Match: /crm/data/ingestion → CRM               │
│    Context Mapping: context.batch_id → context_id         │
│                                                             │
│ 3. Global Context Generation                               │
│    Business Date: 2024-01-15                              │
│    Sequence: 001                                          │
│    Global ID: correlation-2024-01-15-001                  │
│                                                             │
│ 4. Context Enrichment                                      │
│    Add: business_process, expected_datasets, downstream_job │
│    Normalize: priority, owner, sla_minutes                │
│                                                             │
│ 5. Normalized Event                                        │
│    Global Context ID: correlation-2024-01-15-001          │
│    Ready for correlation matching                          │
└─────────────────────────────────────────────────────────────┘
```

#### Context Mapping Examples
```yaml
# Example 1: CRM Application
input_event:
  source: "/crm/data/ingestion"
  context_id: "crm-batch-2024-01-15-001"
  context:
    batch_id: "crm-batch-2024-01-15-001"
    priority: "normal"

normalized_event:
  normalized_context_id: "correlation-2024-01-15-001"
  normalized_priority: "normal"
  business_process: "daily_reporting"

# Example 2: ERP Application  
input_event:
  source: "/erp/data/ingestion"
  context_id: "erp-daily-2024-01-15-002"
  context:
    daily_run_id: "erp-daily-2024-01-15-002"
    priority: "high"

normalized_event:
  normalized_context_id: "correlation-2024-01-15-001"
  normalized_priority: "high"
  business_process: "daily_reporting"
```

### Advanced Features
```yaml
additional_conditions:
  - data_quality_score: ">= 0.95"
  - record_count: "> 0"
  - processing_duration: "< 300"  # 5 minutes
```

#### 2. Retry Logic
```yaml
retry_config:
  max_attempts: 3
  delay_minutes: 30
  backoff_multiplier: 2
```

#### 3. Dependency Chain
```yaml
job_dependencies:
  - prerequisite_job: "data_validation_job"
    status: "completed"
  - prerequisite_job: "data_cleansing_job"
    status: "completed"
```

### Error Handling

#### Common Scenarios
1. **Dataset A ready, Dataset B delayed**
   - Wait for Dataset B (up to 24 hours)
   - Send alert if Dataset B doesn't arrive

2. **Data quality issues**
   - Skip job trigger if quality score < threshold
   - Notify data engineering team

3. **System failures**
   - Retry job trigger
   - Fallback to manual process if needed

### Integration Examples

#### Apache Airflow Integration
```python
def trigger_downstream_job(correlation_id, business_date, datasets, context):
    """Trigger job when correlation conditions are met"""
    dag_id = context.get("downstream_job", "data_processing_pipeline")
    execution_date = business_date
    
    # Trigger Airflow DAG with correlation context
    airflow_client.trigger_dag(
        dag_id=dag_id,
        execution_date=execution_date,
        conf={
            "correlation_id": correlation_id,
            "business_date": business_date,
            "input_datasets": datasets,
            "priority": context.get("priority", "normal"),
            "sla_minutes": context.get("sla_minutes", 60),
            "business_process": context.get("business_process", "unknown")
        }
    )
    
    # Log correlation event
    log_correlation_event(
        correlation_id=correlation_id,
        event_type="job_triggered",
        dag_id=dag_id,
        business_date=business_date
    )
```

#### Kubernetes Job Integration
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{context.downstream_job}}-{{business_date}}"
  labels:
    correlation-id: "{{correlation_id}}"
    business-process: "{{context.business_process}}"
    business-date: "{{business_date}}"
spec:
  template:
    spec:
      containers:
      - name: data-processor
        image: data-processing:latest
        env:
        - name: CORRELATION_ID
          value: "{{correlation_id}}"
        - name: BUSINESS_DATE
          value: "{{business_date}}"
        - name: INPUT_DATASETS
          value: "{{datasets}}"
        - name: PRIORITY
          value: "{{context.priority}}"
        - name: SLA_MINUTES
          value: "{{context.sla_minutes}}"
        - name: BUSINESS_PROCESS
          value: "{{context.business_process}}"
      restartPolicy: Never
```

### Success Metrics

#### Operational Efficiency
- **Reduced manual effort**: 90% decrease in coordination time
- **Faster execution**: 75% reduction in time-to-completion
- **Improved reliability**: 99.5% success rate

#### Business Impact
- **Faster insights**: Data available 4 hours earlier
- **Cost savings**: Reduced manual overhead
- **Better decision making**: More timely data availability

---

## Use Case 2: [To be added based on your second use case]

*Please provide your second use case and I'll create a similar detailed template for it.*
