'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="ArkCloud Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">
              ARKCLOUD
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
              產品方案
            </Link>
            <Link href="/pricing" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
              價格
            </Link>
            <Link href="/about" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
              關於我們
            </Link>
            <Link href="/contact" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
              聯繫我們
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
              登入
            </Link>
            <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25">
              立即註冊
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
