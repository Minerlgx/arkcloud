'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Eye, ArrowLeft, Share2, MessageSquare } from 'lucide-react'

const articles: Record<string, {
  title: string
  excerpt: string
  category: string
  date: string
  views: number
  image: string
  content: React.ReactNode
}> = {
  '1': {
    title: 'GPU 服務器租賃價格多少合適？',
    excerpt: '全網最詳細的 GPU 服務器租賃價格分析，幫你選擇性價比最高的方案',
    category: '價格攻略',
    date: '2026-03-20',
    views: 1256,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>GPU 服務器租賃市場魚龍混雜，價格從每小時幾元到幾十元不等。如何判斷一個價格是否合理？這篇文章給你詳細解答。</p>
        
        <h3 className="text-xl font-bold text-gray-900">一、影響價格的主要因素</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>GPU 型號：</strong>RTX 4090 約 NT$0.8/小時，A100 約 NT$2.5/小時，H100 約 NT$4-6/小時</li>
          <li><strong>顯存大小：</strong>24GB、48GB、80GB，顯存越大價格越高</li>
          <li><strong>計費方式：</strong>按時計費最貴，月付 86 折，年付 75 折</li>
          <li><strong>附加服務：</strong>是否包含存儲、帶寬、技術支持等</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">二、市場價格參考（2026 年）</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">GPU 型號</th>
                <th className="border p-3 text-right">按時計費</th>
                <th className="border p-3 text-right">月付</th>
                <th className="border p-3 text-right">年付</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">RTX 4090 24GB</td>
                <td className="border p-3 text-right">NT$0.8</td>
                <td className="border p-3 text-right">NT$480</td>
                <td className="border p-3 text-right">NT$4,320</td>
              </tr>
              <tr>
                <td className="border p-3">A100 40GB</td>
                <td className="border p-3 text-right">NT$2.0</td>
                <td className="border p-3 text-right">NT$1,200</td>
                <td className="border p-3 text-right">NT$10,800</td>
              </tr>
              <tr>
                <td className="border p-3">H100 80GB</td>
                <td className="border p-3 text-right">NT$4.5</td>
                <td className="border p-3 text-right">NT$2,700</td>
                <td className="border p-3 text-right">NT$24,300</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold text-gray-900">三、避坑指南</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>警惕超低價：低於市場價 50% 的可能有隱藏收費</li>
          <li>注意帶寬限制：有些服務商帶寬額外收費</li>
          <li>確認存儲費用：數據盤可能按 GB 另行計費</li>
          <li>了解退訂政策：中途退訂是否退款</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">四、選擇建議</h3>
        <p>根據使用場景選擇：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>短期測試（&lt;1 週）：</strong>按時計費最划算</li>
          <li><strong>中期項目（1-3 月）：</strong>月付方案</li>
          <li><strong>長期部署（&gt;3 月）：</strong>年付方案最省</li>
        </ul>
      </div>
    )
  },
  '2': {
    title: 'AI 模型訓練需要多大的 GPU 顯存？',
    excerpt: '詳細解析不同規模 AI 模型訓練的顯存需求，幫你選擇合適的 GPU 配置',
    category: '技術教程',
    date: '2026-03-18',
    views: 892,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>選擇 GPU 時，顯存大小是關鍵參數。顯存不夠會導致 OOM（Out Of Memory）錯誤，顯存太大又浪費錢。這篇文章幫你找到剛剛好的配置。</p>

        <h3 className="text-xl font-bold text-gray-900">一、模型顯存需求估算</h3>
        <p>簡單公式：<strong>顯存需求 ≈ 模型參數 × 4 bytes × (1 + 梯度 + 優化器狀態)</strong></p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm">例如：7B 參數模型</p>
          <p className="text-sm">全精度（FP32）：7B × 4B = 28GB</p>
          <p className="text-sm">加上梯度和優化器：約需 80-100GB 顯存</p>
        </div>

        <h3 className="text-xl font-bold text-gray-900">二、常見模型顯存需求</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>LLaMA 7B：</strong>推理 16GB，訓練 80GB+</li>
          <li><strong>LLaMA 13B：</strong>推理 24GB，訓練 160GB+（多卡）</li>
          <li><strong>LLaMA 70B：</strong>推理 140GB+，訓練需多卡集群</li>
          <li><strong>Stable Diffusion：</strong>推理 8GB，訓練 24GB+</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">三、顯存優化技巧</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>量化：</strong>FP16 減半顯存，INT8 再減半</li>
          <li><strong>梯度累積：</strong>用小 batch 模擬大 batch</li>
          <li><strong>ZeRO：</strong>分布式訓練優化顯存</li>
          <li><strong>激活檢查點：</strong>用計算換顯存</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">四、推薦配置</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>入門學習：</strong>RTX 4090 24GB</li>
          <li><strong>中型模型：</strong>A100 40GB/80GB</li>
          <li><strong>大型模型：</strong>H100 80GB 多卡</li>
        </ul>
      </div>
    )
  },
  '3': {
    title: '從通用到智能：GPU 算力如何賦能千行百業',
    excerpt: 'GPU 算力在各行業的應用場景分析，包括醫療、金融、製造等領域',
    category: '行業資訊',
    date: '2026-03-15',
    views: 756,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>GPU 早已不僅僅是用於圖形渲染和遊戲。在 AI 時代，GPU 算力正在重塑各行各業。</p>

        <h3 className="text-xl font-bold text-gray-900">一、醫療健康</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>醫學影像分析（CT、MRI 自動診斷）</li>
          <li>藥物研發（分子模擬、篩選）</li>
          <li>基因組學分析</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">二、金融服務</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>風險評估與欺詐檢測</li>
          <li>量化交易策略</li>
          <li>智能客服與理財顧問</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">三、製造業</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>工業視覺檢測</li>
          <li>預測性維護</li>
          <li>智能供應鏈優化</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">四、教育科研</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>氣候模擬與預測</li>
          <li>物理實驗模擬</li>
          <li>天文數據分析</li>
        </ul>
      </div>
    )
  },
  '4': {
    title: '液冷算力租賃實測：電費省出個愛馬仕',
    excerpt: '液冷技術在 GPU 服務器中的應用，節能效果實測報告',
    category: '技術教程',
    date: '2026-03-10',
    views: 1023,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>液冷技術是數據中心節能的未來。我們實測了一家液冷數據中心，結果令人驚艷。</p>

        <h3 className="text-xl font-bold text-gray-900">一、液冷 vs 風冷</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>散熱效率：</strong>液冷比風冷高 3-5 倍</li>
          <li><strong>噪音：</strong>液冷幾乎無聲，風冷噪音大</li>
          <li><strong>能耗：</strong>液冷節省 30-50% 冷卻能耗</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">二、實測數據</h3>
        <p>測試環境：8 卡 H100 服務器，滿載運行 24 小時</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>風冷數據中心：</strong>PUE 1.6，日耗電 480 度</li>
          <li><strong>液冷數據中心：</strong>PUE 1.1，日耗電 330 度</li>
          <li><strong>節省：</strong>日省 150 度電，月省 4500 度</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">三、成本分析</h3>
        <p>以台灣電價 NT$4/度計算：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>月省電費：NT$18,000</li>
          <li>年省電費：NT$216,000</li>
          <li>足夠買一個愛馬仕包包了！</li>
        </ul>
      </div>
    )
  },
  '5': {
    title: '算力租賃 vs 自建機房：財務總監不知道的 5 個成本陷阱',
    excerpt: '很多企業選擇自建機房，但隱藏成本往往被忽視。這篇文章幫你算清真實成本。',
    category: '價格攻略',
    date: '2026-03-08',
    views: 945,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>企業需要 GPU 算力時，第一個想法往往是「買設備自建」。但作為財務總監，你真的算過總成本嗎？</p>

        <h3 className="text-xl font-bold text-gray-900">陷阱一：設備折舊</h3>
        <p>GPU 設備折舊快，3 年後殘值可能只剩 20%。H100 服務器 NT$300 萬，3 年後只值 NT$60 萬。</p>

        <h3 className="text-xl font-bold text-gray-900">陷阱二：電力成本</h3>
        <p>8 卡 H100 滿載功耗 10kW，24 小時運行：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>日耗電：240 度</li>
          <li>月耗電：7,200 度</li>
          <li>月電費：NT$28,800（NT$4/度）</li>
          <li>年電費：NT$345,600</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">陷阱三：冷卻系統</h3>
        <p>精密空調、冷卻塔、備用電源，初期投入 NT$50-100 萬，每年維護費 NT$10 萬+。</p>

        <h3 className="text-xl font-bold text-gray-900">陷阱四：人力成本</h3>
        <p>需要專職運維人員，年薪 NT$60-100 萬。</p>

        <h3 className="text-xl font-bold text-gray-900">陷阱五：閒置浪費</h3>
        <p>項目結束或業務波動時，設備閒置就是純虧損。租賃可以隨時退訂。</p>

        <h3 className="text-xl font-bold text-gray-900">成本對比（3 年）</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">項目</th>
                <th className="border p-3 text-right">自建</th>
                <th className="border p-3 text-right">租賃</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">設備採購</td>
                <td className="border p-3 text-right">NT$300 萬</td>
                <td className="border p-3 text-right">NT$0</td>
              </tr>
              <tr>
                <td className="border p-3">電力（3 年）</td>
                <td className="border p-3 text-right">NT$104 萬</td>
                <td className="border p-3 text-right">包含在租金</td>
              </tr>
              <tr>
                <td className="border p-3">冷卻系統</td>
                <td className="border p-3 text-right">NT$80 萬</td>
                <td className="border p-3 text-right">NT$0</td>
              </tr>
              <tr>
                <td className="border p-3">人力（3 年）</td>
                <td className="border p-3 text-right">NT$240 萬</td>
                <td className="border p-3 text-right">NT$0</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border p-3 font-bold">總計</td>
                <td className="border p-3 text-right font-bold">NT$724 萬</td>
                <td className="border p-3 text-right font-bold">NT$300-400 萬</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-6 font-bold text-blue-600">結論：租賃可節省 40-50% 成本！</p>
      </div>
    )
  },
  '6': {
    title: '2025GPU 服務器配置和報價全解析',
    excerpt: '從入門到旗艦，所有主流 GPU 服務器配置和價格一目了然。',
    category: '價格攻略',
    date: '2026-03-05',
    views: 1567,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>2025 年 GPU 服務器市場百花齊放，從入門級 RTX 4090 到旗艦 H200，該如何選擇？這份指南幫你快速定位。</p>

        <h3 className="text-xl font-bold text-gray-900">入門級（NT$500-1000/月）</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>RTX 4090 24GB：</strong>性價比之王，適合推理和中小型模型訓練</li>
          <li><strong>RTX 4090 48GB：</strong>大顯存版本，可運行更大模型</li>
          <li><strong>適用場景：</strong>學習、開發、推理服務、小型微調</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">中端級（NT$1500-3000/月）</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>A100 40GB：</strong>經典訓練卡，生態完善</li>
          <li><strong>A100 80GB：</strong>大顯存，適合大模型</li>
          <li><strong>適用場景：</strong>模型訓練、微調、中等規模推理</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">高端級（NT$5000-10000/月）</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>H100 80GB：</strong>當前主流旗艦，性能強勁</li>
          <li><strong>H200 141GB：</strong>2025 新旗艦，顯存更大</li>
          <li><strong>適用場景：</strong>大模型訓練、高性能計算、大規模推理</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">多卡配置</h3>
        <p>8 卡服務器適合大規模訓練：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>8×4090：NT$8000-10000/月</li>
          <li>8×A100：NT$20000-25000/月</li>
          <li>8×H100：NT$70000-90000/月</li>
        </ul>
      </div>
    )
  },
  '7': {
    title: 'GPU 雲服務器規格類型有哪些？',
    excerpt: '一分鐘看懂 GPU 服務器的各種規格和術語，選購不再迷茫。',
    category: '使用指南',
    date: '2026-03-01',
    views: 823,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>GPU 服務器規格參數眾多，FP32、TF32、NVLink、IB 網絡...這些都是什麼意思？這篇文章幫你快速理解。</p>

        <h3 className="text-xl font-bold text-gray-900">一、精度類型</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>FP32（單精度）：</strong>傳統精度，通用計算</li>
          <li><strong>FP16（半精度）：</strong>AI 訓練常用，速度更快</li>
          <li><strong>BF16：</strong>Google 提出，適合深度學習</li>
          <li><strong>INT8/INT4：</strong>量化推理，速度極快</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">二、顯存類型</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>GDDR6X：</strong>消費級，如 RTX 4090</li>
          <li><strong>HBM2e：</strong>數據中心級，如 A100</li>
          <li><strong>HBM3：</strong>最新一代，如 H100/H200</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">三、互連技術</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>NVLink：</strong>NVIDIA 多卡互連，帶寬高達 600GB/s</li>
          <li><strong>PCIe 4.0/5.0：</strong>標準擴展接口</li>
          <li><strong>InfiniBand：</strong>高速網絡，適合集群</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">四、交付形式</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>容器實例：</strong>輕量化，秒級部署</li>
          <li><strong>裸金屬：</strong>物理服務器，性能最強</li>
          <li><strong>虛擬機：</strong>傳統雲服務器模式</li>
        </ul>
      </div>
    )
  },
  '8': {
    title: '成都算力租賃熱潮：中小企業如何搭上數字經濟快車',
    excerpt: '成都作為西部算力樞紐，正在成為中小企業 AI 轉型的首選地。',
    category: '行業資訊',
    date: '2026-02-25',
    views: 654,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    content: (
      <div className="space-y-6">
        <p>隨著「東數西算」工程推進，成都已成為西部重要的算力樞紐。中小企業如何抓住這一機遇？</p>

        <h3 className="text-xl font-bold text-gray-900">成都的優勢</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>電力成本低：</strong>水電資源豐富，電價低於全國平均</li>
          <li><strong>氣候適宜：</strong>年均溫 16°C，自然冷卻條件好</li>
          <li><strong>政策支持：</strong>政府補貼、稅收優惠</li>
          <li><strong>人才儲備：</strong>電子科大、川大等高校資源</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">中小企業應用案例</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>AI 初創公司：</strong>租賃 4090 集群，成本降低 60%</li>
          <li><strong>遊戲工作室：</strong>使用 GPU 渲染，交付時間縮短 50%</li>
          <li><strong>醫療影像：</strong>雲端 AI 診斷，準確率提升 30%</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900">如何選擇服務商</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>查看資質和牌照</li>
          <li>測試實際性能和網絡</li>
          <li>了解售後支持能力</li>
          <li>對比價格和合同條款</li>
        </ul>
      </div>
    )
  },
}

export default function NewsArticlePage() {
  const params = useParams()
  const id = params.id as string
  const article = articles[id]

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">文章不存在</h1>
          <Link href="/news" className="text-blue-600 hover:underline">
            ← 返回新聞列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            href="/news"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回新聞列表
          </Link>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
            {article.category}
          </span>
          <h1 className="text-4xl font-bold mt-4 mb-6">{article.title}</h1>
          <div className="flex items-center gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.views} 閱讀
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={article.image}
              alt={article.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-8">
              <div className="prose max-w-none text-gray-600">
                {article.content}
              </div>

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">分享這篇文章</span>
                  <div className="flex gap-4">
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Article */}
          <div className="mt-8">
            <Link href="/news" className="text-blue-600 hover:underline">
              ← 返回新聞列表
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
