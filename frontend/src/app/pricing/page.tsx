import Link from 'next/link'
import { Check, ArrowRight, Clock, Calendar, CreditCard, Sparkles } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: '按時計費',
      icon: Clock,
      description: '彈性使用，適合臨時需求',
      price: 1,
      discount: '無折扣',
      features: [
        '按小時計費，靈活方便',
        '隨時啟動/停止',
        '無最低消費',
        '適合測試開發',
        '短期使用場景'
      ],
      color: 'gray',
      popular: false
    },
    {
      name: '月付方案',
      icon: Calendar,
      description: '一個月為單位，適合長期穩定使用',
      price: 0.86,
      discount: '86折',
      features: [
        '月付享 86 折優惠',
        '每月自動續費',
        '可隨時取消',
        '適合長期項目',
        '穩定成本預算'
      ],
      color: 'blue',
      popular: true
    },
    {
      name: '季付方案',
      icon: Calendar,
      description: '三個月為單位，中期項目首選',
      price: 0.80,
      discount: '8折',
      features: [
        '季付享 8 折優惠',
        '相當於月付 9.6 折',
        '節省更多成本',
        '適合季度項目',
        '預算更優化'
      ],
      color: 'indigo',
      popular: false
    },
    {
      name: '年付方案',
      icon: Sparkles,
      description: '一年為單位，最大優惠力度',
      price: 0.75,
      discount: '75折',
      features: [
        '年付享 75 折優惠',
        '相當於月付 9 折',
        '最大優惠力度',
        '適合長期部署',
        '企業級方案'
      ],
      color: 'violet',
      popular: false
    }
  ]

  const colorMap: Record<string, { bg: string, border: string, button: string, text: string, gradient: string }> = {
    gray: { bg: 'bg-white', border: 'border-gray-200', button: 'bg-gray-600 hover:bg-gray-700', text: 'text-gray-600', gradient: '' },
    blue: { bg: 'bg-white', border: 'border-blue-500', button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700', text: 'text-blue-600', gradient: 'from-blue-600 to-indigo-600' },
    indigo: { bg: 'bg-white', border: 'border-indigo-500', button: 'bg-indigo-600 hover:bg-indigo-700', text: 'text-indigo-600', gradient: '' },
    violet: { bg: 'bg-white', border: 'border-violet-500', button: 'bg-violet-600 hover:bg-violet-700', text: 'text-violet-600', gradient: '' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">彈性計費方案</h1>
            <p className="text-xl text-white/80 mb-8">選擇最適合您的方案，長期使用更優惠</p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">支援信用卡、超商付款、银行转账</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const colors = colorMap[plan.color]
            return (
              <div 
                key={plan.name}
                className={`${colors.bg} rounded-3xl overflow-hidden ${
                  plan.popular 
                    ? 'ring-4 ring-blue-500 shadow-2xl scale-105' 
                    : 'border-2 ' + colors.border + ' shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-bold">
                    最受歡迎
                  </div>
                )}
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${
                    plan.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                    plan.color === 'gray' ? 'bg-gray-200' :
                    'bg-gradient-to-br from-gray-500 to-gray-600'
                  } flex items-center justify-center mb-6`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${colors.text}`}>
                        {plan.discount}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">相當於原價的 {Math.round(plan.price * 100)}%</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href="/products"
                    className={`block w-full py-3 text-center font-semibold rounded-xl text-white transition-all ${colors.button} shadow-lg`}
                  >
                    立即選購
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">常見問題</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">付款後可以退款嗎？</h3>
              <p className="text-gray-600">按時計費方案可隨時取消，未使用的時數可申請退款。月付及以上方案如需退款，按實際使用天數計算剩餘金額。</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">如何切換計費方案？</h3>
              <p className="text-gray-600">您可以在會員中心的帳戶設置中隨時切換計費方案。方案變更將在下一個計費週期生效。</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">遲繳費用會怎樣？</h3>
              <p className="text-gray-600">帳單逾期後，我們會發送提醒通知。如超過 7 天未繳費，實例將被暫停，但仍可補繳費用恢復。</p>
            </div>
            
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">企業客戶有更多優惠嗎？</h3>
              <p className="text-gray-600">企業客戶可聯繫我們的銷售團隊，洽談專屬優惠方案和定制服務。</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">準備好开始了嗎？</h2>
          <p className="text-white/80 text-lg mb-8">立即註冊，享受專業 GPU 雲端服務</p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold transition-all shadow-xl"
          >
            立即註冊
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
