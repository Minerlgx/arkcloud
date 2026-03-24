import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Server, Shield, Clock, CheckCircle } from 'lucide-react'

const features = [
  { title: '極致性能', description: 'NVIDIA H100/H200 系列 GPU，釋放頂級算力', icon: Zap },
  { title: '極低延遲', description: '台灣本地數據中心，延遲低至 1ms', icon: Clock },
  { title: '彈性擴展', description: '按需選擇，即時部署，彈性擴展', icon: Server },
  { title: '專業支援', description: '7x24 技術支援，專業團隊隨時待命', icon: Shield },
]

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">台灣在地 GPU 雲端服務</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                <span className="gradient-text">AI 雲端運算</span>
                <br />
                <span>釋放 GPU 算力的無限可能</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                為 AI 開發者、研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務。
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products"
                  className="group px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl font-semibold transition-all flex items-center gap-2 text-white shadow-lg shadow-primary/30"
                >
                  立即開始
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/about"
                  className="px-8 py-4 border-2 border-gray-300 hover:border-primary rounded-xl font-medium transition-colors text-gray-700 hover:text-primary"
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
                  src="https://images.unsplash.com/photo-1640955014216-75201056c829?w=800&q=80"
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
                    <Server className="w-5 h-5 text-primary" />
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
                className="group p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            <h2 className="text-4xl font-bold mb-2 text-gray-900">GPU 伺服器方案</h2>
            <p className="text-gray-600 text-lg">從 RTX 4090 到 H200 全系列覆蓋</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48">
                <Image 
                  src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80"
                  alt="H100 Server"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary rounded-full text-sm font-medium text-white">AI訓練</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">H100 80GB SXM</h3>
                <p className="text-gray-500 text-sm mb-4">NVIDIA H100 GPU，80GB HBM3 記憶體</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">NT$2.50</span>
                    <span className="text-gray-400">/小時</span>
                  </div>
                  <Link href="/products" className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary text-sm font-medium transition-colors">
                    詳情
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48">
                <Image 
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80"
                  alt="RTX 4090"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium text-white">推理</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">RTX 4090 x8</h3>
                <p className="text-gray-500 text-sm mb-4">8x NVIDIA RTX 4090，192GB VRAM</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">NT$5.00</span>
                    <span className="text-gray-400">/小時</span>
                  </div>
                  <Link href="/products" className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary text-sm font-medium transition-colors">
                    詳情
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48">
                <Image 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                  alt="H200 Server"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent rounded-full text-sm font-medium text-white">旗艦</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">H200 141GB</h3>
                <p className="text-gray-500 text-sm mb-4">最新 H200 GPU，141GB HBM3e 記憶體</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">NT$3.50</span>
                    <span className="text-gray-400">/小時</span>
                  </div>
                  <Link href="/products" className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary text-sm font-medium transition-colors">
                    詳情
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">準備好釋放 AI 的力量了嗎？</h2>
          <p className="text-white/80 text-lg mb-8">
            立即開始使用方舟雲計算，享受頂級 GPU 算力帶來的無限可能
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-xl font-semibold transition-all"
          >
            立即註冊
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
