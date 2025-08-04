import SimpleChat from '@/components/SimpleChat'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src="/tamaki-character.png" 
              alt="TAMAKIマン" 
              className="w-20 h-20 rounded-full border-4 border-orange-300 shadow-lg bg-white p-2"
            />
            <h1 className="text-4xl font-bold text-gray-800">
              不動産投資AI相談
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            専門家によるAIアドバイス
          </p>
          <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full inline-block">
            🤖 リアルタイムAI相談が可能です
          </div>
        </div>
        
        <SimpleChat />
      </div>
    </main>
  )
}
