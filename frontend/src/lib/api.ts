const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

function normalizeProduct(p: any) {
  return {
    ...p,
    priceHourly: Number(p.pricehourly ?? p.priceHourly ?? 0),
    priceMonthly: Number(p.pricemonthly ?? p.priceMonthly ?? 0),
    stock: Number(p.stock ?? 10),
    featured: Boolean(p.featured),
    images: Array.isArray(p.images) ? p.images : [],
  }
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    const data = await res.json()
    
    if (!res.ok) throw new Error(data.error || data.message || '請求失敗')
    
    // Normalize products array
    if (data.products) {
      data.products = data.products.map(normalizeProduct)
    }
    if (data.product) {
      data.product = normalizeProduct(data.product)
    }
    
    return data
  } catch (err) {
    throw err
  }
}

export const api = {
  get: (endpoint: string) => fetchAPI(endpoint),
  post: (endpoint: string, data: any) => fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint: string, data: any) => fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint: string) => fetchAPI(endpoint, { method: 'DELETE' }),
}

export default api
