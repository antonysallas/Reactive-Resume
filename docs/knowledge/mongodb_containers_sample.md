# MongoDB Connection in Container Environments

This document explains how to effectively connect to MongoDB when it's running in a container environment, particularly Podman, and provides solutions to common issues.

## Problem Overview

When MongoDB is running in a container like Podman, the application may fail to connect because:

1. **Port mapping differences**: MongoDB may be exposed on non-standard ports (e.g., 27019 instead of 27017)
2. **Hostname resolution**: Container names aren't directly resolvable from the host
3. **PyMongo truth testing issues**: Boolean checks on PyMongo database objects cause errors

## MongoDB Connection Strategy

SonicScript implements a robust connection strategy to handle these challenges:

### Environment Variable Configuration

The recommended approach is to use environment variables in `.env.local`:

```bash
# MongoDB Configuration - For Podman
MONGO_HOST=localhost
MONGO_PORT=27019  # Mapped port from 'podman ps'
MONGO_DB=sonicscript

# Optional authentication
# MONGODB_USER=username
# MONGODB_PASSWORD=password
```

### Connection Logic

The MongoDB connection singleton follows these steps:

1. Use environment variables if provided
2. Fall back to default connection string if environment variables aren't set
3. Properly handle connection failures with useful error messages
4. Use explicit `None` comparisons for database objects

### Implementation Example

```python
def __init__(self, uri=None):
    if not self._initialized:
        try:
            # Use environment variables if provided
            if uri is None:
                MONGODB_USER = os.getenv("MONGODB_USER")
                MONGODB_PASSWORD = os.getenv("MONGODB_PASSWORD")
                MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
                MONGO_PORT = os.getenv("MONGO_PORT", "27019")  # Default to Podman port
                MONGO_DB = os.getenv("MONGO_DB", "sonicscript")

                # Build connection string based on auth requirements
                if MONGODB_USER and MONGODB_PASSWORD:
                    safe_user = urllib.parse.quote_plus(MONGODB_USER)
                    safe_pass = urllib.parse.quote_plus(MONGODB_PASSWORD)
                    uri = f"mongodb://{safe_user}:{safe_pass}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}"
                else:
                    uri = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}"

            # Fall back to default if still no URI
            if uri is None:
                uri = "mongodb://localhost:27019/"

            # Connect with suitable timeout
            self._client = MongoClient(uri, serverSelectionTimeoutMS=5000)
            self._client.admin.command("ping")
            self._db = self._client[MONGO_DB]

            # Rest of initialization...

        except Exception as e:
            # Handle connection failures
            self._client = None
            self._db = None
            logger.warning("MongoDB not available. Continuing without database storage.")
```

## Common PyMongo Issues

### Truth Testing Problem

PyMongo database objects don't support boolean testing. Always use explicit `None` comparison:

```python
# INCORRECT - will raise NotImplementedError
if not self._db:
    # handle missing database

# CORRECT - use explicit None comparison
if self._db is None:
    # handle missing database
```

### Connection Validation

Always validate connections with a lightweight command like `ping`:

```python
# Test connection
self._client.admin.command("ping")
```

## Determining Container Port Mappings

To see how your Podman/Docker containers are exposing MongoDB:

```bash
# For Podman
podman ps | grep mongo
# Example output: 0.0.0.0:27019->27017/tcp

# For Docker
docker ps | grep mongo
```

Use the host-side port (27019 in this example) in your connection string.

## Testing Connection

You can test MongoDB connectivity from the command line:

```bash
# Using mongosh
mongosh mongodb://localhost:27019/

# Using the Python shell
python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27019/'); print(client.admin.command('ping'))"
```

## Recommended Practices

1. **Always use environment variables** for connection details
2. **Default to common container port** (27019) for Podman environments
3. **Handle database unavailability gracefully** throughout your code
4. **Use explicit None comparisons** with PyMongo objects
5. **Provide clear error messages** to help diagnose connection issues

## Related Files

- `/src/sonicscript/db/db_singleton.py` - MongoDB connection implementation
- `/src/sonicscript/utils/constants.py` - Default connection strings
- `/.env.local.example` - Example environment configuration
- `/CLAUDE.md` - Documentation for configuration
