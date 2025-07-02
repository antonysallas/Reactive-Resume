# Bug Report

## Summary

MongoDB Connection failed

## Category

DB

## Observation Time

2025-05-20 13:47

## Description

MongoDB connection still fails.

## Steps to Reproduce

1. Change to Project Location

```shell
cd /Users/asallasd/workarea/projects/personal/sonic-script
```

2. Activate the conda environment

```shell
conda activate sonic
```

3. Run the entry script

```shell
# if needed
pip install -e .

# Run sonicscript
sonicscript
```

4. Monitor the logs here.

```shell
/Users/asallasd/workarea/logs/sonic/app.log
```

5. You can grep for the logs for this timestamp:

```
2025-05-20 13:47
```

## Expected Behavior

1. The application is expected to connect to MongoDB container running in `podman`
2. You can find the details here:

```text
# Database configuration
MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/"
MONGODB_DATABASE_NAME = "sonicscript"
```

3. The podman mongo container name is `sonic-mongo`

## Actual Behavior

1. The application throws error saying connection failed.

## Error Messages/Logs

```shell
2025-05-20 13:46:56 - ERROR - sonicscript - Exception in _init_collections: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
Traceback (most recent call last):
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/utils/logger.py", line 324, in wrapper
    return func(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/db/db_singleton.py", line 131, in _init_collections
    if not self._db:
  File "/Users/asallasd/opt/anaconda3/envs/sonic/lib/python3.11/site-packages/pymongo/synchronous/database.py", line 342, in __bool__
    raise NotImplementedError(
NotImplementedError: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
2025-05-20 13:46:56 - INFO - sonicscript - Primary connection failed, trying alternative MongoDB connections...
2025-05-20 13:46:56 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://sonic-mongo:27019/
2025-05-20 13:46:59 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://sonic-mongo:27017/
2025-05-20 13:47:02 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://sonic-mongo:27018/
2025-05-20 13:47:05 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://localhost:27017/
2025-05-20 13:47:08 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://localhost:27018/
2025-05-20 13:47:08 - ERROR - sonicscript - Exception in _init_collections: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
Traceback (most recent call last):
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/utils/logger.py", line 324, in wrapper
    return func(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/db/db_singleton.py", line 131, in _init_collections
    if not self._db:
  File "/Users/asallasd/opt/anaconda3/envs/sonic/lib/python3.11/site-packages/pymongo/synchronous/database.py", line 342, in __bool__
    raise NotImplementedError(
NotImplementedError: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
2025-05-20 13:47:08 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://127.0.0.1:27019/
2025-05-20 13:47:08 - ERROR - sonicscript - Exception in _init_collections: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
Traceback (most recent call last):
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/utils/logger.py", line 324, in wrapper
    return func(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/db/db_singleton.py", line 131, in _init_collections
    if not self._db:
  File "/Users/asallasd/opt/anaconda3/envs/sonic/lib/python3.11/site-packages/pymongo/synchronous/database.py", line 342, in __bool__
    raise NotImplementedError(
NotImplementedError: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
2025-05-20 13:47:08 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://127.0.0.1:27017/
2025-05-20 13:47:11 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://127.0.0.1:27018/
2025-05-20 13:47:11 - ERROR - sonicscript - Exception in _init_collections: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
Traceback (most recent call last):
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/utils/logger.py", line 324, in wrapper
    return func(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^
  File "/Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/db/db_singleton.py", line 131, in _init_collections
    if not self._db:
  File "/Users/asallasd/opt/anaconda3/envs/sonic/lib/python3.11/site-packages/pymongo/synchronous/database.py", line 342, in __bool__
    raise NotImplementedError(
NotImplementedError: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
2025-05-20 13:47:11 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://host.docker.internal:27019/
2025-05-20 13:47:14 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://host.podman.internal:27019/
2025-05-20 13:47:17 - INFO - sonicscript - Attempting to connect to MongoDB at mongodb://sonic-mongo:27017/
2025-05-20 13:47:20 - WARNING - sonicscript - MongoDB not available after trying all connection options. The application will continue without database storage. For MongoDB in Podman container, ensure it's running with: 'podman ps | grep mongo' and note the port mapping (e.g., 0.0.0.0:27019->27017/tcp). Then set MONGODB_CONNECTION_STRING=mongodb://localhost:27019/ in your .env.local file.
```

## Examples

```text
Not Applicable
```

## Sample Files

- Not Applicable

## Sample Output

```text
Not Applicable
```

## Environment

- OS Version: macOS 15.4.1 (24E263)
- Kernel Version: Darwin 24.4.0
- Model Name: MacBook Pro
- Chip: Apple M1 Pro
- Total Number of Cores: 10 (8 performance and 2 efficiency)
- Memory: 32 GB
- System Firmware Version: 11881.101.1
- OS Loader Version: 11881.101.1
- Python Environment: /Users/asallasd/opt/anaconda3/envs/sonic
- Python Version: Python 3.11.11
- Dependencies: Not Applicable

## Suggested Fix (optional)

1. Do not overkill with several options. You can check if this works. I have successfully done this in another project.

```python
class MongoDBConnection:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, uri=None):
        if not self._initialized:
            try:
                # Use the existing 'uri' if provided, otherwise build a new one
                if uri is None:
                    MONGODB_USER = urllib.parse.quote_plus(os.getenv("MONGODB_USER"))
                    MONGODB_PASSWORD = urllib.parse.quote_plus(os.getenv("MONGODB_PASSWORD"))
                    MONGO_HOST = os.getenv("MONGO_HOST")
                    MONGO_PORT = os.getenv("MONGO_PORT")
                    MONGO_DB = os.getenv("MONGO_DB")
                    uri = f"mongodb://{MONGODB_USER}:{MONGODB_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}"

                # Connect to the MongoDB instance
                self._client = MongoClient(uri, serverSelectionTimeoutMS=5000)  # 5 seconds timeout
                self._client.admin.command("ping")  # Check if connected to MongoDB server
                self._db = self._client["dadboard"]  # Set the database to 'dadboard'
                self._initialized = True
                logger.info("Connected to MongoDB (dadboard)")
            except ServerSelectionTimeoutError:
                logger.error("MongoDB server selection timeout. Unable to connect to MongoDB.")
                self._client = None
                self._db = None
            except ConnectionFailure as e:
                logger.error(f"MongoDB connection failed: {e}")
                self._client = None
                self._db = None
            except Exception as e:
                logger.error(f"Unexpected error while connecting to MongoDB: {e}")
                self._client = None
                self._db = None

    def close(self):
        self.client.close()

    @property
    def client(self):
        return self._client

    @property
    def db(self):
        return self._db
```

2. In the .env.local file:

```text
# Mongo Configuration
MONGODB_USER="sonic_user"
MONGODB_PASSWORD="xxx"
MONGO_HOST="localhost"
MONGO_PORT="27019"
MONGO_DB="sonic"
```

## Related Files

- /Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/transcribe/transcribe_audio.py
- /Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/db/db_singleton.py
- /Users/asallasd/workarea/projects/personal/sonic-script/src/sonicscript/utils/constants.py
- /Users/asallasd/workarea/projects/personal/sonic-script/.env.local

## Priority

CRITICAL

## Additional Context

```text
Not Applicable
```
