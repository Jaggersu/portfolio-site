import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// VIP 白名單
const ALLOWED_EMAILS = ['jaggersu@gmail.com']

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  
  // 處理 OAuth 回調
  if (pathname.startsWith('/auth/callback')) {
    return NextResponse.next()
  }
  
  // 如果是訪問後台頁面，檢查權限
  if (pathname.startsWith('/admin')) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet: any) => {
              cookiesToSet.forEach((cookie: any) => {
                if (cookie.name && cookie.value) {
                  request.cookies.set(cookie.name, cookie.value)
                }
              })
            },
          },
        }
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // 未登入，導向首頁
        console.warn('未登入用戶嘗試訪問後台，導向首頁')
        const homeUrl = new URL('/', request.url)
        return NextResponse.redirect(homeUrl)
      }
      
      const userEmail = session.user.email?.toLowerCase().trim()
      const userRole = session.user.user_metadata?.role
      
      // 檢查是否在 VIP 白名單中
      if (ALLOWED_EMAILS.includes(userEmail!)) {
        // VIP 用戶，檢查角色
        if (userRole !== 'admin' && userRole !== 'designer') {
          // 權限不足，導向首頁
          console.warn('VIP 用戶角色權限不足，導向首頁')
          const homeUrl = new URL('/', request.url)
          return NextResponse.redirect(homeUrl)
        }
      } else {
        // 非白名單用戶，導向未授權頁面
        console.warn('非白名單用戶嘗試訪問後台，導向未授權頁面')
        const unauthorizedUrl = new URL('/?error=unauthorized', request.url)
        return NextResponse.redirect(unauthorizedUrl)
      }
      
    } catch (error) {
      console.error('Middleware 權限檢查失敗:', error)
      // 發生錯誤時導向首頁
      const homeUrl = new URL('/', request.url)
      return NextResponse.redirect(homeUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!auth/callback|_next/static|_next/image|favicon.ico).*)'
  ]
}
