# Quick Start Guide - Database Setup

## For First-Time Setup

```bash
cd AYNIA

cp .env.example .env

docker compose up -d

cd api
bun run db:setup
```

## Check Database Status

```bash
cd api
bun run db:check
```

## Run Tests

```bash
cd api
bun test
```

## Common Commands

### Database Management

```bash
bun run db:check        # Check database status and pending migrations
bun run db:setup        # Initial setup (applies migrations)
bun run db:generate     # Generate new migration from schema changes
bun run db:migrate:all  # Apply pending migrations to all databases
```

### Development

```bash
bun run dev             
bun test                
bun test:watch          
```

## Creating Schema Changes

1. Modify `api/src/db/schema.ts`
2. Generate migration: `bun run db:generate --name your_migration_name`
3. Review generated SQL in `api/drizzle/` folder
4. Apply migration: `bun run db:migrate:all`
5. Verify: `bun run db:check`

## Troubleshooting

### Database not responding
```bash
docker compose down
docker compose up -d
sleep 5
cd api && bun run db:check
```

### Reset databases
```bash
docker compose down -v
docker compose up -d
cd api && bun run db:setup
```

### Schema out of sync
```bash
cd api
bun run db:generate --name fix_schema
bun run db:migrate:all
bun run db:check
```
