'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, CreditCard, Clock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

interface OrderData {
  product: {
    id: string
    name: string
    slug: string
    gpu: string
    vram: string
    priceHourly: number
    priceMonthly: number
  }
  billingCycle: 'hourly' | 'monthly'
  paymentMethod: string
  totalPrice: number
  createdAt: string
}

export default function PaymentPage() {
  const router = useRouter()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('card')

  useEffect(() => {
    // 从 sessionStorage 获取订单信息
    const orderData = sessionStorage.getItem('pendingOrder')
    if (!orderData) {
      router.push('/markets')
      return
    }
    setOrder(JSON.parse(orderData))
    setLoading(false)
  }, [])

  const handlePayment = async () => {
    if (!order) return
    
    setProcessing(true)
    try {
      // 模拟支付过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 支付成功，更新订单状态
      const paidOrder = { ...order, paymentStatus: 'paid', paidAt: new Date().toISOString() }
      sessionStorage.setItem('orderSuccess', JSON.stringify(paidOrder))
      sessionStorage.removeItem('pendingOrder')
      
      // 跳转到成功页面
      router.push('/payment/success')
    } catch (err) {
      alert('支付失敗，請稍後重試')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">訂單不存在</h2>
          <Link href="/markets" className="text-blue-600 hover:underline">
            返回算力市場
          </Link>
        </div>
      </div>
    )
  }

  const price = order.billingCycle === 'hourly' ? order.product.priceHourly : order.product.priceMonthly
  const priceLabel = order.billingCycle === 'hourly' ? '/小時' : '/月'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回會員中心
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">訂單支付</h1>
          <p className="text-gray-500 mt-2">訂單編號：{order.createdAt}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">訂單詳情</h2>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">🖥️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{order.product.name}</h3>
                    <div className="text-sm text-gray-500 mb-2">
                      {order.product.gpu} • {order.product.vram}
                    </div>
                    <div className="text-sm text-gray-500">
                      計費方式：{order.billingCycle === 'hourly' ? '按時計費' : '月付方案'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">選擇支付方式</h2>
                <div className="space-y-3">
                  {[
                    { id: 'card', name: '信用卡/借記卡', icon: '💳', desc: 'Visa, Mastercard, JCB' },
                    { id: 'transfer', name: '銀行轉帳', icon: '🏦', desc: '支援台灣各大銀行' },
                    { id: 'alipay', name: '支付寶', icon: '📱', desc: '中國大陸常用支付' },
                    { id: 'wechat', name: '微信支付', icon: '💬', desc: '中國大陸常用支付' },
                  ].map((method) => (
                    <label 
                      key={method.id} 
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedMethod === method.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.desc}</div>
                      </div>
                      {selectedMethod === method.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>

                {/* Card Details (if card selected) */}
                {selectedMethod === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">卡號</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">有效期</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">支付摘要</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>產品</span>
                    <span className="font-medium">{order.product.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>計費方式</span>
                    <span className="font-medium">{order.billingCycle === 'hourly' ? '按時計費' : '月付方案'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>支付方式</span>
                    <span className="font-medium">
                      {selectedMethod === 'card' ? '信用卡' : 
                       selectedMethod === 'transfer' ? '銀行轉帳' :
                       selectedMethod === 'alipay' ? '支付寶' : '微信支付'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">支付金額</span>
                    <span className="text-3xl font-bold text-blue-600">NT${price}</span>
                  </div>
                  <div className="text-right text-gray-500 text-sm">{priceLabel}</div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      處理中...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      確認支付
                    </>
                  )}
                </button>

                <div className="mt-4 p-3 bg-green-50 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <div className="font-medium">安全支付</div>
                      <div className="text-green-600">您的支付資訊已加密保護</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
