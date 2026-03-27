'use client'
import Link from 'next/link'
import { Building2, Users, Shield, Headphones, ArrowRight, Check } from 'lucide-react'

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">企業級算力解決方案</h1>
            <p className="text-xl text-white/80 mb-8">
              為企業提供定制的GPU算力解決方案，彈性擴展、專業支援、穩定可靠
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold transition-all shadow-xl"
            >
              諮詢方案
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">為什麼選擇企業版</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building2, title: '定製方案', desc: '根據業務需求定製算力配置' },
              { icon: Users, title: '專屬團隊', desc: '一對一技術支援服務' },
              { icon: Shield, title: '穩定可靠', desc: '99.9%服務可用性保障' },
              { icon: Headphones, title: '7x24支持', desc: '全天候技術支援' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">行業解決方案</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'AI開發企業', 
                desc: '深度學習訓練、模型開發、數據分析',
                items: ['大規模模型訓練', '分布式計算', '團隊協作工具']
              },
              { 
                title: '研究機構', 
                desc: '科學計算、模擬實驗、論文研究',
                items: ['高性能計算', '長任務支持', '數據安全保障']
              },
              { 
                title: '雲服務商', 
                desc: '算力租賃、轉售服務、OEM定製',
                items: ['API接口支持', '批量採購優惠', '白標方案']
              },
            ].map((solution, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-500 mb-6">{solution.desc}</p>
                <ul className="space-y-2">
                  {solution.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">準備好开始了嗎？</h2>
          <p className="text-gray-500 mb-8">聯繫我們的企業顧問，獲得定製方案報價</p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            聯繫顧問
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
