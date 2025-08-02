export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏢 不動産投資AI相談
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            最小構成版（まずは表示確認）
          </p>
          <div className="text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full inline-block">
            ✅ Step 1: 基本表示テスト
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">動作確認</h2>
          <p className="text-gray-600">
            このページが表示されれば、Next.jsが正常に動作しています。
            <br/>
            次はチャット機能を段階的に追加していきます。
          </p>
        </div>
      </div>
    </main>
  )
}
