import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createBrowserClient(
  supabaseUrl!, 
  supabaseAnonKey!,
  {
    cookies: {
      get: (name: string) => {
        const cookie = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${name}=`))
          ?.split('=')[1]
        return cookie
      },
      set: (name: string, value: string, options?: any) => {
        // Browser client 不需要 set，因為 HttpOnly cookie 無法在 client 設定
        console.log('Cookie set called:', name, value, options)
      },
      remove: (name: string, options?: any) => {
        // Browser client 不需要 remove，因為 HttpOnly cookie 無法在 client 刪除
        console.log('Cookie remove called:', name, options)
      }
    }
  }
)
