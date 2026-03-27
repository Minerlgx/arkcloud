'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, CreditCard, Clock, ArrowLeft, Loader2, AlertCircle, Wallet, Plus } from 'lucide-react'

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

interface UserBalance {
  balance: number
  frozen: number
  available: number
}

export default function PaymentPage() {
  const router = useRouter()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState<UserBalance>({ balance: 0, frozen: 0, available: 0 })
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('balance') // 默认余额支付
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')

  useEffect(() => {
    // 从 sessionStorage 获取订单信息
    const orderData = sessionStorage.getItem('pendingOrder')
    const userData = sessionStorage.getItem('user')
    
    if (!orderData) {
      router.push('/markets')
      return
    }
    
    setOrder(JSON.parse(orderData))
    
    if (userData) {
      const user = JSON.parse(userData)
      setUser(user)
      // 模拟用户余额（演示用）
      setBalance({
        balance: 5000, // 账户余额 NT$5000
        frozen: 0,
        available: 5000
      })
    }
    
    setLoading(false)
  }, [])

  const handlePayment = async () => {
    if (!order) return
    
    // 检查余额是否足够
    if (selectedMethod === 'balance' && balance.available < order.totalPrice) {
      setShowTopUp(true)
      return
    }
    
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

  const handleTopUp = () => {
    const amount = parseInt(topUpAmount)
    if (amount > 0) {
      // 模拟充值
      const newBalance = balance.balance + amount
      setBalance({
        balance: newBalance,
        frozen: 0,
        available: newBalance
      })
      setShowTopUp(false)
      setTopUpAmount('')
      alert(`充值成功！已充值 NT$${amount}`)
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
  const balanceInsufficient = selectedMethod === 'balance' && balance.available < order.totalPrice

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">餘額不足</h3>
            <p className="text-gray-600 mb-4">
              您的可用餘額為 <span className="font-bold text-blue-600">NT${balance.available}</span>，
              訂單金額為 <span className="font-bold">NT${order.totalPrice}</span>，
              還差 <span className="font-bold text-red-600">NT${order.totalPrice - balance.available}</span>。
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">選擇充值金額</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[100, 500, 1000, 2000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTopUpAmount(amount.toString())}
                    className={`py-2 rounded-lg border-2 font-medium transition-colors ${
                      topUpAmount === amount.toString()
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    NT${amount}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="自定義金額"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || parseInt(topUpAmount) <= 0}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl disabled:opacity-50"
                >
                  充值
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTopUp(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowTopUp(false)
                  setSelectedMethod('card')
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
              >
                使用其他支付
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* Balance Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium">我的餘額</div>
                      <div className="text-2xl font-bold text-gray-900">NT${balance.available}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTopUp(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    充值
                  </button>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">選擇支付方式</h2>
                <div className="space-y-3">
                  {[
                    { id: 'balance', name: '餘額支付', icon: '💰', desc: '使用帳戶餘額支付' },
                    { id: 'card', name: '信用卡/借記卡', icon: '💳', desc: 'Visa, Mastercard, JCB' },
                    { id: 'transfer', name: '銀行轉帳', icon: '🏦', desc: '支援台灣各大銀行' },
                    { id: 'alipay', name: '支付寶', icon: '📱', desc: '中國大陸常用支付' },
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

                {/* Balance Warning */}
                {balanceInsufficient && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-600">餘額不足</div>
                      <div className="text-sm text-red-600">
                        您的可用餘額為 NT${balance.available}，還差 NT${order.totalPrice - balance.available}。
                        請先充值或選擇其他支付方式。
                      </div>
                    </div>
                  </div>
                )}

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
                      {selectedMethod === 'balance' ? '餘額支付' : 
                       selectedMethod === 'card' ? '信用卡' :
                       selectedMethod === 'transfer' ? '銀行轉帳' : '支付寶'}
                    </span>
                  </div>
                  {selectedMethod === 'balance' && (
                    <div className="flex justify-between text-gray-600">
                      <span>餘額</span>
                      <span className={`font-medium ${balanceInsufficient ? 'text-red-600' : 'text-green-600'}`}>
                        NT${balance.available}
                      </span>
                    </div>
                  )}
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
                  disabled={processing || balanceInsufficient}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      處理中...
                    </>
                  ) : balanceInsufficient ? (
                    <>
                      <Plus className="w-5 h-5" />
                      餘額不足，請充值
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
