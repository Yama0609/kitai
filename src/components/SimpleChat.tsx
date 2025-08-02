export default function SimpleChat() {
  const sampleMessages = [
    {
      id: 1,
      sender: 'ai',
      message: 'こんにちは！不動産投資についてご相談をお受けしています。どのようなことでお困りでしょうか？',
      timestamp: '14:30'
    },
    {
      id: 2,
      sender: 'user',
      message: '予算2000万円で都内の投資物件を探しています。初心者なので何から始めれば良いかわかりません。',
      timestamp: '14:32'
    },
    {
      id: 3,
      sender: 'ai',
      message: '承知いたしました。2000万円のご予算でしたら、都内でも区を選べば良い物件が見つかります。まず、どちらの地域をお考えでしょうか？',
      timestamp: '14:33'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* チャットヘッダー */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-lg font-semibold">💬 不動産投資AI相談</h2>
      </div>

      {/* メッセージエリア */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {sampleMessages.map((msg) => (
          <div key={msg.id} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              <p className="text-sm">{msg.message}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 入力エリア */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="メッセージを入力（まだ送信できません）"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            disabled
          />
          <button
            className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
            disabled
          >
            送信
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          ✅ Step 2: 見た目のみ表示中（次のステップで送信機能を追加します）
        </div>
      </div>
    </div>
  )
}
