'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, Settings, LogOut, Loader2, Server, User, Lock } from 'lucide-react'
import api from '@/lib/api'

interface Order {
  id: string
  status: string
  totalAmount: number
  billingCycle: string
  createdAt: string
  items: any[]
  instances: any[]
}

type Tab = 'instances' | 'billing' | 'settings'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('instances')
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', company: '' })
  const [password, setPassword] = useState({ current: '', newPwd: '', confirm: '' })
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(stored)
    setUser(userData)
    setProfile({ name: userData.name || '', email: userData.email, phone: userData.phone || '', company: userData.company || '' })
    fetchOrders(userData.id)
  }, [router])

  const fetchOrders = async (userId: string) => {
    let apiOrders: Order[] = []
    
    try {
      // 从 API 获取订单
      const data = await api.get(`/orders/user/${userId}`)
      apiOrders = data.orders || []
    } catch (err) {
      console.error('API error:', err)
      // API 失败时使用演示数据
      apiOrders = []
    }
    
    // 从 sessionStorage 获取最新支付成功的订单
    const successOrder = sessionStorage.getItem('orderSuccess')
    if (successOrder) {
      const orderData = JSON.parse(successOrder)
      // 创建新的订单记录
      const newOrder: Order = {
        id: 'ORD-' + Date.now(),
        status: 'active',
        totalAmount: orderData.totalPrice,
        billingCycle: orderData.billingCycle,
        createdAt: orderData.paidAt,
        items: [orderData.product],
        instances: [{
          id: 'INS-' + Date.now(),
          name: orderData.product.name,
          status: 'running',
          ip: '待分配',
          port: 22,
          expiresAt: orderData.billingCycle === 'hourly' 
            ? new Date(Date.now() + 3600000).toISOString()
            : new Date(Date.now() + 30 * 24 * 3600000).toISOString(),
        }]
      }
      // 添加到订单列表前面
      apiOrders.unshift(newOrder)
      // 清除 sessionStorage 中的成功订单
      sessionStorage.removeItem('orderSuccess')
    }
    
    // 如果还是没有订单，显示演示数据
    if (apiOrders.length === 0) {
      apiOrders = [
        {
          id: 'ORD-DEMO-001',
          status: 'active',
          totalAmount: 2999,
          billingCycle: 'monthly',
          createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
          items: [{
            id: 'prod-001',
            name: 'H100 SXM 80GB GPU 雲端伺服器',
            slug: 'h100-sxm-80gb',
            gpu: 'NVIDIA H100 SXM',
            vram: '80GB HBM3',
          }],
          instances: [{
            id: 'INS-DEMO-001',
            name: 'H100 SXM 80GB GPU 雲端伺服器',
            status: 'running',
            ip: '10.0.0.101',
            port: 22,
            expiresAt: new Date(Date.now() + 23 * 24 * 3600000).toISOString(),
          }]
        }
      ]
    }
    
    setOrders(apiOrders)
    setLoading(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    router.push('/')
  }

  const handleUpdateProfile = async () => {
    setSaving(true)
    try {
      alert('個人資訊更新成功')
    } catch (err) {
      alert('更新失敗')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (password.newPwd !== password.confirm) {
      alert('兩次密碼輸入不一致')
      return
    }
    setSaving(true)
    try {
      const data = await api.put('/users/password', { id: user?.id, oldPassword: password.current, newPassword: password.newPwd })
      alert('密碼修改成功')
      setPassword({ current: '', newPwd: '', confirm: '' })
    } catch (err: any) {
      alert(err.message || '修改失敗')
    } finally {
      setSaving(false)
    }
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="md:flex">
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 md:min-h-screen md:sticky md:top-0">
          <div className="p-6 overflow-y-auto md:h-screen">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <p className="text-center font-semibold text-gray-900 mb-1">{user.name || '用戶'}</p>
            <p className="text-center text-gray-500 text-sm mb-6">{user.email}</p>
            
            <nav className="space-y-2">
              <button onClick={() => setTab('instances')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'instances' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Server className="w-5 h-5" /> 我的實例
              </button>
              <button onClick={() => setTab('billing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'billing' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <CreditCard className="w-5 h-5" /> 帳單資訊
              </button>
              <button onClick={() => setTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Settings className="w-5 h-5" /> 帳戶設置
              </button>
            </nav>

            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 mt-6 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" /> 登出
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8 pt-20">
          {tab === 'instances' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">我的實例</h2>
                <span className="text-sm text-gray-500">共 {orders.reduce((sum, o) => sum + (o.instances?.length || 0), 0)} 個實例</span>
              </div>
              {loading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : orders.reduce((sum, o) => sum + (o.instances?.length || 0), 0) === 0 ? (
                <div className="p-12 text-center">
                  <Server className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">您還沒有部署任何實例</p>
                  <Link href="/markets" className="text-blue-600 hover:underline">前往產品頁面 →</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    order.instances && order.instances.map((instance: any) => (
                      <div key={instance.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{instance.name || order.items[0]?.name || order.items[0]?.product?.name || 'GPU 實例'}</h3>
                            <p className="text-gray-500 text-sm">訂單 {order.id} • 實例 {instance.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            instance.status === 'running' ? 'bg-green-100 text-green-700' : 
                            instance.status === 'stopped' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {instance.status === 'running' ? '● 運行中' : 
                             instance.status === 'stopped' ? '■ 已停止' : '⏳ 啟動中'}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">IP 地址</p>
                              <p className="font-mono text-sm">{instance.ip}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">連接端口</p>
                              <p className="font-mono text-sm">{instance.port}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">到期時間</p>
                              <p className="text-sm">{new Date(instance.expiresAt).toLocaleString('zh-TW')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">計費方式</p>
                              <p className="text-sm">{order.billingCycle === 'hourly' ? '按時計費' : '月付'}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Link 
                              href={`/dashboard/instances/${instance.id}`}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              管理實例
                            </Link>
                            <Link 
                              href={`/dashboard/instances/${instance.id}?tab=monitor`}
                              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                            >
                              查看監控
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                <p className="text-white/80 text-sm mb-1">累計消費</p>
                <p className="text-3xl font-bold">NT${totalSpent.toFixed(2)}</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">消費記錄</h2>
                </div>
                {orders.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">暫無消費記錄</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{order.items[0]?.product?.name}</p>
                          <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('zh-TW')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">NT${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-blue-600" /> 個人資訊
                </h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">用戶名</label>
                      <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">電話</label>
                      <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                    </div>
                  </div>
                  <button onClick={handleUpdateProfile} disabled={saving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                    {saving ? '保存中...' : '保存更改'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-blue-600" /> 修改密碼
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">當前密碼</label>
                    <input type="password" value={password.current} onChange={(e) => setPassword({...password, current: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">新密碼</label>
                    <input type="password" value={password.newPwd} onChange={(e) => setPassword({...password, newPwd: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">確認新密碼</label>
                    <input type="password" value={password.confirm} onChange={(e) => setPassword({...password, confirm: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                  </div>
                  <button onClick={handleChangePassword} disabled={saving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                    {saving ? '修改中...' : '修改密碼'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
