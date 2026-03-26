'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  gpu: string
  vram: string
  priceHourly: number
  featured: boolean
  images: string[]
}

const categoryMap: Record<string, string> = {
  'Inference': '推理',
  'Training': '訓練',
  'AI Training': 'AI訓練',
  'Visualization': '視覺化'
}

const categoryColor: Record<string, string> = {
  'Inference': 'bg-secondary',
  'Training': 'bg-primary',
  'AI Training': 'bg-primary',
  'Visualization': 'bg-accent'
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      // api.get 已经在 lib/api.ts 里做了 JSON 解析
      const data = await api.get('/products')

      // 获取 featured 产品
      const featured = (data.products || [])
        .filter((p: any) => p.featured)
        .slice(0, 3)
        .map((p: any) => ({
          ...p,
          priceHourly: Number(p.pricehourly || p.priceHourly || 0)
        }))
      
      setProducts(featured)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link 
          key={product.id} 
          href={`/products/${product.slug}`}
          className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
        >
          <div className="relative h-48">
            {product.images?.[0] ? (
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 ${categoryColor[product.category] || 'bg-primary'} rounded-full text-sm font-medium text-white`}>
                {categoryMap[product.category] || product.category}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">NT${product.priceHourly.toFixed(2)}</span>
                <span className="text-gray-400">/小時</span>
              </div>
              <span className="flex items-center gap-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary text-sm font-medium transition-colors">
                詳情 <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
