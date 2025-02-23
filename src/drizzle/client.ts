import { drizzle as drizzleORM } from 'drizzle-orm/postgres-js'
import postgresClient from 'postgres'
import { env } from '../env'
import { subscriptions } from './schema/subscriptions'

export const postgres = postgresClient(env.POSTGRES_URL)
export const db = drizzleORM(postgres, {
  schema: {
    subscriptions,
  },
})
