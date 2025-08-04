import SimpleChat from '@/components/SimpleChat'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center space-y-6 mb-6">
            <img 
              src="/tamaki-character.png" 
              alt="TAMAKIマン" 
              className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px] rounded-full border-4 sm:border-6 border-orange-300 shadow-2xl bg-white p-2 sm:p-3"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
              不動産投資AI相談
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 font-medium">
            専門家によるAIアドバイス
          </p>
          <div className="text-sm sm:text-base lg:text-lg text-green-600 bg-green-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block font-semibold">
            🤖 リアルタイムAI相談が可能です
          </div>
        </div>
        
        <SimpleChat />
      </div>
    </main>
  )
}
