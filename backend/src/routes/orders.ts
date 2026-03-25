import { Router } from 'express'
import { prisma } from '../lib/db'
import crypto from 'crypto'

const router = Router()

// 创建订单
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity = 1, billingCycle } = req.body
    
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    
    // 计算价格
    let basePrice = billingCycle === 'MONTHLY' ? product.priceMonthly 
      : billingCycle === 'QUARTERLY' ? product.priceMonthly * 3
      : billingCycle === 'YEARLY' ? product.priceMonthly * 12
      : product.priceHourly
    
    let discount = 1
    if (billingCycle === 'MONTHLY') discount = 0.86
    else if (billingCycle === 'QUARTERLY') discount = 0.80
    else if (billingCycle === 'YEARLY') discount = 0.75
    
    const totalPrice = basePrice * quantity * discount
    
    const order = await prisma.order.create({
      data: {
        userId,
        billingCycle,
        totalAmount: totalPrice,
        status: 'PENDING',
        items: {
          create: { productId, price: basePrice * discount, quantity }
        },
        instance: {
          create: {
            userId,
            productId,
            productName: product.name,
            status: 'PENDING',
            ipAddress: `203.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
            port: 22,
            password: crypto.randomBytes(8).toString('hex'),
          }
        }
      },
      include: { instance: true, items: { include: { product: true } } }
    })
    
    res.json({ order, instance: order.instance })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// 获取用户订单
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      include: { items: { include: { product: true } }, instance: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// 支付订单
router.post('/:id/pay', async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'PAID' },
      include: { instance: true }
    })
    
    // 激活实例
    if (order.instance) {
      await prisma.instance.update({
        where: { id: order.instance.id },
        data: { 
          status: 'RUNNING',
          startedAt: new Date()
        }
      })
    }
    
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ error: 'Failed to pay order' })
  }
})

export default router
