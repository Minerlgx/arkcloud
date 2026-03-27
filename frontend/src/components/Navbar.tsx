'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const navLinks = [
    { href: '/markets', label: '算力市場' },
    { href: '/pricing', label: '價格' },
    { href: '/news', label: '資訊' },
    { href: '/docs', label: '文檔' },
    { href: '/about', label: '關於我們' },
  ]

  // 认证页面不显示导航
  if (pathname === '/login' || pathname === '/register') {
    return null
  }

  const user = session?.user

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="ArkCloud" 
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold text-gray-900">方舟算力</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth/User Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.name || user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      會員中心
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      登出
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  登入
                </Link>
                <Link 
                  href="/register"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  立即註冊
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="block py-3 text-gray-600 hover:text-blue-600 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <Link href="/dashboard" className="flex-1 py-2 bg-blue-600 text-white text-center font-medium rounded-lg">
                    會員中心
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex-1 py-2 border border-gray-300 text-gray-600 text-center font-medium rounded-lg"
                  >
                    登出
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex-1 py-2 text-center text-gray-600 font-medium">
                    登入
                  </Link>
                  <Link href="/register" className="flex-1 py-2 bg-blue-600 text-white text-center font-medium rounded-lg">
                    立即註冊
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
