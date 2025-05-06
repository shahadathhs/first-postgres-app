import dotenv from 'dotenv'

// ** Load Environment Variables **
dotenv.config({ path: '.env' })

const environment = {
  env: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 3000,
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/postgres',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
}

export default environment
