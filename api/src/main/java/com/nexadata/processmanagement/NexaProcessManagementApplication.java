package com.nexadata.processmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot application class for Nexa Process Management API.
 * 
 * This application provides REST endpoints for:
 * - Process orchestration and management
 * - Event correlation and monitoring
 * - Flow builder and execution
 * - User authentication and authorization
 * 
 * @author Nexa Data Platform
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class NexaProcessManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(NexaProcessManagementApplication.class, args);
    }
}


