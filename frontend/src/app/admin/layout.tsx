'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Users, FileText, LogOut, Menu, X } from 'lucide-react'

const menuItems = [
  { href: '/admin/dashboard', label: '儀表板', icon: LayoutDashboard },
  { href: '/admin/products', label: '產品管理', icon: Package },
  { href: '/admin/users', label: '用戶管理', icon: Users },
  { href: '/admin/content', label: '內容管理', icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const admin = sessionStorage.getItem('admin')
    if (!admin && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [pathname, router])

  const handleLogout = () => {
    sessionStorage.removeItem('admin')
    router.push('/admin')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <button 
        className="md:hidden fixed top-4 left-4 z-[60] p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white shadow-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">管理後台</h2>
          <nav className="space-y-2">
            {menuItems.map(item => (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === item.href 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            登出
          </button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <main className="md:ml-64 p-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  )
}
