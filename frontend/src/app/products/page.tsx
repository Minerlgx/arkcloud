'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, HardDrive, Server, Network, ArrowLeft, Loader2, Minus, Plus, CreditCard, ShoppingCart, Zap } from 'lucide-react'
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
  images?: string[]
}

interface DeployModal {
  product: Product
  quantity: number
  billingCycle: 'HOURLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}

const categoryMap: Record<string, string> = {
  'Inference': '推理',
  'Training': '訓練',
  'AI Training': 'AI訓練',
  'Visualization': '視覺化'
}

const defaultImage = 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('全部')
  const [deployModal, setDeployModal] = useState<DeployModal | null>(null)
  const [deploying, setDeploying] = useState(false)
  const [orderCreated, setOrderCreated] = useState<any>(null)

  useEffect(() => { fetchProducts() }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== '全部') {
        const enCat = Object.entries(categoryMap).find(([, zh]) => zh === category)?.[0] || category
        params.set('category', enCat)
      }
      const data = await api.get(`/products?${params}`)
      const prods = (data.products || []).map((p: any) => ({
        ...p,
        priceHourly: Number(p.pricehourly || p.priceHourly || 0),
        priceMonthly: Number(p.pricemonthly || p.priceMonthly || 0),
      }))
      setProducts(prods)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPrice = (product: Product, cycle: string, qty: number) => {
    let base = 0, discount = 1
    switch (cycle) {
      case 'MONTHLY': base = product.priceMonthly * qty; discount = 0.86; break
      case 'QUARTERLY': base = product.priceMonthly * 3 * qty; discount = 0.80; break
      case 'YEARLY': base = product.priceMonthly * 12 * qty; discount = 0.75; break
      default: base = product.priceHourly * qty; discount = 1; break
    }
    return base * discount
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
    if (!deployModal) return
    const user = sessionStorage.getItem('user')
    if (!user) { alert('請先登入'); return }
    
    setDeploying(true)
    try {
      const userData = JSON.parse(user)
      const { order, instance } = await api.post('/orders', {
        userId: userData.id, productId: deployModal.product.id,
        quantity: deployModal.quantity, billingCycle: deployModal.billingCycle
      })
      setOrderCreated({ order, instance, product: deployModal.product })
    } catch (err: any) { alert(err.message || '部署失敗') }
    finally { setDeploying(false) }
  }

  const categories = ['全部', '推理', '訓練', 'AI訓練', '視覺化']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回首頁
          </Link>
          <h1 className="text-4xl font-bold mb-4">GPU 伺服器方案</h1>
          <p className="text-xl text-white/80">從 RTX 4090 到 H200 全系列覆蓋，共 {products.length} 種配置</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                category === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">目前沒有產品</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={product.images?.[0] || defaultImage} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur rounded-full text-xs font-bold text-blue-600 shadow-sm">
                      {categoryMap[product.category] || product.category}
                    </span>
                    {product.featured && (
                      <span className="px-3 py-1 bg-orange-500 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
                        <Zap className="w-3 h-3" /> 熱門
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">現貨</div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  {/* Specs */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700 font-medium">{product.gpu}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <HardDrive className="w-4 h-4 text-blue-500" />
                      <span>{product.vram}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Server className="w-4 h-4 text-blue-500" />
                      <span>{product.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Network className="w-4 h-4 text-blue-500" />
                      <span>{product.network}</span>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">起售價</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-blue-600">NT${product.priceHourly.toFixed(2)}</span>
                        <span className="text-gray-400">/小時</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setDeployModal({ product, quantity: 1, billingCycle: 'HOURLY' })}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> 立即部署
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deploy Modal */}
      {deployModal && !orderCreated && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">部署配置</h2>
            <p className="text-gray-500 mb-6">{deployModal.product.name}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">選擇數量</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setDeployModal({...deployModal, quantity: Math.max(1, deployModal.quantity - 1)})} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"><Minus className="w-5 h-5" /></button>
                <span className="text-2xl font-bold text-gray-900 w-16 text-center">{deployModal.quantity}</span>
                <button onClick={() => setDeployModal({...deployModal, quantity: Math.min(deployModal.product.stock, deployModal.quantity + 1)})} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"><Plus className="w-5 h-5" /></button>
                <span className="text-gray-400 text-sm ml-4">庫存: {deployModal.product.stock}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">付款方式</label>
              <div className="grid grid-cols-2 gap-3">
                {['HOURLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].map(cycle => (
                  <button key={cycle} onClick={() => setDeployModal({...deployModal, billingCycle: cycle as any})}
                    className={`p-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                      deployModal.billingCycle === cycle ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                    }`}>
                    {getCycleLabel(cycle)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 mb-6">
              <div className="flex justify-between mb-2 text-sm"><span className="text-gray-600">單價</span><span className="text-gray-900">NT${deployModal.product.priceHourly.toFixed(2)}/小時</span></div>
              <div className="flex justify-between mb-2 text-sm"><span className="text-gray-600">數量</span><span className="text-gray-900">x {deployModal.quantity}</span></div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-blue-200">
                <span className="text-gray-900">費用</span>
                <span className="text-blue-600">NT${getPrice(deployModal.product, deployModal.billingCycle, deployModal.quantity).toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleDeploy} disabled={deploying}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50">
              {deploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              {deploying ? '創建訂單中...' : '前往支付'}
            </button>
            <button onClick={() => setDeployModal(null)} className="w-full py-3 mt-2 text-gray-500 hover:text-gray-700">取消</button>
          </div>
        </div>
      )}

      {/* Order Created */}
      {orderCreated && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">訂單已創建</h2>
            <p className="text-gray-500 mb-6">請完成支付以激活您的實例</p>
            <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
              <div className="flex justify-between mb-3"><span className="text-gray-500">訂單編號</span><span className="font-mono text-sm">{orderCreated.order.id.slice(0, 8)}...</span></div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t"><span>待支付</span><span className="text-blue-600">NT${orderCreated.order.totalAmount.toFixed(2)}</span></div>
            </div>
            <button onClick={() => { alert('支付功能開發中...') }} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl mb-3">立即支付</button>
            <button onClick={() => { setOrderCreated(null); setDeployModal(null) }} className="w-full py-3 text-gray-500">稍後支付</button>
          </div>
        </div>
      )}
    </div>
  )
}
