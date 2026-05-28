# DEPLOYMENT.md - VintageDagoShop Production Deployment Guide

## Overview
This document outlines the process for deploying VintageDagoShop to production environments.

## Architecture
- Frontend: Vite + React 18 (static build via NGINX)
- Backend: Node.js + Express (stateless, scalable)
- Database: MySQL 5.7 (persistent volume)
- Proxy: NGINX (SSL termination)

## Environment Variables

### Backend .env
```bash
DB_HOST=mysql
DB_PORT=3306
DB_USER=vintagedago
DB_PASSWORD=secure_password_here  # Change!
DB_NAME=vintagedago_db
JWT_SECRET=your-secret-key-32-chars-min  # Change!
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Frontend .env
```bash
VITE_API_URL=https://api.yourdomain.com/api
```

## Pre-Deployment Checklist
- [ ] All environment variables configured
- [ ] Default credentials changed
- [ ] SSL/TLS certificates obtained
- [ ] Database migrations tested
- [ ] Backup strategy configured
- [ ] Monitoring setup complete
- [ ] Health checks verified

## Deployment with Docker Compose

```bash
# 1. Setup environment
cp .env.docker.example .env.docker
# Edit with production values

# 2. Build and start
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 3. Run migrations
docker-compose exec backend npm run db:migrate

# 4. Verify
curl https://yourdomain.com/api/health
```

## Database Backups

```bash
# Manual backup
mysqldump -u vintagedago -p vintagedago_db > backup.sql

# Restore
mysql -u vintagedago -p vintagedago_db < backup.sql
```

## Monitoring
- Health endpoint: GET /api/health
- Log aggregation: ELK Stack / CloudWatch
- Performance: Monitor response times, error rates
- Infrastructure: CPU, memory, disk usage

## Security
- SSL/TLS required (Let's Encrypt)
- Rotate secrets every 90 days
- Enable rate limiting on login
- JWT expiration: 24 hours
- Admin users: strong passwords

## Scaling
Backend is stateless - scale horizontally:

```yaml
backend:
  deploy:
    replicas: 3
```

## Rollback

### Database
```bash
mysql -u vintagedago -p vintagedago_db < backup.sql
```

### Application
```bash
docker-compose -f docker-compose.prod.yml pull backend:v0.9.9
docker-compose up -d
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| DB connection fails | Check DB_HOST, USER, PASSWORD in .env |
| Admin routes 401 | Verify JWT_SECRET configured |
| Frontend can't reach API | Check VITE_API_URL and CORS_ORIGIN |

## References
- API docs: docs/API_DOCUMENTATION.md
- Architecture: docs/ARCHITECTURE.md
- Project status: docs/PROJECT_STATUS.md
