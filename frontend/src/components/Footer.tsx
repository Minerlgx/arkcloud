import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { getSiteContent } from '@/lib/content'

export default async function Footer() {
  const content = await getSiteContent()
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{content.company_name || '方舟雲計算'}</span>
            </div>
            <p className="text-gray-500 mb-4">{content.company_name || '方舟雲計算科技有限公司'}</p>
            <div className="space-y-2 text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{content.company_address || '桃園市中壢區龍平里龍東路 116號(1樓)'}</span>
              </div>
              <div className="text-xs text-gray-400">統一編號：{content.company_tax_id || '60345307'}</div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-500 hover:text-blue-600 transition-colors">產品列表</Link></li>
              <li><Link href="/pricing" className="text-gray-500 hover:text-blue-600 transition-colors">價格方案</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors">關於我們</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">聯繫我們</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">服務項目</h3>
            <ul className="space-y-2 text-gray-500">
              <li>GPU 雲端伺服器</li>
              <li>AI 模型訓練</li>
              <li>深度學習運算</li>
              <li>資料儲存服務</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          <p>© 2026 {content.company_name || '方舟雲計算科技有限公司'}. 版權所有.</p>
        </div>
      </div>
    </footer>
  )
}
