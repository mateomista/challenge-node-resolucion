import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import getMetrics from './handlers/metrics'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(helmet()) 
app.use(express.json())
app.use(cors())

// Routes
app.get('/', getMetrics)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { app }