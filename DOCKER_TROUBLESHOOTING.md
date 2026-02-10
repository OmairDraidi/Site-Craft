# Quick Start Guide - Docker Issues Troubleshooting

## Issue: Docker I/O Error

If you encounter `input/output error` when building Docker images, try these solutions:

### Solution 1: Restart Docker Desktop ⭐ (Recommended)

```powershell
# Close Docker Desktop from system tray
# Wait 10 seconds
# Open Docker Desktop again

# Then run:
cd 'C:\Users\hp\Documents\Project with iman\backend'
docker-compose -f docker-compose.infra.yml up -d
```

### Solution 2: Clean Docker System

```powershell
# Stop all containers
docker-compose down

# Clean system
docker system prune -a -f
docker volume prune -f

# Restart Docker Desktop

# Try again
docker-compose -f docker-compose.infra.yml up -d
```

### Solution 3: Run Individual Services

```powershell
# MySQL only
docker run -d --name sitecraft_mysql \
  -e MYSQL_ROOT_PASSWORD=root_pass \
  -e MYSQL_DATABASE=sitecraft_db \
  -e MYSQL_USER=sitecraft_user \
  -e MYSQL_PASSWORD=sitecraft_pass \
  -p 3306:3306 \
  mysql:8.0

# Redis only
docker run -d --name sitecraft_redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Solution 4: Run Without Docker

If Docker continues to have issues, run the project locally:

#### Backend (.NET):
```powershell
cd backend/src/SiteCraft.API
dotnet run
```

#### Frontend (React):
```powershell
cd sitecraft-client
npm install
npm run dev
```

#### Database:
- Install MySQL Workbench or XAMPP
- Create database: `sitecraft_db`
- User: `sitecraft_user`
- Password: `sitecraft_pass`

#### Cache:
- Install Redis for Windows
- Default port: 6379

## Check Docker Status

```powershell
# Check Docker is running
docker --version
docker ps

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

## Verify Services After Start

```powershell
# Check MySQL
docker exec -it sitecraft_mysql mysql -u sitecraft_user -psitecraft_pass sitecraft_db

# Check Redis
docker exec -it sitecraft_redis redis-cli ping
```

## Port Conflicts

If ports are already in use:

```powershell
# Check what's using the port
netstat -ano | findstr :3306
netstat -ano | findstr :6379
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process if needed (replace PID)
taskkill /F /PID <PID>
```

## Resources

- MySQL Port: 3306
- Redis Port: 6379
- Backend Port: 5000
- Frontend Port: 3000

## Contact

If issues persist, check:
- Docker Desktop settings: Resources → Memory (allocate at least 4GB)
- Disk space: at least 10GB free
- WSL2 is updated (for Windows)
