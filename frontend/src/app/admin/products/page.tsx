'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, Search, X, Loader2, Upload } from 'lucide-react'
import api from '@/lib/api'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  gpu: string
  vram: string
  cpu: string
  ram: string
  storage: string
  network: string
  datacenter: string
  priceHourly: number
  priceMonthly: number
  stock: number
  featured: boolean
  images: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [form, setForm] = useState({
    name: '', slug: '', category: 'Inference', description: '', gpu: '', vram: '', 
    cpu: '', ram: '', storage: '', network: '', datacenter: 'Taiwan (Taoyuan)',
    priceHourly: '', priceMonthly: '', stock: '', featured: false,
    image: '',
    imageChanged: false
  })

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const data = await api.get('/products')
      setProducts(data.products || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
      const msg = err instanceof Error ? err.message : '載入產品失敗'
      setFetchError(msg)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const compressImageToDataUrl = async (file: File): Promise<string> => {
    // 后端当前可能仍有限制 JSON 请求体大小；这里把图片压到尽量小，避免 PayloadTooLargeError
    // 后台表格缩略图显示很小（~48px），没必要传大图；给足安全余量
    const targetMaxBytes = 25000 // 经验值：尽量压到 < 25KB（更稳）
    const maxDim = 320

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('图片加载失败'))
        img.src = src
      })

    const bytesFromDataUrl = (dataUrl: string) => {
      // data:[mime];base64,<payload>
      const base64 = dataUrl.split(',')[1] || ''
      // base64 字符数约等于 bytes * 4/3
      return Math.ceil((base64.length * 3) / 4)
    }

    const objectUrl = URL.createObjectURL(file)
    try {
      const img = await loadImage(objectUrl)

      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height)
        width = Math.max(1, Math.round(width * scale))
        height = Math.max(1, Math.round(height * scale))
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas 初始化失败')

      ctx.drawImage(img, 0, 0, width, height)

      // 从较高质量开始，超出目标就逐步降质量
      let quality = 0.8
      let dataUrl = canvas.toDataURL('image/jpeg', quality)
      let approxBytes = bytesFromDataUrl(dataUrl)

      for (let i = 0; i < 7 && approxBytes > targetMaxBytes && quality > 0.18; i++) {
        quality = Math.max(0.18, quality - 0.1)
        dataUrl = canvas.toDataURL('image/jpeg', quality)
        approxBytes = bytesFromDataUrl(dataUrl)
      }

      if (approxBytes > targetMaxBytes) {
        throw new Error('圖片壓縮後仍過大，請換更小的圖片')
      }

      return dataUrl
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSizeBytes = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSizeBytes) {
      alert('圖片大小超過 5MB，請換一張更小的圖')
      return
    }
    
    setUploading(true)
    try {
      const compressed = await compressImageToDataUrl(file)
      setForm({ ...form, image: compressed, imageChanged: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : '上傳失敗'
      alert(msg.includes('PayloadTooLarge') ? '图片太大，后台无法接收（请换更小的图）' : msg)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.gpu) {
      alert('請填寫產品名稱和GPU型號')
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        description: form.description,
        gpu: form.gpu,
        vram: form.vram,
        cpu: form.cpu,
        ram: form.ram,
        storage: form.storage,
        network: form.network,
        datacenter: form.datacenter,
        priceHourly: parseFloat(form.priceHourly) || 0,
        priceMonthly: parseFloat(form.priceMonthly) || 0,
        stock: parseInt(form.stock) || 10,
        featured: form.featured
      }
      
      let productId = editingProduct?.id
      
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload)
        productId = editingProduct.id
      } else {
        const result = await api.post('/products', payload)
        productId = result.product?.id
      }
      
      // Upload image if set (only for new base64 images)
      if (form.imageChanged && form.image && productId && form.image.startsWith('data:')) {
        await api.post('/products/upload', { image: form.image, productId })
      }
      
      await fetchProducts()
      closeModal()
      alert(editingProduct ? '產品已更新' : '產品已新增')
    } catch (err: any) {
      console.error('Save error:', err)
      alert(err.message || '保存失敗')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'Inference',
      description: product.description || '',
      gpu: product.gpu || '',
      vram: product.vram || '',
      cpu: product.cpu || '',
      ram: product.ram || '',
      storage: product.storage || '',
      network: product.network || '',
      datacenter: product.datacenter || 'Taiwan (Taoyuan)',
      priceHourly: String(product.priceHourly || 0),
      priceMonthly: String(product.priceMonthly || 0),
      stock: String(product.stock || 10),
      featured: Boolean(product.featured),
      image: Array.isArray(product.images) ? product.images[0] || '' : '',
      imageChanged: false
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個產品嗎？')) return
    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
    } catch (err) { alert('刪除失敗') }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setForm({ name: '', slug: '', category: 'Inference', description: '', gpu: '', vram: '', cpu: '', ram: '', storage: '', network: '', datacenter: 'Taiwan (Taoyuan)', priceHourly: '', priceMonthly: '', stock: '', featured: false, image: '', imageChanged: false })
  }

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.gpu || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">產品管理</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> 新增產品
        </button>
      </div>

      {fetchError && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
          <p className="font-semibold text-white mb-1">無法載入產品列表</p>
          <p className="text-sm mb-3 whitespace-pre-wrap opacity-90">{fetchError}</p>
          <button
            type="button"
            onClick={() => fetchProducts()}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            重試
          </button>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="搜尋產品..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>目前沒有產品</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-dark-card rounded-xl border border-dark-border">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr className="text-left text-gray-400 text-sm">
                <th className="px-6 py-4 font-semibold">縮圖</th>
                <th className="px-6 py-4 font-semibold">產品名稱</th>
                <th className="px-6 py-4 font-semibold">GPU</th>
                <th className="px-6 py-4 font-semibold">分類</th>
                <th className="px-6 py-4 font-semibold">價格</th>
                <th className="px-6 py-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">無圖</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{product.name || '未命名'}</td>
                  <td className="px-6 py-4 text-gray-400">{product.gpu || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">{product.category || 'Inference'}</span>
                  </td>
                  <td className="px-6 py-4 text-blue-400 font-semibold">NT${(product.priceHourly || 0).toFixed(2)}/hr</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingProduct ? '編輯產品' : '新增產品'}</h2>
              <button onClick={closeModal}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">產品圖片</label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <Upload className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageSelect} 
                    className="hidden" 
                    id="image-upload"
                    ref={fileInputRef}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl cursor-pointer transition-colors text-white"
                  >
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    <span className="text-sm font-medium">{form.image ? '更換圖片' : '上傳圖片'}</span>
                  </label>
                  <p className="text-gray-500 text-xs mt-2">支援 JPG、PNG，最大 5MB</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">產品名稱 *</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GPU *</label>
                <input 
                  value={form.gpu} 
                  onChange={(e) => setForm({...form, gpu: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">VRAM</label>
                <input 
                  value={form.vram} 
                  onChange={(e) => setForm({...form, vram: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CPU</label>
                <input 
                  value={form.cpu} 
                  onChange={(e) => setForm({...form, cpu: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">RAM</label>
                <input 
                  value={form.ram} 
                  onChange={(e) => setForm({...form, ram: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">存儲</label>
                <input 
                  value={form.storage} 
                  onChange={(e) => setForm({...form, storage: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">網絡</label>
                <input 
                  value={form.network} 
                  onChange={(e) => setForm({...form, network: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">分類</label>
                <select 
                  value={form.category} 
                  onChange={(e) => setForm({...form, category: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                >
                  <option value="Inference">Inference</option>
                  <option value="Training">Training</option>
                  <option value="AI Training">AI Training</option>
                  <option value="Visualization">Visualization</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">價格/小時 (NT$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={form.priceHourly} 
                  onChange={(e) => setForm({...form, priceHourly: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">價格/月 (NT$)</label>
                <input 
                  type="number" 
                  step="1" 
                  value={form.priceMonthly} 
                  onChange={(e) => setForm({...form, priceMonthly: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">庫存</label>
                <input 
                  type="number" 
                  value={form.stock} 
                  onChange={(e) => setForm({...form, stock: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
                <input 
                  value={form.slug} 
                  onChange={(e) => setForm({...form, slug: e.target.value})} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                  placeholder="自動生成"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({...form, description: e.target.value})} 
                  rows={3} 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" 
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.featured} 
                    onChange={(e) => setForm({...form, featured: e.target.checked})} 
                    className="w-5 h-5 rounded border-gray-600 text-blue-500" 
                  />
                  <span className="text-sm font-medium text-gray-300">設為熱門產品</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSubmit} 
                disabled={saving} 
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                {saving ? '保存中...' : '保存'}
              </button>
              <button 
                onClick={closeModal} 
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-800"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
