'use client'
import { useState, useEffect } from 'react'
import { Search, UserPlus, Mail, Calendar, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface User {
  id: string
  name: string | null
  email: string
  company: string | null
  role: string
  status: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await api.get('/users')
      setUsers(data.users || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.company || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">用戶管理</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
          <UserPlus className="w-5 h-5" /> 新增用戶
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="搜尋用戶..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 text-slate-400">暫無用戶</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="font-bold text-lg text-white mb-1">{user.name || '未命名用戶'}</h3>
              <p className="text-slate-400 text-sm mb-3">{user.company || '個人用戶'}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4" />{user.email}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  註冊於 {user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-TW') : 'N/A'}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {user.role === 'ADMIN' ? '管理員' : '用戶'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {user.status === 'ACTIVE' ? '活躍' : '停用'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
