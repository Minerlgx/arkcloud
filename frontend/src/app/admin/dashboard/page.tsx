'use client'
import { useEffect, useState } from 'react'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Clock, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Stats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  monthlyRevenue: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalUsers: 0, totalOrders: 0, monthlyRevenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [products, users] = await Promise.all([
        api.get('/products'),
        api.get('/users')
      ])
      
      setStats({
        totalProducts: products.products?.length || 0,
        totalUsers: users.users?.length || 0,
        totalOrders: 0,
        monthlyRevenue: 0
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: '總產品數', value: stats.totalProducts, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: '註冊用戶', value: stats.totalUsers, icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: '總訂單數', value: stats.totalOrders, icon: ShoppingCart, color: 'from-orange-500 to-orange-600' },
    { label: '本月營收', value: `NT$${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-600' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">儀表板</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" /> 最新活動
        </h2>
        <p className="text-slate-400 text-center py-8">
          登入管理員帳戶後可查看完整數據
        </p>
      </div>
    </div>
  )
}
