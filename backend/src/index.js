const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const pool = new Pool({
  connectionString: 'postgresql://kycin@127.0.0.1:5432/arkcloud'
})

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Helper: convert snake_case to camelCase
function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel)
  if (obj === null || typeof obj !== 'object') return obj
  const result = {}
  for (const key of Object.keys(obj)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    result[camel] = toCamel(obj[key])
  }
  return result
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Products
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query
    let query = 'SELECT * FROM products WHERE status = $1'
    const params = ['ACTIVE']
    if (category) { query += ' AND category = $2'; params.push(category) }
    query += ' ORDER BY featured DESC, "createdAt" DESC'
    const result = await pool.query(query, params)
    res.json({ products: toCamel(result.rows) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' })
    res.json({ product: toCamel(result.rows[0]) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/products', async (req, res) => {
  try {
    const { name, slug, category, description, gpu, vram, cpu, ram, storage, network, datacenter, priceHourly, priceMonthly, stock, featured } = req.body
    const result = await pool.query(
      `INSERT INTO products (name, slug, category, description, gpu, vram, cpu, ram, storage, network, datacenter, pricehourly, pricemonthly, stock, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [name, slug || name.toLowerCase().replace(/\s+/g, '-'), category, description, gpu, vram, cpu, ram, storage, network, datacenter, priceHourly, priceMonthly, stock || 10, featured || false]
    )
    res.json({ product: toCamel(result.rows[0]) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, slug, category, description, gpu, vram, cpu, ram, storage, network, datacenter, priceHourly, priceMonthly, stock, featured } = req.body
    const result = await pool.query(
      `UPDATE products SET name=$1, slug=$2, category=$3, description=$4, gpu=$5, vram=$6, cpu=$7, ram=$8, storage=$9, network=$10, datacenter=$11, pricehourly=$12, pricemonthly=$13, stock=$14, featured=$15, "updatedAt"=NOW() WHERE id=$16 RETURNING *`,
      [name, slug, category, description, gpu, vram, cpu, ram, storage, network, datacenter, priceHourly, priceMonthly, stock, featured, req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' })
    res.json({ product: toCamel(result.rows[0]) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Image upload
app.post('/api/upload', async (req, res) => {
  try {
    const { image, productId } = req.body
    if (!image) return res.status(400).json({ error: 'No image provided' })
    if (productId) await pool.query('UPDATE products SET images = array_prepend($1, COALESCE(images, ARRAY[]::text[])), "updatedAt"=NOW() WHERE id = $2', [image, productId])
    res.json({ url: image, success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, company, role, status, "createdAt" FROM users ORDER BY "createdAt" DESC')
    res.json({ users: toCamel(result.rows) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, company } = req.body
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already registered' })
    const result = await pool.query('INSERT INTO users (name, email, password, company) VALUES ($1,$2,$3,$4) RETURNING id, name, email, company, role, status, "createdAt"', [name, email, password, company])
    res.json({ user: toCamel(result.rows[0]) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('SELECT id, name, email, company, role, status FROM users WHERE email = $1 AND password = $2', [email, password])
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ user: toCamel(result.rows[0]) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Orders
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, productId, quantity, billingCycle } = req.body
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [productId])
    if (product.rows.length === 0) return res.status(404).json({ error: 'Product not found' })
    let totalAmount = 0, unitPrice = product.rows[0].pricehourly
    if (billingCycle === 'MONTHLY') unitPrice = product.rows[0].pricemonthly * 0.86
    else if (billingCycle === 'QUARTERLY') unitPrice = product.rows[0].pricemonthly * 3 * 0.80
    else if (billingCycle === 'YEARLY') unitPrice = product.rows[0].pricemonthly * 12 * 0.75
    totalAmount = unitPrice * quantity
    const orderResult = await pool.query('INSERT INTO orders (userId, totalAmount, billingCycle, status) VALUES ($1,$2,$3,$4) RETURNING *', [userId, totalAmount, billingCycle, 'PENDING'])
    const instanceResult = await pool.query('INSERT INTO instances (userId, productId, orderId, ipAddress, port, password, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [userId, productId, orderResult.rows[0].id, '10.0.0.' + Math.floor(Math.random()*255), 22, 'GPU_' + Math.random().toString(36).slice(2,10), 'PENDING'])
    res.json({ order: toCamel(orderResult.rows[0]), instance: toCamel(instanceResult.rows[0]) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(`SELECT o.*, i.id as instance_id, i.ipaddress, i.port, i.password, i.status as instance_status, p.name as product_name, p.gpu FROM orders o LEFT JOIN instances i ON i.orderid = o.id LEFT JOIN products p ON i.productid = p.id WHERE o.userid = $1 ORDER BY o."createdAt" DESC`, [req.params.userId])
    const orders = result.rows.map(r => ({ id: r.id, status: r.status, totalAmount: r.totalamount, billingCycle: r.billingcycle, createdAt: r.createdat, instances: r.instance_id ? [{ id: r.instance_id, ipAddress: r.ipaddress, port: r.port, password: r.password, status: r.instance_status }] : [], items: r.product_name ? [{ product: { name: r.product_name, gpu: r.gpu } }] : [] }))
    res.json({ orders })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Content
app.get('/api/content', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM site_content')
    const content = {}
    result.rows.forEach(r => { content[r.key] = r.value })
    res.json(content)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/content/:key', async (req, res) => {
  try {
    await pool.query('INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', [req.params.key, req.body.value])
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

const PORT = 3001
app.listen(PORT, () => console.log(`API running on port ${PORT}`))
