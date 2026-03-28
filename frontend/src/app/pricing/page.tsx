'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Clock, Calendar, CreditCard } from 'lucide-react'

const plans = [
  {
    name: '按時計費',
    icon: Clock,
    description: '彈性使用，適合臨時需求',
    discount: '無折扣',
    features: ['按小時計費，靈活方便', '隨時啟動/停止', '無最低消費', '適合測試開發'],
    color: 'gray',
  },
  {
    name: '月付方案',
    icon: Calendar,
    description: '一個月為單位，適合長期穩定使用',
    discount: '86 折',
    features: ['月付享 86 折優惠', '每月自動續費', '可隨時取消', '適合長期項目'],
    color: 'blue',
    popular: true,
  },
  {
    name: '季付方案',
    icon: Calendar,
    description: '三個月為單位，中期項目首選',
    discount: '8 折',
    features: ['季付享 8 折優惠', '相當於月付 9.6 折', '節省更多成本', '適合季度項目'],
    color: 'indigo',
  },
  {
    name: '年付方案',
    icon: CreditCard,
    description: '一年為單位，最大優惠力度',
    discount: '75 折',
    features: ['年付享 75 折優惠', '相當於月付 9 折', '最大優惠力度', '適合長期部署'],
    color: 'violet',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">彈性計費方案</h1>
          <p className="text-xl text-white/80">選擇最適合您的方案，長期使用更優惠</p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`bg-white rounded-3xl overflow-hidden ${
                  plan.popular ? 'ring-4 ring-blue-500 shadow-2xl scale-105' : 'border-2 border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-bold">
                    最受歡迎
                  </div>
                )}
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                    plan.color === 'blue' ? 'from-blue-500 to-indigo-500' :
                    plan.color === 'gray' ? 'from-gray-400 to-gray-500' :
                    plan.color === 'indigo' ? 'from-indigo-500 to-purple-500' :
                    'from-violet-500 to-purple-500'
                  } flex items-center justify-center mb-6`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-600">{plan.discount}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href="/markets"
                    className={`block w-full py-3 text-center font-semibold rounded-xl text-white bg-gradient-to-r ${
                      plan.color === 'blue' ? 'from-blue-600 to-indigo-600 hover:from-blue-700' :
                      'from-gray-600 to-gray-700 hover:from-gray-700'
                    } transition-all shadow-lg`}
                  >
                    立即選購
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">價格對比示例</h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 text-gray-500 font-medium">產品</th>
                  <th className="text-right py-4 text-gray-500 font-medium">按時計費</th>
                  <th className="text-right py-4 text-gray-500 font-medium">月付</th>
                  <th className="text-right py-4 text-gray-500 font-medium">年付</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium">RTX 4090</td>
                  <td className="py-4 text-right">NT$0.8/h</td>
                  <td className="py-4 text-right">NT$480/月</td>
                  <td className="py-4 text-right text-blue-600 font-bold">NT$4,320/年</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium">H100 80GB</td>
                  <td className="py-4 text-right">NT$2.5/h</td>
                  <td className="py-4 text-right">NT$1,500/月</td>
                  <td className="py-4 text-right text-blue-600 font-bold">NT$13,500/年</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">H200 141GB</td>
                  <td className="py-4 text-right">NT$3.5/h</td>
                  <td className="py-4 text-right">NT$2,100/月</td>
                  <td className="py-4 text-right text-blue-600 font-bold">NT$18,900/年</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">常見問題</h2>
          <div className="space-y-6">
            {[
              { q: '付款後可以退款嗎？', a: '按時計費方案可隨時取消，未使用的時數可申請退款。月付及以上方案如需退款，按實際使用天數計算剩餘金額。' },
              { q: '如何切換計費方案？', a: '您可以在會員中心的帳戶設置中隨時切換計費方案。方案變更將在下一個計費週期生效。' },
              { q: '遲繳費用會怎樣？', a: '帳單逾期後，我們會發送提醒通知。如超過 7 天未繳費，實例將被暫停，但仍可補繳費用恢復。' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">準備好開始了嗎？</h2>
          <p className="text-white/80 text-lg mb-8">立即註冊，享受專業 GPU 雲端服務</p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold transition-all shadow-xl"
          >
            立即註冊
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
