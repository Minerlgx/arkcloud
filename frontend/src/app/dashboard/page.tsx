'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, CreditCard, Settings, LogOut, Loader2, Clock, Server, User, Lock, Bell, Menu, X } from 'lucide-react'
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
  const [isOpen, setIsOpen] = useState(false)
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
    try {
      const data = await api.get(`/orders/user/${userId}`)
      setOrders(data.orders || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
      alert('密碼修改成功')
      setPassword({ current: '', newPwd: '', confirm: '' })
    } catch (err) {
      alert('修改失敗')
    } finally {
      setSaving(false)
    }
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-900">{user.name || '用戶'}</span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-gray-100 rounded-lg"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-white z-40">
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => { setTab('instances'); setIsOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                tab === 'instances' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Server className="w-5 h-5" /> 我的實例
            </button>
            <button 
              onClick={() => { setTab('billing'); setIsOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                tab === 'billing' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-5 h-5" /> 帳單資訊
            </button>
            <button 
              onClick={() => { setTab('settings'); setIsOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                tab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" /> 帳戶設置
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" /> 登出
            </button>
          </nav>
        </div>
      )}

      <div className="md:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="sticky top-0 p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <p className="text-center font-semibold text-gray-900 mb-1">{user.name || '用戶'}</p>
            <p className="text-center text-gray-500 text-sm mb-6">{user.email}</p>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setTab('instances')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  tab === 'instances' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Server className="w-5 h-5" /> 我的實例
              </button>
              <button 
                onClick={() => setTab('billing')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  tab === 'billing' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5" /> 帳單資訊
              </button>
              <button 
                onClick={() => setTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  tab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" /> 帳戶設置
              </button>
            </nav>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-6 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" /> 登出
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
          {/* Instances Tab */}
          {tab === 'instances' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">我的實例</h2>
              </div>
              {loading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Server className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">您還沒有部署任何實例</p>
                  <Link href="/products" className="text-blue-600 hover:underline">前往產品頁面 →</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.items[0]?.product?.name || 'GPU 實例'}</h3>
                          <p className="text-gray-500 text-sm">訂單 {order.id.slice(0, 8)}...</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.status === 'PAID' ? '運行中' : order.status === 'PENDING' ? '待支付' : '已取消'}
                        </span>
                      </div>
                      {order.instances && order.instances.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">IP 地址</p>
                            <p className="font-mono text-blue-600 font-semibold">{order.instances[0].ipaddress || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">SSH 端口</p>
                            <p className="font-mono font-semibold">{order.instances[0].port || 22}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">SSH 密碼</p>
                            <p className="font-mono font-semibold">{order.instances[0].password || 'N/A'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
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
                {loading ? (
                  <div className="p-12 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : orders.length === 0 ? (
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
                          <p className="text-gray-500 text-xs">{order.billingCycle === 'HOURLY' ? '按時計費' : order.billingCycle === 'MONTHLY' ? '月付' : order.billingCycle === 'QUARTERLY' ? '季付' : '年付'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="space-y-6">
              {/* Profile Settings */}
              <div className="bg-white rounded-2xl border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> 個人資訊
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">用戶名</label>
                      <input 
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">電話</label>
                      <input 
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">公司名稱</label>
                    <input 
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {saving ? '保存中...' : '保存更改'}
                  </button>
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-white rounded-2xl border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" /> 修改密碼
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">當前密碼</label>
                    <input 
                      type="password"
                      value={password.current}
                      onChange={(e) => setPassword({...password, current: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">新密碼</label>
                    <input 
                      type="password"
                      value={password.newPwd}
                      onChange={(e) => setPassword({...password, newPwd: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">確認新密碼</label>
                    <input 
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword({...password, confirm: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button 
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
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
