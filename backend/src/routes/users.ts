import { Router } from 'express'
import { prisma } from '../lib/db'
import crypto from 'crypto'

const router = Router()

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, company } = req.body
    
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already registered' })
    
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, company }
    })
    
    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' })
  }
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' })
  }
})

// 获取所有用户 (管理员)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, company: true, role: true, status: true, createdAt: true }
    })
    res.json({ users })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

export default router
