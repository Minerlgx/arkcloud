import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products'
import usersRouter from './routes/users'
import ordersRouter from './routes/orders'
import contentRouter from './routes/content'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/content', contentRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API: http://localhost:${PORT}/api`)
})
