import { createServerClient } from '@supabase/ssr'
import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    try {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: (name: string) => {
              const cookie = cookieStore.get(name)
              return cookie?.value
            },
            set: (name: string, value: string, options: any) => {
              try {
                cookieStore.set({
                  name,
                  value,
                  ...options,
                  httpOnly: true,
                  sameSite: 'lax',
                  path: '/',
                  secure: process.env.NODE_ENV === 'production'
                })
              } catch (error) {
                console.error('Cookie set error:', error)
              }
            },
            remove: (name: string, options: any) => {
              try {
                cookieStore.delete({
                  name,
                  ...options,
                  path: '/'
                })
              } catch (error) {
                console.error('Cookie delete error:', error)
              }
            },
          },
        }
      )
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Session 交換失敗:', error)
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
      }

      if (!data.session) {
        console.error('Session 交換成功但無 session 資料')
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
      }

      // VIP 白名單檢查
      const ALLOWED_EMAILS = ['jaggersu@gmail.com']
      const userEmail = data.session.user.email?.toLowerCase().trim()
      
      if (!userEmail) {
        console.error('無法取得使用者 Email')
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
      }
      
      console.log('Email 比對:', { userEmail, allowed: ALLOWED_EMAILS.includes(userEmail) })
      
      // 根據 VIP 狀態導向不同頁面
      if (ALLOWED_EMAILS.includes(userEmail)) {
        console.log('VIP 使用者，導向後台')
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        console.log('非 VIP 使用者，導向首頁')
        return NextResponse.redirect(new URL('/', request.url))
      }
      
    } catch (error) {
      console.error('Callback 處理錯誤:', error)
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }
  }

  // 沒有 code，導向首頁
  return NextResponse.redirect(new URL('/', request.url))
}
