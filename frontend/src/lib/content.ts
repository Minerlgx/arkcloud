const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function getSiteContent() {
  try {
    const res = await fetch(`${API_URL}/content`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    return await res.json()
  } catch {
    return {}
  }
}
