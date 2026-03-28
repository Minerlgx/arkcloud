'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Cpu, ArrowLeft, Server, Box } from 'lucide-react'
import api from '@/lib/api'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  gpu: string
  vram: string
  priceHourly: number
  stock: number
  images: string[]
}

const categoryInfo: Record<string, { name: string; icon: any; desc: string; color: string }> = {
  container: { 
    name: 'GPU 容器实例', 
    icon: Box, 
    desc: '即开即用，弹性计费，适合临时开发和测试',
    color: 'from-blue-500 to-cyan-500'
  },
  bms: { 
    name: 'GPU 裸金属服务器', 
    icon: Server, 
    desc: '物理服务器独享，性能强劲，适合长期训练任务',
    color: 'from-purple-500 to-pink-500'
  },
}

const categoryMap: Record<string, string> = {
  'Inference': '推理',
  'Training': '訓練',
  'AI Training': 'AI 訓練',
  'Visualization': '視覺化'
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const category = params.category as string

  useEffect(() => {
    if (category) {
      fetchProducts()
    }
  }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await api.get('/products')
      let prods = data.products || []
      
      // 根据分类过滤产品
      if (category === 'container') {
        prods = prods.filter((p: Product) => p.category === 'Inference' || p.category === 'Visualization')
      } else if (category === 'bms') {
        prods = prods.filter((p: Product) => p.category === 'Training' || p.category === 'AI Training')
      }
      
      setProducts(prods)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const info = categoryInfo[category]

  if (!info) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">分类不存在</h1>
          <Link href="/markets" className="text-blue-600 hover:underline">
            ← 返回算力市场
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className={`bg-gradient-to-r ${info.color} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-6">
          <Link 
            href="/markets"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回算力市场
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <info.icon className="w-12 h-12" />
            <h1 className="text-5xl font-bold">{info.name}</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl">{info.desc}</p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4">
            <Link
              href="/markets"
              className="px-6 py-3 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
              全部产品
            </Link>
            <Link
              href="/markets/container"
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                category === 'container'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Box className="w-5 h-5 inline mr-2" />
              GPU 容器实例
            </Link>
            <Link
              href="/markets/bms"
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                category === 'bms'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Server className="w-5 h-5 inline mr-2" />
              GPU 裸金属服务器
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">全部产品</h2>
            <span className="text-gray-500">{products.length} 个产品</span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <info.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">该分类下暂无产品</p>
              <Link href="/markets" className="text-blue-600 hover:underline mt-2 inline-block">
                查看全部产品 →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                      {categoryMap[product.category] || product.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <Cpu className="w-4 h-4" />
                      <span>{product.gpu}</span>
                      <span>•</span>
                      <span>{product.vram}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">NT${product.priceHourly}</span>
                        <span className="text-gray-400 text-sm">/h</span>
                      </div>
                      <Link 
                        href={`/products/${product.slug}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                      >
                        查看详情
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {category === 'container' ? '容器实例优势' : '裸金属服务器优势'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {category === 'container' ? (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Box className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">秒级部署</h3>
                  <p className="text-gray-500">预置常用框架，开箱即用</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Cpu className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">弹性计费</h3>
                  <p className="text-gray-500">按小时计费，用多少付多少</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Server className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">灵活扩展</h3>
                  <p className="text-gray-500">随时升降配，满足业务变化</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Server className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">独享资源</h3>
                  <p className="text-gray-500">完整物理服务器，零虚拟化</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Cpu className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">极致性能</h3>
                  <p className="text-gray-500">释放 GPU 与 CPU 全部性能</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Box className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">安全隔离</h3>
                  <p className="text-gray-500">物理隔离，数据更安全</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
