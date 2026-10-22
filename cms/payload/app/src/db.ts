import { sqliteAdapter } from '@payloadcms/db-sqlite'

// SQLite: the whole database is one file (cms.db). Back it up by copying the file.
// Switch to PostgreSQL later: create a project with --db=postgres and compare src/db.ts.
export const db = sqliteAdapter({
  client: {
    url: process.env.DATABASE_URL || 'file:./cms.db',
  },
})
