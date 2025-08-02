import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ChatContainer } from '@/components/chat/chat-container'

export default async function Home() {
  // テスト用に認証チェックを一時的に無効化
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   redirect('/auth/signin')
  // }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          不動産投資AI相談 (テスト版)
        </h1>
        <div className="text-center mb-4 text-gray-600">
          ※現在は認証なしでテスト中です
        </div>
        <ChatContainer />
      </div>
    </main>
  )
}
