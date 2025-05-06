import postgres from 'postgres'
import environment from './env.config'

const sql = postgres(environment.databaseUrl as string, {
  ssl: 'require',
  idle_timeout: 15000,
})

export default sql
