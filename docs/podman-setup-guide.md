# Podman Setup Guide for Reactive Resume

## Overview

This guide covers the specific setup and configuration needed to run Reactive Resume with Podman instead of Docker. Podman is a daemonless container engine that provides a Docker-compatible CLI while offering enhanced security and rootless operation.

## Prerequisites

### System Requirements
- Podman 4.0 or later
- podman-compose (for Docker Compose compatibility)
- macOS, Linux, or Windows with WSL2

### Installation

**macOS (Homebrew):**
```bash
brew install podman podman-compose
```

**Linux (most distributions):**
```bash
# Fedora/RHEL/CentOS
sudo dnf install podman podman-compose

# Ubuntu/Debian
sudo apt install podman podman-compose
```

## Project Configuration

### 1. Container Build Setup

The project uses a custom `Containerfile` (Podman's equivalent to `Dockerfile`) for building the application image.

**Key Configuration in `compose.yml`:**
```yaml
app:
  build:
    context: .
    dockerfile: Containerfile  # Podman-specific naming
  restart: unless-stopped
  ports:
    - "3000:3000"
```

### 2. Volume Management

Create persistent volumes for data storage:

```bash
# Create named volumes
podman volume create rx_postgres_data
podman volume create rx_minio_data
podman volume create rx_redis_data
```

**Volume Configuration in `compose.yml`:**
```yaml
volumes:
  rx_minio_data:
    external: true
  rx_postgres_data:
    external: true
  rx_redis_data:
    external: true
```

### 3. Network Configuration

Podman automatically creates a network for compose services. The key networking consideration is `host.docker.internal` resolution for inter-container communication.

## Build Process

### 1. Initial Build

```bash
# Navigate to project directory
cd /path/to/Reactive-Resume

# Build and start all services
podman compose -f compose.yml up --build
```

### 2. Development Workflow

```bash
# Stop services
podman compose down

# Rebuild after code changes
podman compose up --build

# View logs
podman compose logs -f app

# Check specific service
podman logs reactive-resume-app-1
```

## Container Management

### Service Operations

```bash
# Start services in background
podman compose up -d

# Stop services
podman compose down

# Restart specific service
podman compose restart app

# Scale services (if supported)
podman compose up --scale chrome=2
```

### Volume Operations

```bash
# List volumes
podman volume ls

# Inspect volume
podman volume inspect rx_postgres_data

# Remove volumes (⚠️ Data loss!)
podman volume rm rx_postgres_data rx_minio_data rx_redis_data
```

### Image Management

```bash
# List images
podman images

# Remove unused images
podman image prune

# Remove specific image
podman rmi reactive-resume-app
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Issue:** Python/native dependency compilation errors
```
gyp ERR! find Python
```

**Solution:** Ensure Containerfile includes build dependencies:
```dockerfile
RUN apt update && apt install -y dumb-init python3 make g++ --no-install-recommends
```

#### 2. Permission Issues

**Issue:** Permission denied accessing volumes

**Solution:** Check SELinux context on Linux:
```bash
# Fix SELinux labels
sudo restorecon -R /var/lib/containers/storage/volumes/
```

#### 3. Network Connectivity

**Issue:** Services can't communicate with each other

**Solution:** Verify container network:
```bash
# Check network
podman network ls

# Inspect network details
podman network inspect reactive-resume_default
```

#### 4. Storage Issues

**Issue:** Volume mounting failures

**Solution:** Recreate volumes with proper permissions:
```bash
podman volume rm rx_postgres_data
podman volume create rx_postgres_data
```

### Performance Optimization

#### 1. Build Cache

Enable build cache for faster rebuilds:
```bash
# Use buildah for better caching
podman build --cache-from localhost/reactive-resume:latest .
```

#### 2. Resource Limits

Configure resource limits in compose.yml:
```yaml
app:
  build:
    context: .
    dockerfile: Containerfile
  deploy:
    resources:
      limits:
        memory: 2G
        cpus: '1.0'
```

#### 3. Storage Driver

For better performance on some systems:
```bash
# Check current driver
podman info | grep -A5 graphDriverName

# Configure storage.conf if needed
echo 'driver = "overlay"' >> ~/.config/containers/storage.conf
```

## Security Considerations

### Rootless Operation

Podman runs rootless by default, providing better security:

```bash
# Check if running rootless
podman info | grep rootless

# Start rootless service
systemctl --user enable --now podman.socket
```

### SELinux (Linux)

On SELinux-enabled systems:
```bash
# Check SELinux status
sestatus

# Allow container access if needed
setsebool -P container_manage_cgroup true
```

### Network Security

Configure firewall for exposed ports:
```bash
# Allow application port
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

## Backup and Recovery

### Volume Backup

```bash
# Backup PostgreSQL data
podman run --rm -v rx_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data

# Backup MinIO data  
podman run --rm -v rx_minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio-backup.tar.gz /data
```

### Volume Restore

```bash
# Restore PostgreSQL data
podman run --rm -v rx_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /

# Restore MinIO data
podman run --rm -v rx_minio_data:/data -v $(pwd):/backup alpine tar xzf /backup/minio-backup.tar.gz -C /
```

### Automated Backup

Create a backup script:
```bash
#!/bin/bash
# backup-reactive-resume.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/$DATE"
mkdir -p "$BACKUP_DIR"

# Stop services
podman compose down

# Backup volumes
podman run --rm -v rx_postgres_data:/data -v "$(pwd)/$BACKUP_DIR":/backup alpine tar czf /backup/postgres.tar.gz /data
podman run --rm -v rx_minio_data:/data -v "$(pwd)/$BACKUP_DIR":/backup alpine tar czf /backup/minio.tar.gz /data
podman run --rm -v rx_redis_data:/data -v "$(pwd)/$BACKUP_DIR":/backup alpine tar czf /backup/redis.tar.gz /data

# Restart services
podman compose up -d

echo "Backup completed: $BACKUP_DIR"
```

## Migration from Docker

### Compose Compatibility

Podman-compose provides Docker Compose compatibility:
```bash
# Most Docker Compose commands work
podman-compose up
podman-compose down
podman-compose logs
```

### Image Migration

```bash
# Export from Docker
docker save reactive-resume:latest | gzip > reactive-resume.tar.gz

# Import to Podman
gunzip < reactive-resume.tar.gz | podman load
```

### Volume Migration

```bash
# Export Docker volume
docker run --rm -v docker_volume:/data -v $(pwd):/backup alpine tar czf /backup/data.tar.gz /data

# Import to Podman volume
podman run --rm -v podman_volume:/data -v $(pwd):/backup alpine tar xzf /backup/data.tar.gz -C /
```

## Best Practices

### 1. Resource Management

- Monitor resource usage: `podman stats`
- Set appropriate limits in compose.yml
- Clean up unused resources regularly

### 2. Security

- Keep Podman updated
- Use rootless mode when possible
- Regularly scan images for vulnerabilities

### 3. Development

- Use volume mounts for active development
- Enable BuildKit for better build performance
- Leverage multi-stage builds in Containerfile

### 4. Production

- Use specific image tags, not `:latest`
- Implement health checks
- Set up monitoring and logging

## Monitoring and Logs

### Service Health

```bash
# Check all services
podman compose ps

# Detailed service info
podman inspect reactive-resume-app-1

# Service logs
podman compose logs -f app
```

### Resource Usage

```bash
# Real-time stats
podman stats

# System usage
podman system df

# Detailed system info
podman info
```

This guide provides a comprehensive foundation for running Reactive Resume with Podman, ensuring reliable operation and easy maintenance.