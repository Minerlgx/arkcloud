'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Eye, ArrowRight } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: 'GPU 服務器租賃價格多少合適？',
    excerpt: '全網最詳細的 GPU 服務器租賃價格分析，幫你選擇性價比最高的方案',
    category: '價格攻略',
    date: '2026-03-20',
    views: 1256,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80'
  },
  {
    id: 2,
    title: 'AI 模型訓練需要多大的 GPU 顯存？',
    excerpt: '詳細解析不同規模 AI 模型訓練的顯存需求，幫你選擇合適的 GPU 配置',
    category: '技術教程',
    date: '2026-03-18',
    views: 892,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80'
  },
  {
    id: 3,
    title: '從通用到智能：GPU 算力如何賦能千行百業',
    excerpt: 'GPU 算力在各行業的應用場景分析，包括醫療、金融、製造等領域',
    category: '行業資訊',
    date: '2026-03-15',
    views: 756,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'
  },
  {
    id: 4,
    title: '液冷算力租賃實測：電費省出個愛馬仕',
    excerpt: '液冷技術在 GPU 服務器中的應用，節能效果實測報告',
    category: '技術教程',
    date: '2026-03-10',
    views: 1023,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80'
  },
  {
    id: 5,
    title: '算力租賃 vs 自建機房：財務總監不知道的 5 個成本陷阱',
    excerpt: '很多企業選擇自建機房，但隱藏成本往往被忽視。這篇文章幫你算清真實成本',
    category: '價格攻略',
    date: '2026-03-08',
    views: 945,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80'
  },
  {
    id: 6,
    title: '2025GPU 服務器配置和報價全解析',
    excerpt: '從入門到旗艦，所有主流 GPU 服務器配置和價格一目了然',
    category: '價格攻略',
    date: '2026-03-05',
    views: 1567,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80'
  },
  {
    id: 7,
    title: 'GPU 雲服務器規格類型有哪些？',
    excerpt: '一分鐘看懂 GPU 服務器的各種規格和術語，選購不再迷茫',
    category: '使用指南',
    date: '2026-03-01',
    views: 823,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80'
  },
  {
    id: 8,
    title: '成都算力租賃熱潮：中小企業如何搭上數字經濟快車',
    excerpt: '成都作為西部算力樞紐，正在成為中小企業 AI 轉型的首選地',
    category: '行業資訊',
    date: '2026-02-25',
    views: 654,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'
  },
]

const categories = ['全部', '價格攻略', '技術教程', '行業資訊', '使用指南']

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filteredArticles = activeCategory === '全部' 
    ? articles 
    : articles.filter(a => a.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">算力資訊</h1>
          <p className="text-xl text-white/80">專業的 GPU 算力行業資訊與技術教程</p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured */}
            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={articles[0].image}
                    alt={articles[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {articles[0].category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3 group-hover:text-blue-600 transition-colors">
                    {articles[0].title}
                  </h2>
                  <p className="text-gray-500 mb-6">{articles[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {articles[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {articles[0].views} 閱讀
                    </span>
                  </div>
                  <Link 
                    href={`/news/${articles[0].id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
                  >
                    閱讀全文
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Other Articles */}
            {filteredArticles.slice(1).map((article) => (
              <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views}
                      </span>
                    </div>
                    <Link 
                      href={`/news/${article.id}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      閱讀全文 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-all">
              加載更多
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
