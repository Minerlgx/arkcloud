'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Menu, X, Globe } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const languages = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
]

export default function Navbar() {
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh-TW'
  
  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(/^\/(zh-TW|en)/, `/${locale}`)
    router.push(newPath)
  }

  const navItems = [
    { href: `/${currentLocale === 'zh-TW' ? '' : 'en'}/products`, label: t('products') },
    { href: `/${currentLocale === 'zh-TW' ? '' : 'en'}/pricing`, label: t('pricing') },
    { href: `/${currentLocale === 'zh-TW' ? '' : 'en'}/about`, label: t('about') },
    { href: `/${currentLocale === 'zh-TW' ? '' : 'en'}/contact`, label: t('contact') },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${currentLocale === 'zh-TW' ? '' : 'en'}`} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold">ArkCloud</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{currentLocale === 'zh-TW' ? '繁體' : 'EN'}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 py-2 bg-dark-card rounded-lg shadow-xl border border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-dark-border transition-colors ${
                      currentLocale === lang.code ? 'text-primary' : 'text-gray-300'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Buttons */}
            <Link 
              href={`/${currentLocale === 'zh-TW' ? '' : 'en'}/login`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t('login')}
            </Link>
            <Link 
              href={`/${currentLocale === 'zh-TW' ? '' : 'en'}/register`}
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
            >
              {t('register')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-bg border-t border-dark-border">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-dark-border flex items-center justify-between">
              <Link href="/login" className="text-gray-300">{t('login')}</Link>
              <Link href="/register" className="px-4 py-2 bg-primary rounded-lg">{t('register')}</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
