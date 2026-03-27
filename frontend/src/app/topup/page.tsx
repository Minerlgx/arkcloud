'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Wallet, CreditCard, ArrowLeft, Check, Loader2 } from 'lucide-react'

interface UserBalance {
  balance: number
  frozen: number
  available: number
}

export default function TopUpPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<UserBalance>({ balance: 0, frozen: 0, available: 0 })
  const [selectedAmount, setSelectedAmount] = useState<string>('')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取当前余额
    const userData = sessionStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    // 模拟用户余额
    setBalance({
      balance: 5000,
      frozen: 0,
      available: 5000
    })
    setLoading(false)
  }, [])

  const handleTopUp = async () => {
    const amount = parseInt(customAmount || selectedAmount)
    if (!amount || amount <= 0) {
      alert('請選擇或輸入充值金額')
      return
    }
    
    setProcessing(true)
    try {
      // 模拟充值过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 充值成功
      const newBalance = balance.balance + amount
      sessionStorage.setItem('userBalance', JSON.stringify({
        balance: newBalance,
        frozen: 0,
        available: newBalance
      }))
      
      alert(`充值成功！已充值 NT$${amount}`)
      router.push('/payment')
    } catch (err) {
      alert('充值失敗，請稍後重試')
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

  const topUpAmount = parseInt(customAmount || selectedAmount) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link 
            href="/payment"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回支付頁面
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">帳戶充值</h1>
          <p className="text-gray-500 mt-2">為您的帳戶充值，用於支付 GPU 算力費用</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">當前餘額</p>
                <p className="text-3xl font-bold">NT${balance.available}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">選擇充值金額</h2>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[100, 500, 1000, 2000].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount.toString())
                    setCustomAmount('')
                  }}
                  className={`py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                    selectedAmount === amount.toString() && !customAmount
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  NT${amount}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">自定義金額</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount('')
                }}
                placeholder="輸入自定義金額"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">選擇支付方式</h2>
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

            {/* Card Details */}
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

          {/* Summary & Submit */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">充值金額</span>
              <span className="text-3xl font-bold text-blue-600">NT${topUpAmount || 0}</span>
            </div>
            
            <button
              onClick={handleTopUp}
              disabled={processing || !topUpAmount}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  處理中...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  確認充值
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
      </section>
    </div>
  )
}
