# 🐳 Docker Setup for Nexa Process Management

This document provides comprehensive instructions for running the Nexa Process Management platform using Docker and Docker Compose.

## 📋 Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For cloning the repository
- **At least 4GB RAM** available for Docker

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/swar00pduthks/nexa-process-management.git
cd nexa-process-management
```

### 2. Production Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Development Setup
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Start with debugging enabled
docker-compose -f docker-compose.dev.yml --profile debug up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Spring Boot   │    │   PostgreSQL    │
│   (React)       │◄──►│   API           │◄──►│   Database      │
│   Port: 80      │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Redis Cache   │
                    │   Port: 6379    │
                    └─────────────────┘
```

## 📦 Services

### 1. **Web Application** (`web`)
- **Technology**: React.js with Nginx
- **Port**: 80 (production) / 3000 (development)
- **Features**: 
  - Process orchestration interface
  - Event correlation dashboard
  - Flow builder
  - Real-time monitoring

### 2. **API Server** (`api`)
- **Technology**: Spring Boot 3.2
- **Port**: 8080
- **Features**:
  - RESTful API endpoints
  - JWT authentication
  - Process management
  - Event correlation
  - Health monitoring

### 3. **Database** (`postgres`)
- **Technology**: PostgreSQL 15
- **Port**: 5432
- **Features**:
  - Process definitions
  - Execution history
  - User management
  - Audit trails

### 4. **Cache** (`redis`)
- **Technology**: Redis 7
- **Port**: 6379
- **Features**:
  - Session management
  - Process state caching
  - Real-time data

### 5. **Database Admin** (`pgadmin`) - Development Only
- **Technology**: pgAdmin 4
- **Port**: 5050
- **Features**:
  - Database management interface
  - Query execution
  - Schema visualization

## 🔧 Configuration

### Environment Variables

#### Production (`docker-compose.yml`)
```yaml
# Database
DB_USERNAME=nexa_user
DB_PASSWORD=nexa_password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# Admin User
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

#### Development (`docker-compose.dev.yml`)
```yaml
# Additional development variables
SPRING_PROFILES_ACTIVE=dev
REACT_APP_API_URL=http://localhost:8080/api/v1
CHOKIDAR_USEPOLLING=true
```

### Custom Configuration

1. **Create `.env` file** in the root directory:
```bash
# Database
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=86400000

# Admin
ADMIN_USERNAME=your_admin_user
ADMIN_PASSWORD=your_admin_password
```

2. **Update Docker Compose files** to use environment variables:
```yaml
environment:
  - DB_USERNAME=${DB_USERNAME}
  - DB_PASSWORD=${DB_PASSWORD}
```

## 🛠️ Development Workflow

### 1. **Start Development Environment**
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Start specific service
docker-compose -f docker-compose.dev.yml up -d web api
```

### 2. **Hot Reload Development**
- **Frontend**: Changes in `web/src/` automatically reload
- **Backend**: Changes in `api/src/` trigger Spring Boot restart
- **Database**: Schema changes require migration

### 3. **Debugging**
```bash
# Start with debug profile
docker-compose -f docker-compose.dev.yml --profile debug up -d

# Connect debugger to API (port 5005)
# Connect debugger to Web (port 9229)
```

### 4. **Database Management**
```bash
# Access pgAdmin
# URL: http://localhost:5050
# Email: admin@nexadata.com
# Password: admin123

# Direct database access
docker exec -it nexa-postgres-dev psql -U nexa_user -d nexa_process_management_dev
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Web App**: `http://localhost/health`
- **API**: `http://localhost:8080/api/v1/actuator/health`
- **Database**: Internal health check
- **Redis**: Internal health check

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres

# Development logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Metrics
- **API Metrics**: `http://localhost:8080/api/v1/actuator/metrics`
- **Prometheus**: `http://localhost:8080/api/v1/actuator/prometheus`

## 🔒 Security

### Default Credentials
- **Admin User**: `admin` / `admin123`
- **Database**: `nexa_user` / `nexa_password`
- **pgAdmin**: `admin@nexadata.com` / `admin123`

### Security Recommendations
1. **Change default passwords** in production
2. **Use strong JWT secrets**
3. **Enable HTTPS** in production
4. **Restrict network access**
5. **Regular security updates**

## 🚀 Production Deployment

### 1. **Build Production Images**
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build web api
```

### 2. **Start Production Services**
```bash
# Start with production profile
docker-compose --profile production up -d

# Start without nginx (direct access)
docker-compose up -d web api postgres redis
```

### 3. **SSL/HTTPS Setup**
```bash
# Create SSL certificates
mkdir -p nginx/ssl
# Add your SSL certificates to nginx/ssl/

# Start with nginx reverse proxy
docker-compose --profile production up -d
```

## 🧹 Maintenance

### Cleanup
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ Data loss)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean development environment
docker-compose -f docker-compose.dev.yml down -v
```

### Backup Database
```bash
# Create backup
docker exec nexa-postgres pg_dump -U nexa_user nexa_process_management > backup.sql

# Restore backup
docker exec -i nexa-postgres psql -U nexa_user nexa_process_management < backup.sql
```

### Update Services
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :80
netstat -tulpn | grep :8080

# Change ports in docker-compose.yml
ports:
  - "8081:8080"  # Use different host port
```

#### 2. **Database Connection Issues**
```bash
# Check database logs
docker-compose logs postgres

# Test database connection
docker exec -it nexa-postgres psql -U nexa_user -d nexa_process_management
```

#### 3. **Memory Issues**
```bash
# Check Docker memory usage
docker stats

# Increase Docker memory limit in Docker Desktop
```

#### 4. **Build Failures**
```bash
# Clean build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Log Analysis
```bash
# View real-time logs
docker-compose logs -f --tail=100

# Search logs
docker-compose logs | grep ERROR

# Export logs
docker-compose logs > application.log
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Create an issue in the GitHub repository
4. Contact the development team

---

**Happy Dockerizing! 🐳**


