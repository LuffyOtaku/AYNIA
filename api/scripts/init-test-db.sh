#!/bin/bash
set -e

if [ "$NODE_ENV" = "development" ]; then
  echo "Creating test database for development environment..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ${POSTGRES_DB}_test;
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB}_test TO $POSTGRES_USER;
EOSQL
  echo "Test database created successfully!"
else
  echo "Production environment - skipping test database creation"
fi
