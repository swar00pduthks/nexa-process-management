# API Documentation

This folder contains the backend API components for the Nexa Process Management platform.

## 🏗️ Planned Structure

### Core Services
- **Process Orchestration API**: REST endpoints for process management
- **Event Correlation API**: Event processing and correlation services
- **Flow Builder API**: Flow definition and execution endpoints
- **Authentication & Authorization**: User management and security

### Data Models
- **Process Models**: Process definition schemas
- **Event Models**: Event data structures
- **Flow Models**: Flow configuration schemas
- **User Models**: User and permission models

### Integration Points
- **Database Connectors**: PostgreSQL, MongoDB, Redis
- **Message Queues**: Kafka, RabbitMQ
- **External APIs**: Third-party service integrations
- **Monitoring**: Health checks and metrics

## 🚀 Getting Started

### Prerequisites
- Java 17+ or Node.js 18+
- PostgreSQL 14+
- Kafka 3.0+
- Redis 6.0+

### Development Setup
```bash
# Clone the repository
git clone https://github.com/swar00pduthks/nexa-process-management.git

# Navigate to API folder
cd nexa-process-management/api

# Install dependencies (when implemented)
npm install
# or
mvn install

# Start development server
npm run dev
# or
mvn spring-boot:run
```

## 📋 API Endpoints

### Process Orchestration
- `POST /api/v1/processes` - Create new process
- `GET /api/v1/processes` - List all processes
- `GET /api/v1/processes/{id}` - Get process details
- `PUT /api/v1/processes/{id}` - Update process
- `DELETE /api/v1/processes/{id}` - Delete process

### Event Correlation
- `POST /api/v1/events` - Submit event
- `GET /api/v1/events` - Query events
- `GET /api/v1/events/correlations` - Get event correlations
- `POST /api/v1/events/correlations` - Create correlation rule

### Flow Builder
- `POST /api/v1/flows` - Create flow definition
- `GET /api/v1/flows` - List flows
- `POST /api/v1/flows/{id}/execute` - Execute flow
- `GET /api/v1/flows/{id}/status` - Get flow status

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://localhost:5432/nexa_process_management
DATABASE_USERNAME=nexa_user
DATABASE_PASSWORD=secure_password

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_TOPIC_EVENTS=nexa.events
KAFKA_TOPIC_PROCESSES=nexa.processes

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400
```

## 🧪 Testing

### Unit Tests
```bash
npm test
# or
mvn test
```

### Integration Tests
```bash
npm run test:integration
# or
mvn verify
```

### API Tests
```bash
npm run test:api
# or
mvn test -Dtest=ApiTestSuite
```

## 📊 Monitoring

### Health Checks
- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed health information
- `GET /metrics` - Application metrics

### Logging
- Structured logging with correlation IDs
- Log levels: DEBUG, INFO, WARN, ERROR
- Centralized log aggregation

## 🔒 Security

### Authentication
- JWT-based authentication
- OAuth2 integration support
- Multi-factor authentication (planned)

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- API rate limiting

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t nexa-process-management-api .

# Run container
docker run -p 8080:8080 nexa-process-management-api
```

### Kubernetes
```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods -l app=nexa-process-management-api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Nexa Process Management API** - Powering the next generation of business process orchestration.
