const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const FETCH_TIMEOUT_MS = 20000

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
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  const { headers: optHeaders, signal: _sig, ...rest } = options

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(optHeaders && typeof optHeaders === 'object' && !(optHeaders instanceof Headers)
          ? (optHeaders as Record<string, string>)
          : {}),
      },
    })
    const contentType = res.headers.get('content-type') || ''
    let data: any = null
    try {
      data = contentType.includes('application/json') ? await res.json() : await res.text()
    } catch {
      data = null
    }

    if (!res.ok) {
      const message =
        (data && typeof data === 'object' && (data.error || data.message)) ||
        (typeof data === 'string' && data) ||
        `請求失敗 (${res.status})`
      throw new Error(message)
    }
    
    // Normalize products array
    if (data && data.products) {
      data.products = data.products.map(normalizeProduct)
    }
    if (data && data.product) {
      data.product = normalizeProduct(data.product)
    }
    
    return data
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        `请求超时（${FETCH_TIMEOUT_MS / 1000}s）。请确认后端已启动并可访问：${API_URL.replace(/\/api$/, '')}`
      )
    }
    if (err instanceof TypeError) {
      throw new Error(
        `无法连接 API：${API_URL}。请在本机终端执行：cd backend && npm run dev（默认端口 3001），并检查防火墙/代理。`
      )
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
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
