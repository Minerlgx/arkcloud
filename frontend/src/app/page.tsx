import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Server, Shield, Clock, CheckCircle } from 'lucide-react'

export default async function HomePage() {
  const t = await getTranslations()
  
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,102,255,0.1)_0%,_transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">台灣在地 GPU 雲端服務</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">{t('hero.title')}</span>
                <br />
                <span className="text-white">{t('hero.subtitle')}</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {t('hero.description')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products"
                  className="group px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl font-semibold transition-all flex items-center gap-2 glow-primary"
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/about"
                  className="px-8 py-4 border border-gray-600 hover:border-gray-400 rounded-xl font-medium transition-colors"
                >
                  {t('hero.learnMore')}
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-dark-border">
                <div>
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-gray-500 text-sm">服務可用性</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">&lt;1ms</div>
                  <div className="text-gray-500 text-sm">網路延遲</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">7x24</div>
                  <div className="text-gray-500 text-sm">技術支援</div>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                <Image 
                  src="https://images.unsplash.com/photo-1640955014216-75201056c829?w=800&q=80"
                  alt="GPU Server"
                  fill
                  className="object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent rounded-3xl" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -left-8 top-1/4 glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-white font-medium">H100 已上線</div>
                    <div className="text-gray-500 text-sm">即租即用</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-1/4 glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-white font-medium">512 核心</div>
                    <div className="text-gray-500 text-sm">AMD EPYC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-dark-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-gray-400 text-lg">專業、穩定、高效的雲端運算服務</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.raw('features.items').map((feature: any, index: number) => (
              <div 
                key={index}
                className="group p-8 bg-dark-bg rounded-2xl border border-dark-border hover:border-primary/50 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {index === 0 && <Zap className="w-7 h-7 text-white" />}
                  {index === 1 && <Clock className="w-7 h-7 text-white" />}
                  {index === 2 && <Server className="w-7 h-7 text-white" />}
                  {index === 3 && <Shield className="w-7 h-7 text-white" />}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{t('products.title')}</h2>
              <p className="text-gray-400 text-lg">{t('products.subtitle')}</p>
            </div>
            <Link 
              href="/products"
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="group bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-primary/50 transition-all">
              <div className="relative h-48">
                <Image 
                  src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80"
                  alt="H100 Server"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary rounded-full text-sm font-medium">AI Training</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">H100 80GB SXM</h3>
                <p className="text-gray-400 text-sm mb-4">NVIDIA H100 GPU，80GB HBM3 記憶體</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">$2.50</span>
                    <span className="text-gray-500">/小時</span>
                  </div>
                  <Link href="/products/h100-80gb" className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-sm font-medium transition-colors">
                    詳情
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product Card 2 */}
            <div className="group bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-primary/50 transition-all">
              <div className="relative h-48">
                <Image 
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80"
                  alt="RTX 4090"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">Inference</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">RTX 4090 x8</h3>
                <p className="text-gray-400 text-sm mb-4">8x NVIDIA RTX 4090，192GB VRAM</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">$5.00</span>
                    <span className="text-gray-500">/小時</span>
                  </div>
                  <Link href="/products/rtx-4090-x8" className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-sm font-medium transition-colors">
                    詳情
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product Card 3 */}
            <div className="group bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-primary/50 transition-all">
              <div className="relative h-48">
                <Image 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                  alt="H200 Server"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent rounded-full text-sm font-medium">旗艦</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">H200 141GB</h3>
                <p className="text-gray-400 text-sm mb-4">最新 H200 GPU，141GB HBM3e 記憶體</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">$3.50</span>
                    <span className="text-gray-500">/小時</span>
                  </div>
                  <Link href="/products/h200-141gb" className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-sm font-medium transition-colors">
                    詳情
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/products" className="text-primary hover:text-primary/80 transition-colors">
              查看全部 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">準備好釋放 AI 的力量了嗎？</h2>
          <p className="text-gray-400 text-lg mb-8">
            立即開始使用方舟雲計算，享受頂級 GPU 算力帶來的無限可能
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl font-semibold transition-all"
          >
            立即註冊
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
