import express, { Application } from 'express'
import environment from 'config/env.config'
import sql from 'config/sql.config'

const app: Application = express()

// Sample route to fetch all users
app.get('/users', async (req, res) => {
  try {
    console.info('Connecting to Postgres...')
    const users = await sql`SELECT * FROM users`
    console.info('Fetched users:', users)
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Sample route to create a user
app.post('/users', async (req, res) => {
  const { name, email } = req.body
  try {
    console.info('Connecting to Postgres...')
    const result = await sql`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      RETURNING *
    `
    console.info('Inserted user:', result[0], result)
    res.status(201).json(result[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database insert error' })
  }
})

async function createUsersTableIfNotExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.info('✅ Users table is ready')
  } catch (err) {
    console.error('❌ Error creating users table:', err)
  }
}

app.listen(environment.port as number, '0.0.0.0', async () => {
  try {
    console.info(`Server running on http://localhost:${environment.port}`)
    console.info('Warming up database connection...')

    // Run a lightweight query to ensure the DB is reachable
    await sql`SELECT 1`
    await createUsersTableIfNotExists()

    console.info('Database connected successfully.')
  } catch (err) {
    console.error('Failed to connect to database at startup:', err)
    process.exit(1)
  }
})
