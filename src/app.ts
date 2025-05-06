import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import apiInfoLogger from 'middlewares/apiInfoLogger'
import notFound from 'middlewares/notFound'
import appRoutes from 'routes/router'

// ** express app **
const app: Application = express()

// ** parse request body **
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ** cors **
app.use(cors())

// ** API Info Logger **
app.use(apiInfoLogger)

// ** Default Routes **
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to User Management Server!')
})
app.get('/api/v1', (req: Request, res: Response) => {
  res.send('This is the root API route!')
})

// ** API Routes **
app.use('/api/v1', appRoutes)

// ** API Endpoint Not Found **
app.use('*', (req: Request, res: Response) => {
  notFound(req, res)
})

// ** Error Handler **
// * TODO : Add custom error handler

export default app
