package com.nexadata.processmanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "process_configs")
@EntityListeners(AuditingEntityListener.class)
public class ProcessConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(unique = true, nullable = false)
    private UUID uuid = UUID.randomUUID();

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "process_type", nullable = false)
    private ProcessType processType;

    @Enumerated(EnumType.STRING)
    @Column(name = "execution_mode")
    private ExecutionMode executionMode = ExecutionMode.SEQUENTIAL;

    @NotNull
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "nodes", nullable = false, columnDefinition = "JSONB")
    private String nodes;

    @NotNull
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "edges", nullable = false, columnDefinition = "JSONB")
    private String edges;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata = "{}";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    @JsonIgnore
    private User createdBy;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @NotNull
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "version")
    private Integer version = 1;

    public enum ProcessType {
        BUSINESS_PROCESS("business-process"),
        EVENT_CORRELATION("event-correlation"),
        DATA_FLOW("data-flow");

        private final String value;

        ProcessType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum ExecutionMode {
        SEQUENTIAL("sequential"),
        PARALLEL("parallel"),
        MIXED("mixed");

        private final String value;

        ExecutionMode(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    // Constructors
    public ProcessConfig() {}

    public ProcessConfig(String name, String description, ProcessType processType) {
        this.name = name;
        this.description = description;
        this.processType = processType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProcessType getProcessType() {
        return processType;
    }

    public void setProcessType(ProcessType processType) {
        this.processType = processType;
    }

    public ExecutionMode getExecutionMode() {
        return executionMode;
    }

    public void setExecutionMode(ExecutionMode executionMode) {
        this.executionMode = executionMode;
    }

    public String getNodes() {
        return nodes;
    }

    public void setNodes(String nodes) {
        this.nodes = nodes;
    }

    public String getEdges() {
        return edges;
    }

    public void setEdges(String edges) {
        this.edges = edges;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    // Business methods
    public boolean isBusinessProcess() {
        return ProcessType.BUSINESS_PROCESS.equals(this.processType);
    }

    public boolean isEventCorrelation() {
        return ProcessType.EVENT_CORRELATION.equals(this.processType);
    }

    public boolean isDataFlow() {
        return ProcessType.DATA_FLOW.equals(this.processType);
    }

    public void incrementVersion() {
        this.version = this.version != null ? this.version + 1 : 1;
    }

    @Override
    public String toString() {
        return "ProcessConfig{" +
                "id=" + id +
                ", uuid=" + uuid +
                ", name='" + name + '\'' +
                ", processType=" + processType +
                ", executionMode=" + executionMode +
                ", isActive=" + isActive +
                ", version=" + version +
                '}';
    }
}
