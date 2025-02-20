// drizzle.config.ts
import { config } from 'dotenv'
import type { Config } from 'drizzle-kit'

config()

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN
  }
} satisfies Config
