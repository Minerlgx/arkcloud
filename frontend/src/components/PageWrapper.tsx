'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 后台页面不显示导航
  const isAdmin = pathname?.startsWith('/admin')
  
  // 还没挂载时不渲染任何内容，避免闪烁
  if (!mounted) {
    return <>{children}</>
  }
  
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  )
}
