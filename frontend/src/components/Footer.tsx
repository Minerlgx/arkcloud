import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold">ArkCloud</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('company')}
            </p>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{t('address')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">統一編號：60345307</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">{tNav('products')}</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">{tNav('pricing')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">{tNav('about')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{tNav('contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">服務項目</h3>
            <ul className="space-y-2 text-gray-400">
              <li>GPU 雲端伺服器</li>
              <li>AI 模型訓練</li>
              <li>深度學習運算</li>
              <li>資料儲存服務</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-border text-center text-gray-500 text-sm">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
