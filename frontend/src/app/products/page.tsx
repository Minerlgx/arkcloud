'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, HardDrive, Server, Network, ArrowLeft, Loader2, Minus, Plus, CreditCard, ShoppingCart, Zap, Eye, ChevronRight, Star } from 'lucide-react'
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

const categoryColors: Record<string, string> = {
  'Inference': 'from-emerald-500 to-teal-500',
  'Training': 'from-blue-500 to-indigo-500',
  'AI Training': 'from-violet-500 to-purple-500',
  'Visualization': 'from-orange-500 to-amber-500'
}

const defaultImage = 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('全部')
  const [deployModal, setDeployModal] = useState<DeployModal | null>(null)
  const [deploying, setDeploying] = useState(false)
  const [orderCreated, setOrderCreated] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    setFetchError(null)
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
      const msg = err instanceof Error ? err.message : '加载产品失败'
      setFetchError(msg)
      setProducts([])
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
    if (typeof window === 'undefined') return
    
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回首頁
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4">GPU 伺服器方案</h1>
              <p className="text-xl text-white/80">從 RTX 4090 到 H200 全系列覆蓋</p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-4xl font-bold">{products.length}</div>
              <div className="text-white/60">種配置方案</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {fetchError && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-800">
            <p className="font-semibold mb-2">无法加载产品数据</p>
            <p className="text-sm mb-4 whitespace-pre-wrap">{fetchError}</p>
            <button
              type="button"
              onClick={() => fetchProducts()}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              重试
            </button>
          </div>
        )}
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, idx) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg ${
                category === cat 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30' 
                  : 'bg-white text-gray-600 hover:shadow-xl hover:-translate-y-0.5'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm">
            <Server className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">目前沒有產品</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 pb-16">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100/50">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.images?.[0] || defaultImage} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-4 py-1.5 bg-gradient-to-r ${categoryColors[product.category] || 'from-blue-500 to-indigo-500'} rounded-full text-xs font-bold text-white shadow-lg`}>
                      {categoryMap[product.category] || product.category}
                    </span>
                    {product.featured && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3" /> 熱門
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                    現貨供應
                  </div>
                  
                  {/* Price overlay */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                      <span className="text-2xl font-bold text-blue-600">NT${product.priceHourly.toFixed(2)}</span>
                      <span className="text-gray-500 text-sm">/小時</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-700 truncate">{product.gpu}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                      <HardDrive className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-700">{product.vram}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                      <Server className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-700 truncate">{product.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                      <Network className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-700">{product.network}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Link 
                      href={`/products/${product.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                    >
                      <Eye className="w-4 h-4" /> 詳情
                    </Link>
                    <button 
                      onClick={() => setDeployModal({ product, quantity: 1, billingCycle: 'HOURLY' })}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                    >
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">部署配置</h2>
                <p className="text-gray-500">{deployModal.product.name}</p>
              </div>
              <button onClick={() => setDeployModal(null)} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">選擇數量</label>
              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2">
                <button onClick={() => setDeployModal({...deployModal, quantity: Math.max(1, deployModal.quantity - 1)})} className="w-12 h-12 bg-white hover:bg-gray-100 rounded-xl flex items-center justify-center shadow-sm transition-colors">−</button>
                <span className="text-2xl font-bold text-gray-900 flex-1 text-center">{deployModal.quantity}</span>
                <button onClick={() => setDeployModal({...deployModal, quantity: Math.min(deployModal.product.stock, deployModal.quantity + 1)})} className="w-12 h-12 bg-white hover:bg-gray-100 rounded-xl flex items-center justify-center shadow-sm transition-colors">+</button>
                <span className="text-gray-400 text-sm ml-4">庫存: {deployModal.product.stock}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">付款方式</label>
              <div className="grid grid-cols-2 gap-3">
                {['HOURLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].map(cycle => (
                  <button key={cycle} onClick={() => setDeployModal({...deployModal, billingCycle: cycle as any})}
                    className={`p-4 rounded-2xl text-sm font-semibold transition-all border-2 ${
                      deployModal.billingCycle === cycle 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/20' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                    }`}>
                    {getCycleLabel(cycle)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
              <div className="flex justify-between mb-2 text-sm"><span className="text-gray-600">單價</span><span className="font-semibold text-gray-900">NT${deployModal.product.priceHourly.toFixed(2)}/小時</span></div>
              <div className="flex justify-between mb-2 text-sm"><span className="text-gray-600">數量</span><span className="font-semibold text-gray-900">x {deployModal.quantity}</span></div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-blue-200">
                <span className="text-gray-900">費用</span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NT${getPrice(deployModal.product, deployModal.billingCycle, deployModal.quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <button onClick={handleDeploy} disabled={deploying}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
              {deploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              {deploying ? '創建訂單中...' : '前往支付'}
            </button>
          </div>
        </div>
      )}

      {orderCreated && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">訂單已創建</h2>
            <p className="text-gray-500 mb-6">請完成支付以激活您的實例</p>
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
              <div className="flex justify-between mb-3"><span className="text-gray-500">訂單編號</span><span className="font-mono text-sm">{orderCreated.order.id.slice(0, 8)}...</span></div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t"><span>待支付</span><span className="text-blue-600">NT${orderCreated.order.totalAmount.toFixed(2)}</span></div>
            </div>
            <button onClick={() => { alert('支付功能開發中...') }} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl mb-3 shadow-lg">立即支付</button>
            <button onClick={() => { setOrderCreated(null); setDeployModal(null) }} className="w-full py-3 text-gray-500 hover:text-gray-700">稍後支付</button>
          </div>
        </div>
      )}
    </div>
  )
}
