import { Mail, Clock, MapPin } from 'lucide-react'
import { getSiteContent } from '@/lib/content'

export default async function ContactPage() {
  const content = await getSiteContent()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">聯繫我們</h1>
          <p className="text-xl text-white/80">有任何問題？我們隨時為您服務</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <Mail className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900">電子郵件</h3>
            <p className="text-gray-600">{content.contact_email || 'support@arkcloud.top'}</p>
            <p className="text-gray-600">{content.contact_sales || 'sales@arkcloud.top'}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <Clock className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900">服務時間</h3>
            <p className="text-gray-600">{content.contact_hours || '7x24 全年不休'}</p>
            <p className="text-gray-600">即時回覆您的需求</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <MapPin className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">公司地址</h3>
          <p className="text-gray-600">{content.company_address || '桃園市中壢區龍平里龍東路 116號(1樓)'}</p>
          <p className="text-gray-400 text-sm mt-2">{content.company_name || '方舟雲計算科技有限公司'}</p>
        </div>
      </div>
    </div>
  )
}
