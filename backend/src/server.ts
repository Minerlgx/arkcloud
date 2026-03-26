import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products'
import usersRouter from './routes/users'
import ordersRouter from './routes/orders'
import contentRouter from './routes/content'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
// 由于后台上传使用 base64 图片写入 JSON，可能较大，需要放宽限制
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

// Debug route
app.post('/api/test', (req, res) => {
  res.json({ test: 'ok' })
})

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
