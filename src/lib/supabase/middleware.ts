import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // セッションのリフレッシュを試行
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    // 認証が必要なページのパス
    const protectedPaths = ['/dashboard', '/profile', '/settings']
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )

    // 認証が必要なページで未認証の場合、ログインページにリダイレクト
    if (isProtectedPath && !user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // ログインページにアクセスした際、既に認証済みの場合はダッシュボードにリダイレクト
    if (request.nextUrl.pathname === '/login' && user) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.error('認証チェックエラー:', error)
    return supabaseResponse
  }
}
