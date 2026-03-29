'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

let supabase: ReturnType<typeof createBrowserClient> | null = null

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xjlfnnjlyiveeyjundmu.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ze0kZVWXNmcpfbjIUjBhIg_uN8fXsdS'
    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}

interface User {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    role?: string
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = async () => {
    try {
      const client = getSupabaseClient()
      const { error } = await client.auth.signOut()
      
      if (error) {
        console.error('登出失敗:', error)
        alert('登出失敗，請稍後再試')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('登出錯誤:', error)
      alert('登出發生錯誤，請稍後再試')
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const client = getSupabaseClient()
        const { data: { session } } = await client.auth.getSession()
        
        if (!session) {
          router.push('/')
          return
        }

        const userRole = session.user.user_metadata?.role
        if (userRole !== 'admin' && userRole !== 'designer') {
          router.push('/')
          return
        }

        setUser(session.user)
      } catch (error) {
        console.error('檢查用戶狀態失敗:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 檢查檔案格式
      if (!file.type.startsWith('image/')) {
        alert('請選擇圖片檔案（PNG, JPG, GIF 等格式）')
        return
      }
      
      // 檢查檔案大小
      if (file.size > 10 * 1024 * 1024) {
        alert('檔案大小不能超過 10MB')
        return
      }
      
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('請選擇要上傳的圖片')
      return
    }

    setUploading(true)
    try {
      const client = getSupabaseClient()
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      
      const { error: uploadError } = await client.storage
        .from('portfolio-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = client.storage
        .from('portfolio-images')
        .getPublicUrl(fileName)

      alert('圖片上傳成功！')
      return publicUrl
    } catch (error) {
      console.error('上傳失敗:', error)
      alert('圖片上傳失敗，請稍後再試')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      alert('請填寫所有必填欄位')
      return
    }

    try {
      let imageUrl = null
      if (selectedFile) {
        imageUrl = await handleUpload()
        if (!imageUrl) return
      }

      // 將作品資料存入資料庫
      const client = getSupabaseClient()
      const portfolioData = {
        title: formData.title,
        description: formData.description,
        category: formData.tags || 'Uncategorized',
        image_url: imageUrl || '/next.svg', // 如果沒有上傳圖片，使用預設圖片
        created_at: new Date().toISOString()
      }
      
      const { error: dbError } = await client
        .from('portfolio')
        .insert(portfolioData as any)

      if (dbError) {
        throw dbError
      }

      alert('作品新增成功！')
      
      // 清空表單
      setFormData({ title: '', description: '', tags: '' })
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('提交表單失敗:', error)
      alert('提交失敗，請稍後再試')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#CECECE] flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#CECECE]">
      {/* Mac OS 9 Logout Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-black font-mono text-sm"
          style={{
            backgroundColor: '#DDDDDD',
            border: '1px solid #000000',
            boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
            borderRadius: '0px',
            fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
            fontSmooth: 'never',
            WebkitFontSmoothing: 'none',
            MozOsxFontSmoothing: 'grayscale',
            imageRendering: 'pixelated',
            cursor: 'pointer'
          }}
        >
          登出
        </button>
      </div>
      <div className="p-4 sm:p-8 lg:p-12">
      {/* Admin Page - Mac Window */}
      <div className="bg-[#CECECE] border-2 border-[#B0B0B0] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15),inset_1px_1px_0px_0px_rgba(255,255,255,0.8)] rounded-lg overflow-hidden">
        {/* Window Title Bar */}
        <div className="relative h-8 bg-gradient-to-b from-[#E0E0E0] to-[#CECECE] border-b-2 border-[#B0B0B0] px-3 flex items-center">
          {/* Pinstripes */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.12) 0px,
                transparent 1px,
                transparent 2px,
                rgba(0, 0, 0, 0.12) 3px
              )`,
              backgroundSize: '4px 4px'
            }}
          />
          {/* Window Controls */}
          <div className="relative z-10 flex items-center space-x-2">
            <div className="w-3 h-3 bg-white border border-[#808080]"></div>
            <div className="w-3 h-3 bg-white border border-[#808080]"></div>
            <div className="w-3 h-3 bg-white border border-[#808080]"></div>
          </div>
          {/* Window Title */}
          <div className="relative z-10 flex-1 text-center text-sm text-gray-700 font-medium" 
               style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.1)' }}>
            Studio 99+ - 後台管理
          </div>
        </div>
        
        {/* Window Content */}
        <div className="bg-white">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2" 
                  style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.1)' }}>
                後台管理
              </h1>
              <p className="text-gray-600">新增和管理您的作品集項目</p>
            </div>

            <div className="bg-[#F8F8F8] border-2 border-[#D0D0D0] rounded-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-6" 
                  style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.1)' }}>
                新增作品
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    作品標題 *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#D0D0D0] rounded-md focus:ring-2 focus:ring-[#808080] focus:border-[#808080] outline-none transition-colors text-base bg-white"
                    placeholder="請輸入作品標題"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    作品描述 *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-[#D0D0D0] rounded-md focus:ring-2 focus:ring-[#808080] focus:border-[#808080] outline-none transition-colors resize-none text-base bg-white"
                    placeholder="請輸入作品描述"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    標籤
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#D0D0D0] rounded-md focus:ring-2 focus:ring-[#808080] focus:border-[#808080] outline-none transition-colors text-base bg-white"
                    placeholder="請輸入標籤，用逗號分隔（如：品牌設計, UI, 現代）"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    作品圖片
                  </label>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-full sm:w-3/4 lg:w-1/2">
                        <div 
                          className="flex items-center justify-center w-full h-32 sm:h-40 border-2 border-[#D0D0D0] border-dashed rounded-lg hover:border-[#B0B0B0] transition-colors cursor-pointer bg-[#F8F8F8]"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {previewUrl ? (
                            <div className="relative w-full h-full">
                              <img
                                src={previewUrl}
                                alt="預覽"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                <span className="text-white text-sm">點擊更換圖片</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-4">
                              <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-600">
                                點擊上傳圖片
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF (最大 10MB)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ title: '', description: '', tags: '' })
                      setSelectedFile(null)
                      setPreviewUrl(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 border-2 border-[#D0D0D0] text-gray-700 rounded-md hover:bg-[#E0E0E0] transition-colors text-base font-medium"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full sm:w-auto px-6 py-3 text-black font-mono text-sm"
                    style={{
                      backgroundColor: '#DDDDDD',
                      border: '1px solid #000000',
                      boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
                      borderRadius: '0px',
                      fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                      fontSmooth: 'never',
                      WebkitFontSmoothing: 'none',
                      MozOsxFontSmoothing: 'grayscale',
                      imageRendering: 'pixelated',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      opacity: uploading ? 0.6 : 1
                    }}
                  >
                    {uploading ? '上傳中...' : '新增作品'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
