'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Cpu, HardDrive, Server, Network, Loader2, Minus, Plus, CreditCard, ShoppingCart, Zap, Check } from 'lucide-react'
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
  network: string
  datacenter: string
  priceHourly: number
  priceMonthly: number
  stock: number
  featured: boolean
  images: string[]
}

const categoryMap: Record<string, string> = {
  'Inference': '推理',
  'Training': '訓練',
  'AI Training': 'AI訓練',
  'Visualization': '視覺化'
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [billingCycle, setBillingCycle] = useState<'HOURLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('HOURLY')
  const [deploying, setDeploying] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      // 获取所有产品然后匹配 slug
      const data = await api.get('/products')
      
      const found = data.products?.find((p: any) => p.slug === params.slug)
      
      if (found) {
        setProduct({
          ...found,
          priceHourly: Number(found.pricehourly || found.priceHourly || 0),
          priceMonthly: Number(found.pricemonthly || found.priceMonthly || 0),
        })
      }
    } catch (err) {
      console.error('Failed to fetch product:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPrice = () => {
    if (!product) return 0
    let base = 0, discount = 1
    switch (billingCycle) {
      case 'MONTHLY': base = product.priceMonthly; discount = 0.86; break
      case 'QUARTERLY': base = product.priceMonthly * 3; discount = 0.80; break
      case 'YEARLY': base = product.priceMonthly * 12; discount = 0.75; break
      default: base = product.priceHourly; break
    }
    return base * discount * quantity
  }

  const getCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'HOURLY': return '按時計費'
      case 'MONTHLY': return '月付 (86折)'
      case 'QUARTERLY': return '季付 (8折)'
      case 'YEARLY': return '年付 (75折)'
      default: return cycle
    }
  }

  const handleDeploy = async () => {
    if (!product) return
    
    const user = sessionStorage.getItem('user')
    if (!user) {
      alert('請先登入')
      router.push('/login')
      return
    }
    
    setDeploying(true)
    try {
      const userData = JSON.parse(user)
      await api.post('/orders', {
        userId: userData.id,
        productId: product.id,
        quantity,
        billingCycle
      })

      alert('訂單已創建！請前往支付。')
      router.push('/dashboard')
    } catch (err) {
      alert('部署失敗')
    } finally {
      setDeploying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">找不到這個產品</h1>
          <Link href="/products" className="text-blue-600 hover:underline">返回產品列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> 返回產品列表
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {product.images?.[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Server className="w-24 h-24" />
              </div>
            )}
            {product.featured && (
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-4 py-2 bg-orange-500 rounded-full text-sm font-bold text-white flex items-center gap-1">
                  <Zap className="w-4 h-4" /> 熱門
                </span>
              </div>
            )}
            <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 rounded-full text-sm font-bold text-white">
              現貨
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {categoryMap[product.category] || product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-8">{product.description}</p>

            {/* Specs */}
            <div className="bg-white rounded-2xl p-6 mb-8 border">
              <h3 className="font-bold text-gray-900 mb-4">配置規格</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">GPU</p>
                    <p className="font-semibold text-gray-900">{product.gpu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">VRAM</p>
                    <p className="font-semibold text-gray-900">{product.vram}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">CPU</p>
                    <p className="font-semibold text-gray-900">{product.cpu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Network className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">網絡</p>
                    <p className="font-semibold text-gray-900">{product.network}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-500">RAM:</span> <span className="font-medium">{product.ram}</span></div>
                <div><span className="text-gray-500">存儲:</span> <span className="font-medium">{product.storage}</span></div>
                <div><span className="text-gray-500">機房:</span> <span className="font-medium">{product.datacenter}</span></div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-blue-600">NT${product.priceHourly.toFixed(2)}</span>
                <span className="text-gray-500">/小時</span>
              </div>
              <p className="text-gray-600">月付 NT${product.priceMonthly.toLocaleString()}/月</p>
            </div>

            {/* Order Form */}
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-bold text-gray-900 mb-4">選擇配置</h3>
              
              <div className="mb-4">
                <label className="text-gray-600 text-sm mb-2 block">數量</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="text-gray-500 ml-4">庫存: {product.stock}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-600 text-sm mb-2 block">付款方式</label>
                <div className="grid grid-cols-2 gap-3">
                  {['HOURLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].map(cycle => (
                    <button
                      key={cycle}
                      onClick={() => setBillingCycle(cycle as any)}
                      className={`p-4 rounded-xl text-sm font-medium border-2 transition-all ${
                        billingCycle === cycle 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {getCycleLabel(cycle)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 pt-4 border-t">
                <span className="text-gray-600">費用</span>
                <span className="text-2xl font-bold text-blue-600">NT${getPrice().toFixed(2)}</span>
              </div>

              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                {deploying ? '創建訂單中...' : '立即部署'}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white rounded-2xl p-8 border">
          <h3 className="text-xl font-bold text-gray-900 mb-6">服務保障</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">99.9% 可用性</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">7x24 技術支援</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">按需即時部署</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">彈性擴展資源</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
