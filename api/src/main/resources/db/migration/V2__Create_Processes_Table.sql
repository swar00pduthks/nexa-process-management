-- Create Processes Table
CREATE TABLE processes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    process_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    definition JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes
CREATE INDEX idx_processes_name ON processes(name);
CREATE INDEX idx_processes_type ON processes(process_type);
CREATE INDEX idx_processes_status ON processes(status);
CREATE INDEX idx_processes_created_by ON processes(created_by);
CREATE INDEX idx_processes_active ON processes(is_active);

-- Create Process Executions Table
CREATE TABLE process_executions (
    id BIGSERIAL PRIMARY KEY,
    process_id BIGINT REFERENCES processes(id),
    execution_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    result JSONB,
    error_message TEXT,
    created_by BIGINT REFERENCES users(id)
);

-- Create indexes for process executions
CREATE INDEX idx_process_executions_process_id ON process_executions(process_id);
CREATE INDEX idx_process_executions_execution_id ON process_executions(execution_id);
CREATE INDEX idx_process_executions_status ON process_executions(status);
CREATE INDEX idx_process_executions_started_at ON process_executions(started_at);


