import Link from 'next/link'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo.png" alt="ArkCloud Logo" className="h-12 w-auto" />
              <span className="text-2xl font-bold">ARKCLOUD</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              方舟雲計算科技有限公司專注於為台灣地區的 AI 開發者、研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務。
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>桃園市中壢區龍平里龍東路 116號(1樓)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>support@arkcloud.top</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>7x24 全年不休</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">快速連結</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">產品方案</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">價格方案</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">關於我們</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">聯繫我們</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">服務項目</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400">GPU 雲端伺服器</span></li>
              <li><span className="text-gray-400">AI 模型訓練</span></li>
              <li><span className="text-gray-400">深度學習運算</span></li>
              <li><span className="text-gray-400">資料儲存服務</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 方舟雲計算科技有限公司. 版權所有.
          </p>
          <p className="text-gray-500 text-sm">
            統一編號：60345307
          </p>
        </div>
      </div>
    </footer>
  )
}
