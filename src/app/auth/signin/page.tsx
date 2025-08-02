"use client"

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            不動産投資AI相談にログイン
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-gray-600">
            現在、認証機能は開発中です。<br/>
            テスト用として、ダミーユーザーでアクセスできるよう準備中です。
          </p>
          <div className="text-center">
            <a
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
