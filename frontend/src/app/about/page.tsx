'use client'
import Link from 'next/link'
import { Users, Target, Award, Globe, Heart, ArrowRight } from 'lucide-react'

const team = [
  { name: '週若傑', role: '創辦人暨執行長', bio: '深耕雲端運算產業 15 年' },
  { name: '技術團隊', role: '資深工程師', bio: '平均 10 年 + 產業經驗' },
  { name: '客服團隊', role: '專業支援', bio: '7x24 小時全天候服務' },
]

const stats = [
  { value: '99.9%', label: '服務可用性' },
  { value: '500+', label: '企業客戶' },
  { value: '24/7', label: '技術支援' },
  { value: '10+', label: '年產業經驗' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">關於方舟雲計算</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            專注於為台灣地區的 AI 開發者、研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">我們的使命</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                方舟雲計算科技有限公司成立於 2025 年，總部位於台灣桃園。我們致力於降低 AI 算力門檻，
                讓更多開發者和企業能夠輕鬆使用高性能 GPU 資源。
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                通過彈性租賃模式和專業的技術支援，我們幫助客戶專注於核心業務創新，
                無需擔心基礎設施的複雜性和高昂成本。
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">客戶至上</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">品質保證</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8">
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80"
                alt="團隊"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心價值</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: '真誠服務', desc: '以客戶需求為中心，提供貼心專業的服務體驗' },
              { icon: Target, title: '追求卓越', desc: '不斷優化技術和服務，追求行業領先水準' },
              { icon: Globe, title: '創新驅動', desc: '擁抱新技術，持續創新產品和解決方案' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">團隊介紹</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {member.name[0]}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">準備好開始了嗎？</h2>
          <p className="text-gray-500 mb-8">立即註冊，享受專業 GPU 雲端服務</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              立即註冊
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 font-semibold rounded-xl transition-all"
            >
              聯繫我們
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
