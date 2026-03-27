'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/markets', label: '算力市場' },
    { href: '/pricing', label: '價格' },
    { href: '/news', label: '資訊' },
    { href: '/docs', label: '文檔' },
    { href: '/about', label: '關於我們' },
  ]

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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
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
              <Link href="/login" className="flex-1 py-2 text-center text-gray-600 font-medium">
                登入
              </Link>
              <Link href="/register" className="flex-1 py-2 bg-blue-600 text-white text-center font-medium rounded-lg">
                立即註冊
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
