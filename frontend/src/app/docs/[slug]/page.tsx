'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Book, ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react'

const docsContent: Record<string, { title: string; category: string; content: React.ReactNode }> = {
  // 快速入门
  account: {
    title: '帳戶註冊與登入',
    category: '快速入門',
    content: (
      <div className="space-y-6">
        <p>歡迎來到方舟算力！按照以下步驟完成帳戶註冊：</p>
        <h3 className="text-lg font-bold text-gray-900">1. 訪問註冊頁面</h3>
        <p>點擊網站右上角的「立即註冊」按鈕，或直接訪問 /register 頁面。</p>
        <h3 className="text-lg font-bold text-gray-900">2. 填寫資訊</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>電子郵件地址（將作為登入帳號）</li>
          <li>密碼（至少 8 位，包含大小寫字母和數字）</li>
          <li>確認密碼</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">3. 驗證郵箱</h3>
        <p>註冊後會收到驗證郵件，點擊連結完成驗證。</p>
        <h3 className="text-lg font-bold text-gray-900">4. 登入</h3>
        <p>使用註冊的郵箱和密碼登入即可開始使用服務。</p>
      </div>
    )
  },
  quickstart: {
    title: '首次使用指南',
    category: '快速入門',
    content: (
      <div className="space-y-6">
        <p>第一次使用方舟算力？按照這個指南快速開始：</p>
        <h3 className="text-lg font-bold text-gray-900">步驟 1：選擇產品</h3>
        <p>前往「算力市場」，根據需求選擇 GPU 容器實例或裸金屬服務器。</p>
        <h3 className="text-lg font-bold text-gray-900">步驟 2：配置環境</h3>
        <p>選擇預設鏡像或自定義配置：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>PyTorch 2.0 + CUDA 11.8</li>
          <li>TensorFlow 2.12</li>
          <li>JAX</li>
          <li>自定義 Docker 鏡像</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">步驟 3：啟動實例</h3>
        <p>確認配置後點擊「立即租用」，實例將在 1-2 分鐘內啟動。</p>
        <h3 className="text-lg font-bold text-gray-900">步驟 4：連接使用</h3>
        <p>通過 SSH 或 Jupyter Notebook 連接實例，開始你的 AI 開發。</p>
      </div>
    )
  },
  basic: {
    title: '基本操作教程',
    category: '快速入門',
    content: (
      <div className="space-y-6">
        <p>學習方舟算力的基本操作：</p>
        <h3 className="text-lg font-bold text-gray-900">實例管理</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>啟動/停止：</strong>在會員中心可以隨時啟動或停止實例</li>
          <li><strong>重啟：</strong>系統問題時可重啟實例</li>
          <li><strong>刪除：</strong>不再需要時可刪除實例（數據將丟失）</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">數據管理</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>上傳：</strong>通過 SCP 或 Web 界面上傳數據</li>
          <li><strong>下載：</strong>通過 SCP 或 Web 界面下載結果</li>
          <li><strong>快照：</strong>創建實例快照保存狀態</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">監控</h3>
        <p>在會員中心查看實例的 CPU、GPU、內存使用情況。</p>
      </div>
    )
  },
  // 產品使用
  container: {
    title: 'GPU 容器實例',
    category: '產品使用',
    content: (
      <div className="space-y-6">
        <p>GPU 容器實例提供隔離的容器化環境，適合開發和測試。</p>
        <h3 className="text-lg font-bold text-gray-900">特點</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>秒級部署，即開即用</li>
          <li>按小時計費，靈活彈性</li>
          <li>預置常用框架</li>
          <li>支持自定義鏡像</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">適用場景</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>模型開發和調試</li>
          <li>短期推理任務</li>
          <li>學習和測試</li>
        </ul>
      </div>
    )
  },
  bms: {
    title: 'GPU 裸金屬服務器',
    category: '產品使用',
    content: (
      <div className="space-y-6">
        <p>GPU 裸金屬服務器提供完整的物理服務器，適合長期訓練任務。</p>
        <h3 className="text-lg font-bold text-gray-900">特點</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>獨享物理資源，零虛擬化</li>
          <li>極致性能釋放</li>
          <li>支持 NVLink 和 IB 網絡</li>
          <li>月付/年付優惠</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">適用場景</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>大規模模型訓練</li>
          <li>長期推理服務</li>
          <li>高性能計算</li>
        </ul>
      </div>
    )
  },
  instance: {
    title: '實例管理',
    category: '產品使用',
    content: (
      <div className="space-y-6">
        <p>詳細的實例管理操作指南。</p>
        <h3 className="text-lg font-bold text-gray-900">查看實例</h3>
        <p>登入會員中心 → 我的實例，查看所有運行中的實例。</p>
        <h3 className="text-lg font-bold text-gray-900">連接實例</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>SSH：</strong><code>ssh user@instance-ip</code></li>
          <li><strong>Jupyter：</strong>點擊「打開 Jupyter」按鈕</li>
          <li><strong>Web Terminal：</strong>在網頁直接使用終端</li>
        </ul>
      </div>
    )
  },
  // 開發者指南
  api: {
    title: 'API 文檔',
    category: '開發者指南',
    content: (
      <div className="space-y-6">
        <p>方舟算力提供完整的 REST API，方便集成和自動化。</p>
        <h3 className="text-lg font-bold text-gray-900">認證</h3>
        <p>在請求頭中添加 API Key：</p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </pre>
        <h3 className="text-lg font-bold text-gray-900">主要接口</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>GET /api/instances</code> - 獲取實例列表</li>
          <li><code>POST /api/instances</code> - 創建新實例</li>
          <li><code>DELETE /api/instances/:id</code> - 刪除實例</li>
          <li><code>GET /api/products</code> - 獲取產品列表</li>
        </ul>
      </div>
    )
  },
  sdk: {
    title: 'SDK 下載',
    category: '開發者指南',
    content: (
      <div className="space-y-6">
        <p>方舟算力提供 Python SDK，簡化 API 調用。</p>
        <h3 className="text-lg font-bold text-gray-900">安裝</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <code>pip install arkcloud-sdk</code>
        </pre>
        <h3 className="text-lg font-bold text-gray-900">快速開始</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <code>{`from arkcloud import Client

client = Client(api_key='YOUR_API_KEY')

# 創建實例
instance = client.instances.create(
    product_id='rtx-4090',
    image='pytorch-2.0'
)

# 獲取實例狀態
print(instance.status)`}</code>
        </pre>
      </div>
    )
  },
  examples: {
    title: '示例代碼',
    category: '開發者指南',
    content: (
      <div className="space-y-6">
        <p>常用的代碼示例和最佳實踐。</p>
        <h3 className="text-lg font-bold text-gray-900">PyTorch 訓練示例</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import torch
import torch.nn as nn

# 檢查 GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Using device: {device}')

# 定義模型
model = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),
    nn.Linear(256, 10)
).to(device)`}</code>
        </pre>
      </div>
    )
  },
  // 帳單與計費
  billing: {
    title: '計費說明',
    category: '帳單與計費',
    content: (
      <div className="space-y-6">
        <p>了解方舟算力的計費方式。</p>
        <h3 className="text-lg font-bold text-gray-900">計費模式</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>按時計費：</strong>按實際使用時數計費</li>
          <li><strong>月付：</strong>包月享 86 折優惠</li>
          <li><strong>季付：</strong>包季享 8 折優惠</li>
          <li><strong>年付：</strong>包年享 75 折優惠</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">扣費規則</h3>
        <p>實例啟動後開始計費，停止後停止計費。餘額不足時會發送提醒。</p>
      </div>
    )
  },
  payment: {
    title: '付款方式',
    category: '帳單與計費',
    content: (
      <div className="space-y-6">
        <p>支持的付款方式：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>信用卡/借記卡</li>
          <li>銀行轉帳</li>
          <li>支付寶</li>
          <li>微信支付</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">充值</h3>
        <p>登入會員中心 → 錢包 → 充值，選擇金額和付款方式。</p>
      </div>
    )
  },
  invoice: {
    title: '發票申請',
    category: '帳單與計費',
    content: (
      <div className="space-y-6">
        <p>企業用戶可申請開具發票。</p>
        <h3 className="text-lg font-bold text-gray-900">申請流程</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>登入會員中心 → 發票管理</li>
          <li>填寫發票資訊（公司名稱、統一編號等）</li>
          <li>選擇開票金額</li>
          <li>提交申請</li>
        </ol>
        <h3 className="text-lg font-bold text-gray-900">開票時間</h3>
        <p>申請後 3-5 個工作日內開具，電子發票發送至郵箱。</p>
      </div>
    )
  },
  // 其他文檔
  migration: {
    title: '數據遷移',
    category: '開發者指南',
    content: (
      <div className="space-y-6">
        <p>將您的數據遷移到方舟算力平台。</p>
        <h3 className="text-lg font-bold text-gray-900">遷移方式</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>SCP 上傳：</strong><code>scp -r /local/path user@instance:/remote/path</code></li>
          <li><strong>rsync 同步：</strong>適合大文件斷點續傳</li>
          <li><strong>對象存儲：</strong>通過 S3 兼容接口上傳</li>
          <li><strong>FTP/SFTP：</strong>使用 FTP 客戶端上傳</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">注意事項</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>確保網絡連接穩定</li>
          <li>大文件建議使用壓縮</li>
          <li>遷移後驗證文件完整性</li>
        </ul>
      </div>
    )
  },
  'best-practices': {
    title: '最佳實踐',
    category: '開發者指南',
    content: (
      <div className="space-y-6">
        <p>使用方舟算力的最佳實踐建議。</p>
        <h3 className="text-lg font-bold text-gray-900">性能優化</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>使用混合精度訓練（AMP）可提升 2-3 倍速度</li>
          <li>數據加載使用多進程（num_workers &gt; 0）</li>
          <li>GPU 顯存不足時使用梯度累積</li>
          <li>定期保存檢查點避免進度丟失</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">成本優化</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>開發測試使用容器實例（按時計費）</li>
          <li>長期訓練使用裸金屬服務器（月付優惠）</li>
          <li>閒置時及時停止實例避免浪費</li>
          <li>使用搶占式實例可節省 50% 成本</li>
        </ul>
        <h3 className="text-lg font-bold text-gray-900">安全建議</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>定期備份重要數據</li>
          <li>不要將 API Key 寫入代碼</li>
          <li>使用 SSH 密鑰認證</li>
          <li>開啟雙重認證（2FA）</li>
        </ul>
      </div>
    )
  },
}

export default function DocPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const doc = docsContent[slug]

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">文檔不存在</h1>
          <Link href="/docs" className="text-blue-600 hover:underline">
            ← 返回文檔中心
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link 
            href="/docs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回文檔中心
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{doc.title}</h1>
          </div>
          <p className="text-white/80 text-lg">{doc.category}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="prose max-w-none text-gray-600">
              {doc.content}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
