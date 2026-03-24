import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// 获取内容
router.get('/', async (req, res) => {
  try {
    const contents = await prisma.siteContent.findMany()
    const result: any = {}
    contents.forEach(c => { result[c.key] = c.value })
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

// 更新内容
router.put('/:key', async (req, res) => {
  try {
    const content = await prisma.siteContent.upsert({
      where: { key: req.params.key },
      create: { key: req.params.key, value: req.body.value },
      update: { value: req.body.value }
    })
    res.json(content)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' })
  }
})

export default router
