'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, CreditCard, Clock, ArrowLeft } from 'lucide-react'
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
  priceMonthly: number
  stock: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('product')
  const [user, setUser] = useState<any>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'hourly' | 'monthly'>('monthly')
  const [quantity, setQuantity] = useState(1)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // 检查登录状态
    const stored = sessionStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(stored))
    
    // 获取 URL 参数
    const cycleParam = searchParams.get('cycle')
    const qtyParam = searchParams.get('quantity')
    if (cycleParam === 'HOURLY' || cycleParam === 'MONTHLY') {
      setBillingCycle(cycleParam === 'HOURLY' ? 'hourly' : 'monthly')
    }
    if (qtyParam) {
      setQuantity(parseInt(qtyParam) || 1)
    }
    
    // 获取产品信息
    if (slug) {
      fetchProduct()
    } else {
      router.push('/markets')
    }
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

  const handleCheckout = async () => {
    if (!product) return
    
    setProcessing(true)
    try {
      // 保存訂單信息到 sessionStorage
      const orderData = {
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          gpu: product.gpu,
          vram: product.vram,
          priceHourly: product.priceHourly,
          priceMonthly: product.priceMonthly,
        },
        quantity,
        billingCycle,
        paymentMethod: 'card',
        totalPrice: price,
        createdAt: new Date().toISOString(),
      }
      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData))
      
      // 跳轉到支付頁面
      router.push('/payment')
    } catch (err) {
      alert('訂單創建失敗，請稍後重試')
    } finally {
      setProcessing(false)
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

  const price = (billingCycle === 'hourly' ? product.priceHourly : product.priceMonthly) * quantity
  const priceLabel = billingCycle === 'hourly' ? '/小時' : '/月'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link 
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回產品詳情
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">選擇計費方式</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">訂購內容</h2>
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">🖥️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                    <div className="text-sm text-gray-400">
                      {product.gpu} • {product.vram}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">選擇計費方式</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setBillingCycle('hourly')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      billingCycle === 'hourly' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={`w-5 h-5 ${billingCycle === 'hourly' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="font-bold">按時計費</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">NT${product.priceHourly}</div>
                    <div className="text-sm text-gray-500">/小時</div>
                  </button>
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      billingCycle === 'monthly' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className={`w-5 h-5 ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="font-bold">月付方案</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">NT${product.priceMonthly}</div>
                    <div className="text-sm text-gray-500">/月（86折）</div>
                  </button>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">下一步</h3>
                <p className="text-blue-700 text-sm">點擊「前往支付」後，您將選擇支付方式並完成付款。</p>
              </div>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">訂單摘要</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>產品</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>數量</span>
                    <span className="font-medium">× {quantity}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>計費方式</span>
                    <span className="font-medium">{billingCycle === 'hourly' ? '按時計費' : '月付方案'}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">費用</span>
                    <span className="text-3xl font-bold text-blue-600">NT${price}</span>
                  </div>
                  <div className="text-right text-gray-500 text-sm">{priceLabel} × {quantity}</div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      處理中...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      前往支付
                    </>
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  點擊確認即表示您同意我們的服務條款
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
