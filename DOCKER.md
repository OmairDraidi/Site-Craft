# 🐳 Docker Guide for SiteCraft

This guide explains how to run SiteCraft using Docker.

## Prerequisites

- **Docker Desktop** installed and running
- **Docker Compose** (included with Docker Desktop)
- At least 4GB of free RAM
- At least 10GB of free disk space

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/OmairDraidi/Site-Craft.git
cd Site-Craft
```

### 2. Build and Run with Docker Compose

```bash
cd backend
docker-compose up -d
```

This will start all services:
- **Frontend** (React + Nginx) on `http://localhost:3000`
- **Backend API** (.NET) on `http://localhost:5000`
- **MySQL Database** on `localhost:3306`
- **Redis Cache** on `localhost:6379`

### 3. Check Services Status

```bash
docker-compose ps
```

Expected output:
```
NAME                    STATUS              PORTS
sitecraft_backend       running             0.0.0.0:5000->8080/tcp
sitecraft_frontend      running             0.0.0.0:3000->80/tcp
sitecraft_mysql         running             0.0.0.0:3306->3306/tcp
sitecraft_redis         running             0.0.0.0:6379->6379/tcp
```

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Database Setup

The database is automatically initialized when you first run docker-compose. If you need to run migrations:

```bash
# Enter the backend container
docker-compose exec backend bash

# Run migrations (if needed)
dotnet ef database update
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

## Individual Service Commands

### Build Individual Services

```bash
# Build backend only
docker-compose build backend

# Build frontend only
docker-compose build frontend
```

### Restart Specific Service

```bash
docker-compose restart backend
docker-compose restart frontend
```

## Troubleshooting

### Port Already in Use

If you get port conflict errors:

```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :3306

# Kill the process or change port in docker-compose.yml
```

### Container Won't Start

```bash
# View detailed logs
docker-compose logs backend

# Remove containers and rebuild
docker-compose down
docker-compose up -d --build
```

### Database Connection Issues

```bash
# Check MySQL is healthy
docker-compose ps

# Wait for health check to pass
docker-compose logs mysql

# Test connection
docker-compose exec mysql mysql -u sitecraft_user -psitecraft_pass sitecraft_db
```

### Clear Everything and Start Fresh

```bash
# WARNING: This deletes all data
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## Environment Variables

You can override default settings by creating a `.env` file in the `backend` directory:

```env
# Database
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=sitecraft_db
MYSQL_USER=sitecraft_user
MYSQL_PASSWORD=your_password

# Backend
ASPNETCORE_ENVIRONMENT=Production
```

## Production Considerations

For production deployment:

1. **Change default passwords** in docker-compose.yml
2. **Use secrets** instead of environment variables
3. **Enable HTTPS** with proper SSL certificates
4. **Configure backup** for MySQL volumes
5. **Set resource limits** in docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Health Checks

All services have health checks configured:

```bash
# Check health status
docker-compose ps

# Services should show "(healthy)" in status
```

## Accessing Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/swagger (if enabled)
- **MySQL**: Connect using your favorite MySQL client to `localhost:3306`
  - User: `sitecraft_user`
  - Password: `sitecraft_pass`
  - Database: `sitecraft_db`

## Development with Docker

To develop while using Docker services:

### Option 1: Run only infrastructure
```bash
# Start only MySQL and Redis
docker-compose up -d mysql redis

# Run backend locally
cd ../backend/src/SiteCraft.API
dotnet run

# Run frontend locally
cd ../../sitecraft-client
npm run dev
```

### Option 2: Hot reload in containers
```bash
# Use volume mounts for live updates (modify docker-compose.yml)
volumes:
  - ./src:/app/src
```

## Docker Commands Reference

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs
docker logs <container_id>

# Execute command in container
docker exec -it <container_id> bash

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# View disk usage
docker system df
```

## Need Help?

- Check logs: `docker-compose logs -f`
- Verify services: `docker-compose ps`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up -d --build`

---

🎉 Happy coding with Docker!
