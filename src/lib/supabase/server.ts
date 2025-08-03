import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options })
          })
        },
      },
    }
  )
}

// サーバーサイドでのユーザー認証状態の取得
export async function getUser() {
  const supabase = await createClient()
  
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

// サーバーサイドでの認証チェック
export async function requireAuth() {
  const user = await getUser()
  
  if (!user) {
    throw new Error('認証が必要です')
  }
  
  return user
}

// サーバーサイドでのセッション取得
export async function getSession() {
  const supabase = await createClient()
  
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
