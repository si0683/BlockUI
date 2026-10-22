import { postgresAdapter } from '@payloadcms/db-postgres'

// PostgreSQL. Locally: `docker compose up -d` in this folder (see docker-compose.yml).
// In development the schema is pushed automatically; for production use migrations:
//   npm run payload migrate:create   then   npm run payload migrate
export const db = postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || '',
  },
})
