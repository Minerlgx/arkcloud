'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Server, Terminal, Play, Pause, RefreshCw, Trash2, Loader2, ExternalLink } from 'lucide-react'

export default function InstanceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [instance, setInstance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    
    // 从 sessionStorage 获取实例信息
    const orderSuccess = sessionStorage.getItem('orderSuccess')
    if (orderSuccess) {
      const order = JSON.parse(orderSuccess)
      setInstance({
        id: 'INS-' + Date.now(),
        name: order.product.name,
        status: 'running',
        ip: '10.0.0.' + Math.floor(Math.random() * 255),
        port: 22,
        gpu: order.product.gpu,
        vram: order.product.vram,
        expiresAt: order.billingCycle === 'hourly' 
          ? new Date(Date.now() + 3600000)
          : new Date(Date.now() + 30 * 24 * 3600000),
      })
    } else {
      // 演示数据
      setInstance({
        id: params.id || 'INS-DEMO-001',
        name: 'H100 SXM 80GB GPU 雲端伺服器',
        status: 'running',
        ip: '10.0.0.101',
        port: 22,
        gpu: 'NVIDIA H100 SXM',
        vram: '80GB HBM3',
        expiresAt: new Date(Date.now() + 23 * 24 * 3600000),
      })
    }
    setLoading(false)
  }, [params.id])

  const handleAction = async (action: string) => {
    setActionLoading(action)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setActionLoading(null)
    
    if (action === 'start') {
      setInstance({ ...instance, status: 'running' })
    } else if (action === 'stop') {
      setInstance({ ...instance, status: 'stopped' })
    } else if (action === 'restart') {
      setInstance({ ...instance, status: 'running' })
      alert('實例重啟成功')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('已複製到剪貼板')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!instance) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">實例不存在</h2>
          <Link href="/dashboard" className="text-blue-600 hover:underline">返回會員中心</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回會員中心
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{instance.name}</h1>
              <p className="text-gray-500 text-sm mt-1">實例 ID：{instance.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              instance.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {instance.status === 'running' ? '● 運行中' : '■ 已停止'}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Instance Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Connection Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">連接資訊</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">SSH 地址</p>
                      <p className="font-mono text-lg">root@{instance.ip}:{instance.port}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(`root@${instance.ip} -p ${instance.port}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2"
                      >
                        <Terminal className="w-4 h-4" />
                        複製 SSH
                      </button>
                      <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Web SSH
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">密碼</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono">••••••••</p>
                        <button
                          onClick={() => copyToClipboard('demo-password-123')}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          複製
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Jupyter Notebook</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">http://{instance.ip}:8888</p>
                        <button
                          onClick={() => window.open(`http://${instance.ip}:8888`)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          打開
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instance Config */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">實例配置</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">GPU</p>
                    <p className="font-semibold">{instance.gpu}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-2xl mb-1">💾</div>
                    <p className="text-sm text-gray-500">顯存</p>
                    <p className="font-semibold">{instance.vram}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-2xl mb-1">⏱️</div>
                    <p className="text-sm text-gray-500">計費方式</p>
                    <p className="font-semibold">月付</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-sm text-gray-500">到期時間</p>
                    <p className="font-semibold text-sm">{instance.expiresAt.toLocaleDateString('zh-TW')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">實例操作</h2>
                <div className="space-y-3">
                  {instance.status === 'running' ? (
                    <button
                      onClick={() => handleAction('stop')}
                      disabled={!!actionLoading}
                      className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === 'stop' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Pause className="w-5 h-5" />
                      )}
                      停止實例
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction('start')}
                      disabled={!!actionLoading}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === 'start' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                      啟動實例
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleAction('restart')}
                    disabled={!!actionLoading || instance.status !== 'running'}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading === 'restart' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                    重啟實例
                  </button>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <button
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      刪除實例
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-700">
                    💡 提示：停止實例後仍會保留數據，但不會產生費用。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
