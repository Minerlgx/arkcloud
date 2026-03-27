'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Book, ChevronRight, Search, Terminal, Code, Database, Cloud } from 'lucide-react'

const docs = [
  {
    category: '快速入門',
    items: [
      { title: '帳戶註冊與登入', href: '/docs/account' },
      { title: '首次使用指南', href: '/docs/quickstart' },
      { title: '基本操作教程', href: '/docs/basic' },
    ]
  },
  {
    category: '產品使用',
    items: [
      { title: 'GPU容器實例', href: '/docs/container' },
      { title: 'GPU裸金屬服務器', href: '/docs/bms' },
      { title: '實例管理', href: '/docs/instance' },
    ]
  },
  {
    category: '開發者指南',
    items: [
      { title: 'API文檔', href: '/docs/api' },
      { title: 'SDK下載', href: '/docs/sdk' },
      { title: '示例代碼', href: '/docs/examples' },
    ]
  },
  {
    category: '帳單與計費',
    items: [
      { title: '計費說明', href: '/docs/billing' },
      { title: '付款方式', href: '/docs/payment' },
      { title: '發票申請', href: '/docs/invoice' },
    ]
  },
]

const quickLinks = [
  { icon: Terminal, title: '快速部署', desc: '一行命令部署你的AI模型', href: '/docs/quickstart' },
  { icon: Code, title: 'API文檔', desc: '完整的REST API參考', href: '/docs/api' },
  { icon: Database, title: '數據遷移', desc: '如何遷移你的數據', href: '/docs/migration' },
  { icon: Cloud, title: '最佳實踐', desc: '性能和安全性建議', href: '/docs/best-practices' },
]

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-10 h-10" />
            <h1 className="text-5xl font-bold">文檔中心</h1>
          </div>
          <p className="text-xl text-white/80 mb-8">完整的產品文檔與開發者指南</p>
          
          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文檔..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <link.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Docs Navigation */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">文檔目錄</h2>
                {docs.map((section, i) => (
                  <div key={i} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{section.category}</h3>
                    <ul className="space-y-1">
                      {section.items.map((item, j) => (
                        <li key={j}>
                          <Link
                            href={item.href}
                            className="flex items-center justify-between px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                          >
                            {item.title}
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">歡迎來到方舟算力文檔中心</h2>
                
                <div className="prose max-w-none text-gray-600">
                  <p className="mb-4">
                    這裏提供了完整的方舟算力產品使用指南與開發者文檔，幫助你快速上手我們的GPU算力服務。
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">快速開始</h3>
                  <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
                    <code className="text-green-400"># 1. 註冊帳戶</code><br/>
                    <code className="text-green-400"># 2. 選擇GPU產品</code><br/>
                    <code className="text-green-400"># 3. 部署你的應用</code><br/>
                    <code className="text-green-400"># 4. 開始使用！</code>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">常見問題</h3>
                  <div className="space-y-4">
                    {[
                      { q: '如何選擇GPU型號？', a: '根據你的實際需求選擇：推理任務推薦RTX 4090，訓練任務推薦A100/H100，大模型推薦H200。' },
                      { q: '支持哪些框架？', a: '支持PyTorch、TensorFlow、JAX等所有主流深度學習框架。' },
                      { q: '如何獲取API密鑰？', a: '登入後台，在「開發者設置」中創建API密鑰。' },
                    ].map((faq, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{faq.q}</h4>
                        <p className="text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">需要幫助？</h3>
                  <p>
                    如果你有任何問題，可以通過以下方式聯繫我們：
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>在線客服：7x24小時</li>
                    <li>郵箱：support@arkcloud.top</li>
                    <li>電話：+886-2-XXXX-XXXX</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
