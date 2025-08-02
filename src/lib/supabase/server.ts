import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Next.js のミドルウェアでcookieを設定する際のエラーを処理
            console.error('Cookie設定エラー:', error)
          }
        },
      },
    }
  )
}

// サーバーサイドでのユーザー認証状態の取得
export async function getUser() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('ユーザー取得エラー:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('予期しないエラー:', error)
    return null
  }
}

// サーバーサイドでのセッション取得
export async function getSession() {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('セッション取得エラー:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('予期しないエラー:', error)
    return null
  }
}

// 管理者権限でのクライアント作成
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // 管理者クライアントではcookieを設定しない
        },
      },
    }
  )
}