'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refreshUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('ユーザー取得エラー:', error)
        setUser(null)
      } else {
        setUser(user)
      }
    } catch (error) {
      console.error('予期しないエラー:', error)
      setUser(null)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('サインアウトエラー:', error)
      } else {
        setUser(null)
        // ログアウト後はホームページにリダイレクト
        window.location.href = '/'
      }
    } catch (error) {
      console.error('予期しないエラー:', error)
    }
  }

  useEffect(() => {
    // 初期ユーザー状態を取得
    refreshUser().finally(() => setLoading(false))

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // 認証状態に応じたリダイレクト処理
        if (event === 'SIGNED_IN') {
          // ログイン成功時の処理
          const redirectTo = new URLSearchParams(window.location.search).get('redirectTo')
          window.location.href = redirectTo || '/dashboard'
        } else if (event === 'SIGNED_OUT') {
          // ログアウト時の処理
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthはAuthProvider内で使用する必要があります')
  }
  return context
}

// 認証が必要なページで使用するカスタムフック
export function useRequireAuth() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      // 未認証の場合、ログインページにリダイレクト
      const currentPath = window.location.pathname
      window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`
    }
  }, [user, loading])

  return { user, loading }
}
