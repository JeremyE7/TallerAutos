// src/db/index.ts
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import * as schema from './schema'
import * as relations from './relations'

config() // Carga las variables del archivo .env

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
})

export const db = drizzle(client, {
  schema: { ...schema, ...relations }
})
