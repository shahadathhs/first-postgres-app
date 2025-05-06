import express from 'express'
import postgres from 'postgres'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env' })

// Initialize database connection
const sql = postgres(process.env.DATABASE_URL as string, {
  ssl: 'require',
  idle_timeout: 15000,
})

const app = express()
const PORT = Number(process.env.PORT) || 3000

// Middleware to parse JSON
app.use(express.json())

// Root Get route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Sample route to fetch all users
app.get('/users', async (req, res) => {
  try {
    console.log('Connecting to Postgres...')
    const users = await sql`SELECT * FROM users`
    console.log('Fetched users:', users)
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
    console.log('Connecting to Postgres...')
    const result = await sql`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      RETURNING *
    `
    console.log('Inserted user:', result[0], result)
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
    console.log('✅ Users table is ready')
  } catch (err) {
    console.error('❌ Error creating users table:', err)
  }
}

app.listen(PORT, '0.0.0.0', async () => {
  try {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log('Warming up database connection...')

    // Run a lightweight query to ensure the DB is reachable
    await sql`SELECT 1`
    await createUsersTableIfNotExists()

    console.log('Database connected successfully.')
  } catch (err) {
    console.error('Failed to connect to database at startup:', err)
    process.exit(1)
  }
})
