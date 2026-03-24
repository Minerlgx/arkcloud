'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    router.push('/')
    window.location.reload()
  }

  const user = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-light-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ArkCloud</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">產品列表</Link>
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">關於我們</Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">聯繫我們</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">會員中心</Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 transition-colors">登出</button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary transition-colors">登錄</Link>
                <Link href="/register" className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors text-white">
                  註冊
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-light-border">
          <div className="px-6 py-4 space-y-4">
            <Link href="/products" className="block text-gray-600" onClick={() => setIsOpen(false)}>產品列表</Link>
            <Link href="/about" className="block text-gray-600" onClick={() => setIsOpen(false)}>關於我們</Link>
            <Link href="/contact" className="block text-gray-600" onClick={() => setIsOpen(false)}>聯繫我們</Link>
            <div className="pt-4 border-t border-light-border flex items-center justify-between">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600" onClick={() => setIsOpen(false)}>會員中心</Link>
                  <button onClick={handleLogout} className="text-red-500">登出</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600" onClick={() => setIsOpen(false)}>登錄</Link>
                  <Link href="/register" className="px-4 py-2 bg-primary rounded-lg text-white">註冊</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
