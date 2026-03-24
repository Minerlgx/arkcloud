import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// 获取所有产品
router.get('/', async (req, res) => {
  try {
    const { category, datacenter, search, sort } = req.query
    const where: any = {}
    
    if (category && category !== 'All') where.category = category
    if (datacenter && datacenter !== 'All') where.datacenter = { contains: datacenter }
    if (search) where.OR = [
      { name: { contains: search as string } },
      { description: { contains: search as string } }
    ]
    where.status = 'ACTIVE'
    
    const orderBy: any = {}
    if (sort === 'price-asc') orderBy.priceHourly = 'asc'
    else if (sort === 'price-desc') orderBy.priceHourly = 'desc'
    else orderBy.createdAt = 'desc'
    
    const products = await prisma.product.findMany({ where, orderBy })
    res.json({ products })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// 获取单个产品
router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug }
    })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json({ product })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 创建产品 (管理员)
router.post('/', async (req, res) => {
  try {
    const { name, slug, category, description, gpu, vram, cpu, ram, storage, network, datacenter, priceHourly, priceMonthly, stock, featured } = req.body
    
    const product = await prisma.product.create({
      data: {
        name, slug, category, description, gpu, vram, cpu, ram, storage, network, datacenter,
        priceHourly: parseFloat(priceHourly),
        priceMonthly: parseFloat(priceMonthly),
        stock: parseInt(stock),
        featured: featured || false
      }
    })
    res.json({ product })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// 更新产品
router.put('/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ product })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// 删除产品
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export default router
