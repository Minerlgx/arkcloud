'use client'
// 使用 sessionStorage 进行本地认证，不需要 SessionProvider
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
