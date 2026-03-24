import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // 清空现有数据
  await prisma.orderItem.deleteMany()
  await prisma.instance.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.siteContent.deleteMany()
  
  // 添加产品
  const products = [
    // RTX 系列
    { name: 'RTX 4090 Single', slug: 'rtx-4090-single', category: 'Inference', description: '單卡 RTX 4090，開發測試首選', gpu: 'NVIDIA RTX 4090', vram: '24GB GDDR6X', cpu: 'AMD EPYC 7763 16C', ram: '64GB DDR5', storage: '512GB NVMe', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 0.80, priceMonthly: 480, stock: 50, featured: false },
    { name: 'RTX 4090 x4', slug: 'rtx-4090-x4', category: 'Training', description: '4卡 RTX 4090，中等訓練', gpu: '4x NVIDIA RTX 4090', vram: '96GB', cpu: 'AMD EPYC 7763 64C', ram: '256GB DDR5', storage: '2TB NVMe', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 2.80, priceMonthly: 1680, stock: 20, featured: false },
    { name: 'RTX 4090 x8', slug: 'rtx-4090-x8', category: 'Training', description: '8卡 RTX 4090，大規模訓練', gpu: '8x NVIDIA RTX 4090', vram: '192GB', cpu: 'AMD EPYC 7763 128C', ram: '512GB DDR5', storage: '4TB NVMe', network: '200Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 5.00, priceMonthly: 3000, stock: 10, featured: true },
    { name: 'RTX 4080 SUPER Single', slug: 'rtx-4080-super', category: 'Inference', description: '預算友好型，開發測試', gpu: 'RTX 4080 SUPER', vram: '16GB GDDR6X', cpu: 'AMD EPYC 7763 16C', ram: '32GB DDR5', storage: '512GB NVMe', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 0.50, priceMonthly: 300, stock: 60, featured: false },
    
    // A100 系列
    { name: 'A100 40GB', slug: 'a100-40gb', category: 'AI Training', description: '經典 AI 訓練卡', gpu: 'NVIDIA A100 40GB', vram: '40GB HBM2e', cpu: 'AMD EPYC 7763 64C', ram: '256GB DDR4', storage: '1TB NVMe', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 1.50, priceMonthly: 900, stock: 30, featured: false },
    { name: 'A100 80GB', slug: 'a100-80gb', category: 'AI Training', description: '80GB 大顯存，LLM 首選', gpu: 'NVIDIA A100 80GB', vram: '80GB HBM2e', cpu: 'AMD EPYC 7763 64C', ram: '256GB DDR4', storage: '1TB NVMe', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 2.00, priceMonthly: 1200, stock: 25, featured: true },
    { name: 'A100 80GB x4', slug: 'a100-80gb-x4', category: 'AI Training', description: '4卡 A100 集群', gpu: '4x NVIDIA A100 80GB', vram: '320GB', cpu: 'AMD EPYC 9554 128C', ram: '1TB DDR5', storage: '4TB NVMe', network: '400Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 7.00, priceMonthly: 4200, stock: 8, featured: false },
    
    // H100 系列
    { name: 'H100 SXM 80GB', slug: 'h100-80gb', category: 'AI Training', description: 'H100 入門款，性價比首選', gpu: 'NVIDIA H100 SXM 80GB', vram: '80GB HBM3', cpu: 'AMD EPYC 9755 128C', ram: '512GB DDR5', storage: '2TB NVMe Gen5', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 2.50, priceMonthly: 1500, stock: 20, featured: true },
    { name: 'H100 SXM 80GB x2', slug: 'h100-80gb-x2', category: 'AI Training', description: '雙卡 H100，企業級訓練', gpu: '2x NVIDIA H100 SXM 80GB', vram: '160GB', cpu: 'AMD EPYC 9755 128C', ram: '1TB DDR5', storage: '2TB NVMe Gen5', network: '200Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 4.50, priceMonthly: 2700, stock: 12, featured: false },
    { name: 'H100 SXM 80GB x4', slug: 'h100-80gb-x4', category: 'AI Training', description: '4卡 H100，大規模部署', gpu: '4x NVIDIA H100 SXM 80GB', vram: '320GB', cpu: 'AMD EPYC 9755 256C', ram: '2TB DDR5', storage: '4TB NVMe Gen5', network: '400Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 8.50, priceMonthly: 5100, stock: 6, featured: false },
    
    // H200 系列
    { name: 'H200 SXM 141GB', slug: 'h200-141gb', category: 'AI Training', description: '最新旗艦，大模型首選', gpu: 'NVIDIA H200 SXM', vram: '141GB HBM3e', cpu: 'AMD EPYC 9755 128C', ram: '512GB DDR5', storage: '2TB NVMe Gen5', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 3.50, priceMonthly: 2100, stock: 15, featured: true },
    { name: 'H200 SXM 141GB x2', slug: 'h200-141gb-x2', category: 'AI Training', description: '雙卡 H200，超大上下文', gpu: '2x NVIDIA H200 SXM', vram: '282GB', cpu: 'AMD EPYC 9755 128C', ram: '1TB DDR5', storage: '2TB NVMe Gen5', network: '200Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 6.50, priceMonthly: 3900, stock: 8, featured: false },
    { name: 'H200 SXM 141GB x4', slug: 'h200-141gb-x4', category: 'AI Training', description: '4卡 H200，企業旗艦', gpu: '4x NVIDIA H200 SXM', vram: '564GB', cpu: 'AMD EPYC 9755 256C', ram: '2TB DDR5', storage: '4TB NVMe Gen5', network: '400Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 12.00, priceMonthly: 7200, stock: 4, featured: false },
    
    // AMD MI 系列
    { name: 'MI300X', slug: 'mi300x', category: 'AI Training', description: 'AMD 旗艦 GPU，性價比高', gpu: 'AMD Instinct MI300X', vram: '192GB HBM3', cpu: 'AMD EPYC 9755 128C', ram: '512GB DDR5', storage: '2TB NVMe', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 4.00, priceMonthly: 2400, stock: 12, featured: false },
    { name: 'MI300X x2', slug: 'mi300x-x2', category: 'AI Training', description: '雙卡 MI300X，大模型訓練', gpu: '2x AMD Instinct MI300X', vram: '384GB', cpu: 'AMD EPYC 9755 128C', ram: '1TB DDR5', storage: '4TB NVMe', network: '200Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 7.50, priceMonthly: 4500, stock: 6, featured: false },
    
    // L40 系列
    { name: 'L40S Single', slug: 'l40s-single', category: 'Inference', description: 'L40S 單卡，推理優化', gpu: 'NVIDIA L40S', vram: '48GB GDDR6', cpu: 'AMD EPYC 7763 32C', ram: '128GB DDR5', storage: '512GB NVMe', network: '100Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 1.20, priceMonthly: 720, stock: 40, featured: false },
    { name: 'L40S x4', slug: 'l40s-x4', category: 'Inference', description: '4卡 L40S，大規模推理', gpu: '4x NVIDIA L40S', vram: '192GB', cpu: 'AMD EPYC 7763 64C', ram: '512GB DDR5', storage: '2TB NVMe', network: '200Gbps', datacenter: 'Taiwan (Taoyuan)', priceHourly: 4.00, priceMonthly: 2400, stock: 15, featured: false },
  ]
  
  await prisma.product.createMany({ data: products })
  console.log(`Created ${products.length} products`)
  
  // 添加网站内容
  await prisma.siteContent.createMany({
    data: [
      { key: 'about_title', value: '方舟雲計算科技有限公司' },
      { key: 'about_description', value: '專注於為台灣地區的 AI 開發者、研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務。' },
      { key: 'about_subtitle', value: '專業 AI 雲端運算服務提供商' },
      { key: 'contact_email', value: 'support@arkcloud.top' },
      { key: 'contact_sales', value: 'sales@arkcloud.top' },
      { key: 'contact_hours', value: '7x24 全年不休' },
      { key: 'company_address', value: '桃園市中壢區龍平里龍東路 116號(1樓)' },
      { key: 'company_tax_id', value: '60345307' },
      { key: 'company_name', value: '方舟雲計算科技有限公司' },
      { key: 'company_representative', value: '週若傑' },
    ]
  })
  console.log('Created site content')
  
  // 创建管理员账户
  const crypto = require('crypto')
  const hashedPassword = crypto.createHash('sha256').update('admin123').digest('hex')
  await prisma.user.create({
    data: {
      email: 'admin@arkcloud.top',
      password: hashedPassword,
      name: '管理員',
      role: 'ADMIN'
    }
  })
  console.log('Created admin user: admin@arkcloud.top / admin123')
  
  console.log('Seeding completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
