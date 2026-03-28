'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Cpu, MemoryStick, HardDrive, Clock, Check, ArrowLeft, Server, Minus, Plus } from 'lucide-react'
import api from '@/lib/api'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  gpu: string
  vram: string
  cpu: string
  ram: string
  storage: string
  priceHourly: number
  priceMonthly: number
  stock: number
  images: string[]
  specs: { label: string; value: string }[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [billingCycle, setBillingCycle] = useState<'HOURLY' | 'MONTHLY'>('HOURLY')
  const router = useRouter()

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const data = await api.get('/products')
      const prod = (data.products || []).find((p: Product) => p.slug === slug)
      setProduct(prod || null)
    } catch (err) {
      console.error('Failed to fetch product:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">產品不存在</h1>
          <Link href="/markets" className="text-blue-600 hover:underline">
            ← 返回算力市場
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link 
            href="/markets"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回算力市場
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500 text-lg">{product.description}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600 mb-1">NT${product.priceHourly}</div>
              <div className="text-gray-500">/h</div>
              <div className="text-sm text-gray-400 mt-2">月付：NT${product.priceMonthly}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'}
                alt={product.name}
                className="w-full h-auto"
              />
            </div>

            {/* Quick Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">核心規格</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">GPU</div>
                      <div className="font-semibold">{product.gpu}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MemoryStick className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">顯存</div>
                      <div className="font-semibold">{product.vram}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Server className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">CPU</div>
                      <div className="font-semibold">{product.cpu}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MemoryStick className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">記憶體</div>
                      <div className="font-semibold">{product.ram}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">儲存</div>
                      <div className="font-semibold">{product.storage}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <h2 className="text-xl font-bold mb-4">計費方案</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>按時計費</span>
                    <span className="font-bold">NT${product.priceHourly}/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>月付方案</span>
                    <span className="font-bold">NT${product.priceMonthly}/月</span>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>月付享 86 折優惠</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Billing */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">選擇數量</label>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold flex-1 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-gray-400 text-sm ml-2">庫存: {product.stock}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">計費方式</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBillingCycle('HOURLY')}
                      className={`p-4 rounded-xl text-sm font-semibold transition-all border-2 ${
                        billingCycle === 'HOURLY' 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="font-bold mb-1">按時計費</div>
                      <div className="text-lg font-bold">NT${product.priceHourly}</div>
                      <div className="text-xs text-gray-400">/h</div>
                    </button>
                    <button
                      onClick={() => setBillingCycle('MONTHLY')}
                      className={`p-4 rounded-xl text-sm font-semibold transition-all border-2 relative ${
                        billingCycle === 'MONTHLY' 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">86折</span>
                      <div className="font-bold mb-1">月付方案</div>
                      <div className="text-lg font-bold">NT${product.priceMonthly}</div>
                      <div className="text-xs text-gray-400">/月</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={() => {
                  const stored = sessionStorage.getItem('user')
                  if (stored) {
                    // 已登入，跳转到结算页面
                    router.push(`/checkout?product=${product.slug}&quantity=${quantity}&cycle=${billingCycle}`)
                  } else {
                    // 未登入，跳转到登入，登入后返回结算页面
                    router.push(`/login?redirect=/checkout?product=${product.slug}&quantity=${quantity}&cycle=${billingCycle}`)
                  }
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
              >
                立即租用 {quantity > 1 && `× ${quantity}`}
              </button>

              {product.stock < 10 && (
                <div className="text-center text-orange-600 text-sm">
                  庫存緊張，僅剩 {product.stock} 台
                </div>
              )}
            </div>
          </div>

          {/* Detailed Specs */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">詳細規格</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {product.specs?.map((spec, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">{spec.label}</span>
                  <span className="font-medium text-gray-900">{spec.value}</span>
                </div>
              )) || (
                <>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">GPU 型號</span>
                    <span className="font-medium text-gray-900">{product.gpu}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">顯存容量</span>
                    <span className="font-medium text-gray-900">{product.vram}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">CPU 核心數</span>
                    <span className="font-medium text-gray-900">{product.cpu}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">記憶體</span>
                    <span className="font-medium text-gray-900">{product.ram}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: '秒級部署', desc: '下單後 1-2 分鐘內啟動' },
              { icon: Check, title: '彈性計費', desc: '按小時/月付，靈活選擇' },
              { icon: Server, title: '專業支援', desc: '7x24 小時技術支援' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
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
