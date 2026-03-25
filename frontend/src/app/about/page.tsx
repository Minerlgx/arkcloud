import { Building2, Users, Award, MapPin, Server as ServerIcon } from 'lucide-react'
import { getSiteContent } from '@/lib/content'
import Navbar from '@/components/Navbar'

export default async function AboutPage() {
  const content = await getSiteContent()
  
  return (
    <div className="pt-20">
      <Navbar/>
      
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80" 
            alt="Technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-indigo-900/90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">{content.about_title || '方舟雲計算科技有限公司'}</h1>
          <p className="text-xl text-white/80">{content.about_subtitle || '專業 AI 雲端運算服務提供商'}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Building2 className="w-6 h-6 text-blue-600" /> 公司介紹
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {content.about_description || '專注於為台灣地區的 AI 開發者，研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務。'}
            </p>
            <p className="text-gray-600 leading-relaxed">
              我們的數據中心位於台灣，提供極低延遲的網路連接和專業的技術支援團隊，幫助您快速部署 AI 工作負載。
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <MapPin className="w-6 h-6 text-blue-600" /> 公司資訊
            </h2>
            <div className="space-y-4">
              <div><span className="text-gray-400 text-sm">公司名稱</span><p className="text-gray-900 font-medium">{content.company_name || '方舟雲計算科技有限公司'}</p></div>
              <div><span className="text-gray-400 text-sm">統一編號</span><p className="text-gray-900 font-medium">{content.company_tax_id || '60345307'}</p></div>
              <div><span className="text-gray-400 text-sm">代表人</span><p className="text-gray-900 font-medium">{content.company_representative || '週若傑'}</p></div>
              <div><span className="text-gray-400 text-sm">登記地址</span><p className="text-gray-900 font-medium">{content.company_address || '桃園市中壢區龍平里龍東路 116號(1樓)'}</p></div>
              <div><span className="text-gray-400 text-sm">核准設立日期</span><p className="text-gray-900 font-medium">2026 年 3 月 9 日</p></div>
              <div><span className="text-gray-400 text-sm">資本總額</span><p className="text-gray-900 font-medium">新台幣 4,000,000 元</p></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ServerIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">頂級硬體</h3>
            <p className="text-gray-600">NVIDIA H100/H200 系列</p>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">專業團隊</h3>
            <p className="text-gray-600">7x24 技術支援</p>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">品質保證</h3>
            <p className="text-gray-600">99.9% 服務可用性</p>
          </div>
        </div>
      </div>
    </div>
  )
}
