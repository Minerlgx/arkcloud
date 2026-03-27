'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'

interface OrderData {
  product: {
    id: string
    name: string
    slug: string
    gpu: string
    vram: string
  }
  billingCycle: 'hourly' | 'monthly'
  totalPrice: number
  paidAt: string
}

export default function PaymentSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderData = sessionStorage.getItem('orderSuccess')
    if (orderData) {
      setOrder(JSON.parse(orderData))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">支付成功！</h1>
        <p className="text-gray-600 mb-8">
          您的訂單已成功支付，GPU 實例正在啟動中...
        </p>

        {/* Order Info */}
        {order && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 text-left">
            <h2 className="text-lg font-bold text-gray-900 mb-4">訂單詳情</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">產品</span>
                <span className="font-medium">{order.product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">配置</span>
                <span className="font-medium">{order.product.gpu} • {order.product.vram}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">計費方式</span>
                <span className="font-medium">{order.billingCycle === 'hourly' ? '按時計費' : '月付方案'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">支付金額</span>
                <span className="font-bold text-blue-600">NT${order.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">支付時間</span>
                <span className="font-medium">{new Date(order.paidAt).toLocaleString('zh-TW')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-blue-600 font-medium">實例啟動中</span>
          </div>
          <p className="text-sm text-blue-600">預計 1-3 分鐘後即可使用</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link 
            href="/dashboard/instances"
            className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
          >
            查看我的實例
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/markets"
            className="block w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            繼續購買
          </Link>
        </div>
      </div>
    </div>
  )
}
