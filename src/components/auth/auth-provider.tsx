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
      }
      // サインアウト後、ユーザー状態をクリア
      setUser(null)
    } catch (error) {
      console.error('サインアウト中の予期しないエラー:', error)
    }
  }

  useEffect(() => {
    // 初期ユーザー状態の取得
    refreshUser().finally(() => setLoading(false))

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const value: AuthContextType = {
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
    throw new Error('useAuth は AuthProvider 内で使用する必要があります')
  }
  return context
}

// ログイン状態チェック用のフック
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!loading && !user && !redirecting) {
      setRedirecting(true)
      window.location.href = '/login'
    }
  }, [user, loading, redirecting])

  return { user, loading: loading || redirecting }
}