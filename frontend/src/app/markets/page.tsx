'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Server, Box, ArrowRight, Search, Filter } from 'lucide-react'
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

const categories = [
  { id: 'container', name: 'GPU容器實例', icon: Box, desc: '即开即用，弹性计费', color: 'from-blue-500 to-cyan-500' },
  { id: 'bms', name: 'GPU裸金属服務器', icon: Server, desc: '物理服務器，性能强劲', color: 'from-purple-500 to-pink-500' },
]

const categoryMap: Record<string, string> = {
  'Inference': '推理',
  'Training': '訓練',
  'AI Training': 'AI訓練',
  'Visualization': '視覺化'
}

export default function MarketsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [activeTab])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await api.get('/products')
      let prods = data.products || []
      
      if (activeTab === 'container') {
        prods = prods.filter((p: Product) => p.category === 'Inference' || p.category === 'Visualization')
      } else if (activeTab === 'bms') {
        prods = prods.filter((p: Product) => p.category === 'Training' || p.category === 'AI Training')
      }
      
      if (searchTerm) {
        prods = prods.filter((p: Product) => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.gpu.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      setProducts(prods)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">算力市场</h1>
          <p className="text-xl text-white/80 mb-8">精选优质GPU算力，即租即用，弹性计费</p>
          
          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索GPU型号..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); fetchProducts(); }}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部產品
            </button>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/markets/${cat.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <cat.icon className="w-5 h-5" />
                {cat.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'all' ? '全部產品' : activeTab === 'container' ? 'GPU容器實例' : 'GPU裸金属服務器'}
            </h2>
            <span className="text-gray-500">{products.length} 个產品</span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Server className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">暂无產品</p>
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
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
                      >
                        查看詳情
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">为什么选择方舟算力</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: '秒级部署', desc: '即租即用，无需等待' },
              { title: '弹性计费', desc: '按小时/月/年，灵活选择' },
              { title: '7x24支持', desc: '全天候技术支持' },
              { title: '高性能', desc: '最新GPU，强劲算力' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
