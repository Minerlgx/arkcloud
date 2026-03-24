'use client'
import { useState, useEffect } from 'react'
import { Save, FileText, MessageSquare, Building2, Loader2, Check } from 'lucide-react'
import api from '@/lib/api'

export default function ContentPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [content, setContent] = useState({
    company_name: '方舟雲計算科技有限公司',
    company_tax_id: '60345307',
    company_representative: '週若傑',
    company_address: '桃園市中壢區龍平里龍東路 116號(1樓)',
    about_title: '方舟雲計算科技有限公司',
    about_description: '專注於為台灣地區的 AI 開發者，研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務。',
    about_subtitle: '專業 AI 雲端運算服務提供商',
    contact_email: 'support@arkcloud.top',
    contact_sales: 'sales@arkcloud.top',
    contact_hours: '7x24 全年不休',
  })

  useEffect(() => { fetchContent() }, [])

  const fetchContent = async () => {
    try {
      const data = await api.get('/content')
      setContent(prev => ({ ...prev, ...data }))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSave = async (key: string) => {
    setSaving(key)
    try {
      await api.put(`/content/${key}`, { value: content[key as keyof typeof content] })
      setTimeout(() => setSaving(null), 1000)
    } catch (err) { 
      alert('保存失敗')
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">內容管理</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <Building2 className="w-5 h-5 text-blue-500" /> 公司資訊
          </h2>
          <div className="space-y-4">
            {[
              { key: 'company_name', label: '公司名稱' },
              { key: 'company_tax_id', label: '統一編號' },
              { key: 'company_representative', label: '代表人' },
              { key: 'company_address', label: '登記地址' },
            ].map(item => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{item.label}</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={content[item.key as keyof typeof content]}
                    onChange={(e) => setContent({...content, [item.key]: e.target.value})}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                  <button 
                    onClick={() => handleSave(item.key)}
                    disabled={saving === item.key}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      saving === item.key 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {saving === item.key ? <Check className="w-5 h-5" /> : '保存'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Us */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-blue-500" /> 關於我們
          </h2>
          <div className="space-y-4">
            {[
              { key: 'about_title', label: '標題' },
              { key: 'about_subtitle', label: '副標題' },
            ].map(item => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{item.label}</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={content[item.key as keyof typeof content]}
                    onChange={(e) => setContent({...content, [item.key]: e.target.value})}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                  <button 
                    onClick={() => handleSave(item.key)}
                    disabled={saving === item.key}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      saving === item.key 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {saving === item.key ? <Check className="w-5 h-5" /> : '保存'}
                  </button>
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">公司介紹</label>
              <div className="flex gap-2">
                <textarea 
                  value={content.about_description}
                  onChange={(e) => setContent({...content, about_description: e.target.value})}
                  rows={3}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
                <button 
                  onClick={() => handleSave('about_description')}
                  disabled={saving === 'about_description'}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors self-start ${
                    saving === 'about_description' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {saving === 'about_description' ? <Check className="w-5 h-5" /> : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5 text-blue-500" /> 聯繫方式
          </h2>
          <div className="space-y-4">
            {[
              { key: 'contact_email', label: '客服郵箱' },
              { key: 'contact_sales', label: '銷售郵箱' },
              { key: 'contact_hours', label: '服務時間' },
            ].map(item => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{item.label}</label>
                <div className="flex gap-2">
                  <input 
                    type={item.key.includes('email') ? 'email' : 'text'}
                    value={content[item.key as keyof typeof content]}
                    onChange={(e) => setContent({...content, [item.key]: e.target.value})}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                  <button 
                    onClick={() => handleSave(item.key)}
                    disabled={saving === item.key}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      saving === item.key 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {saving === item.key ? <Check className="w-5 h-5" /> : '保存'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
