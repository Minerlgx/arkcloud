import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Server, Shield, Clock, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import FeaturedProducts from '@/components/FeaturedProducts'

const features = [
  { title: '極致性能', description: 'NVIDIA H100/H200 系列 GPU，釋放頂級算力', icon: Zap },
  { title: '極低延遲', description: '台灣本地數據中心，延遲低至 1ms', icon: Clock },
  { title: '彈性擴展', description: '按需選擇，即時部署，彈性擴展', icon: Server },
  { title: '專業支援', description: '7x24 技術支援，專業團隊隨時待命', icon: Shield },
]

export default function HomePage() {
  return (
    <div className="pt-20">
      <Navbar/>
      
      {/* Hero Section - 纯色背景 */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">台灣在地 GPU 雲端服務</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI 雲端運算</span>
                <br />
                <span>釋放 GPU 算力的無限可能</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                為 AI 開發者，研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務。
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold transition-all flex items-center gap-2 text-white shadow-lg shadow-blue-500/25"
                >
                  立即開始
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/about"
                  className="px-8 py-4 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-xl font-medium transition-all text-gray-700"
                >
                  了解更多
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-gray-500 text-sm">服務可用性</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">&lt;1ms</div>
                  <div className="text-gray-500 text-sm">網路延遲</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">7x24</div>
                  <div className="text-gray-500 text-sm">技術支援</div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                <Image 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80"
                  alt="GPU Server"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                />
              </div>
              
              <div className="absolute -left-8 top-1/4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">H100 已上線</div>
                    <div className="text-gray-500 text-sm">即租即用</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-1/4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">512 核心</div>
                    <div className="text-gray-500 text-sm">AMD EPYC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">為什麼選擇方舟</h2>
            <p className="text-gray-600 text-lg">專業、穩定、高效的雲端運算服務</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2 text-gray-900">熱門方案</h2>
            <p className="text-gray-600 text-lg">精選熱門 GPU 伺服器，立即部署</p>
          </div>
          
          <FeaturedProducts />
          
          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-medium transition-all text-blue-600"
            >
              查看全部方案
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80" 
            alt="Server"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-indigo-600/95"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-white">準備好釋放 AI 的力量了嗎？</h2>
          <p className="text-white/80 text-lg mb-8">
            立即開始使用方舟雲計算，享受頂級 GPU 算力帶來的無限可能
          </p>
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
