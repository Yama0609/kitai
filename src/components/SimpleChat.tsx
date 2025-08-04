'use client'

import { useState, useRef, useEffect } from 'react'

interface PropertyRecommendation {
  property: {
    name: string;
    price: number;
    grossYield: number;
    layout: string;
    floorArea: number;
    location: {
      city: string;
      ward: string;
    };
  };
  matchScore: number;
  recommendation: string;
}

interface AIAnalysis {
  investorLevel: string;
  maxPropertyPrice: number;
  recommendedYield: {
    min: number;
    max: number;
  };
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
  propertyRecommendations?: PropertyRecommendation[];
  aiAnalysis?: AIAnalysis;
  extractedProfile?: Record<string, unknown>;
}

interface ConversationState {
  sessionId?: string;
  conversationState?: Record<string, unknown>;
}

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      message: 'こんにちは！TAMAKIです 🏠✨\n\nみなさんの不動産投資をサポートする、AI投資アドバイザーのTAMAKIです！一緒に最適な投資戦略を見つけましょう！\n\n**まずは、あなたの現在の状況を教えてください：**\n\n💰 年収はどのくらいですか？\n📈 不動産投資の経験はありますか？\n🎯 どのような投資目標をお持ちですか？\n\nなんでも気軽に話しかけてくださいね！TAMAKIが全力でサポートします 😊',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<ConversationState>({})
  const [isComposing, setIsComposing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: conversation.sessionId,
          conversationState: conversation.conversationState
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // 会話状態を更新
        setConversation({
          sessionId: data.sessionId,
          conversationState: data.conversationState
        })
        
        const aiMessage: Message = {
          id: Date.now() + 1,
          sender: 'ai',
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          propertyRecommendations: data.propertyRecommendations,
          aiAnalysis: data.aiAnalysis,
          extractedProfile: data.extractedProfile
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        message: '申し訳ございません。一時的にエラーが発生しています。しばらく後に再度お試しください。',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // プロファイル表示コンポーネント
  const ProfileDisplay = ({ aiAnalysis }: { aiAnalysis: AIAnalysis }) => (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 my-2 border-l-4 border-blue-500">
      <h4 className="font-semibold text-sm text-gray-700 mb-2">📊 あなたの投資家プロファイル</h4>
      <div className="text-xs text-gray-600 space-y-1">
        <div>🎯 レベル: <span className="font-medium">{aiAnalysis.investorLevel}</span></div>
        <div>💰 推奨価格: <span className="font-medium">{aiAnalysis.maxPropertyPrice?.toLocaleString()}万円以下</span></div>
        <div>📈 目標利回り: <span className="font-medium">{aiAnalysis.recommendedYield?.min}-{aiAnalysis.recommendedYield?.max}%</span></div>
      </div>
    </div>
  )

  // 物件推薦カード表示コンポーネント
  const PropertyCard = ({ property, matchScore, recommendation }: { property: PropertyRecommendation['property'], matchScore: number, recommendation: string }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-3 my-2 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm text-gray-800">{property.name}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          matchScore >= 80 ? 'bg-green-100 text-green-800' :
          matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {matchScore}点
        </span>
      </div>
      <div className="text-xs text-gray-600 space-y-1">
        <div>📍 {property.location.city}{property.location.ward}</div>
        <div>💰 {property.price.toLocaleString()}万円 | 📊 利回り{property.grossYield}%</div>
        <div>🏠 {property.layout} | {property.floorArea}㎡</div>
        <div className="text-blue-600 mt-2">{recommendation}</div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* チャットヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center space-x-3">
                            <img 
                    src="/tamaki-character.svg" 
                    alt="TAMAKIマン" 
                    className="w-12 h-12 rounded-full border-2 border-orange-200 shadow-md bg-white p-1"
                  />
          <div>
            <h2 className="text-lg font-semibold">🏠 TAMAKIマン - AI不動産投資アドバイザー</h2>
            <p className="text-sm text-orange-100 mt-1">一緒に最適な投資戦略を見つけましょう！</p>
          </div>
        </div>
      </div>

      {/* 会話状態インジケーター */}
      {conversation.sessionId && (
        <div className="bg-orange-50 px-4 py-2 text-xs text-orange-700 border-b">
          🏠 TAMAKIマンがサポート中 | 会話履歴を記憶しています
        </div>
      )}

      {/* メッセージエリア */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-6 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-xs lg:max-w-2xl ${
              msg.sender === 'user' ? 'text-right' : 'text-left'
            } ${msg.sender === 'ai' ? 'flex items-start space-x-3' : ''}`}>
              
              {/* TAMAKIマンアバター（AIメッセージのみ） */}
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0">
                  <img 
                    src="/tamaki-character.svg" 
                    alt="TAMAKIマン" 
                    className="w-12 h-12 rounded-full border-2 border-orange-300 shadow-md bg-white p-1"
                  />
                </div>
              )}
              
              <div className="flex-1">
                {/* メッセージバブル */}
                <div className={`px-4 py-3 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {/* TAMAKIマン名前表示 */}
                  {msg.sender === 'ai' && (
                    <div className="text-xs text-orange-600 font-semibold mb-1 flex items-center">
                      🏠 TAMAKIマン
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                  <div className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>

              {/* AI分析結果表示 */}
              {msg.sender === 'ai' && msg.aiAnalysis && (
                <ProfileDisplay aiAnalysis={msg.aiAnalysis} />
              )}

              {/* 物件推薦カード表示 */}
              {msg.sender === 'ai' && msg.propertyRecommendations && msg.propertyRecommendations.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">🎯 お勧め物件</h4>
                  {msg.propertyRecommendations.map((rec: PropertyRecommendation, index: number) => (
                    <PropertyCard 
                      key={index}
                      property={rec.property}
                      matchScore={rec.matchScore}
                      recommendation={rec.recommendation}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block bg-white border border-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">AI分析中...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {/* クイック質問ボタン */}
        <div className="mb-3 flex flex-wrap gap-2">
          <div className="text-xs text-gray-600 mb-1 w-full">💡 TAMAKIマンへの質問例：</div>
          {['年収600万、初心者です！', '札幌で2000万円以下で', '利回り8%以上を目指したい', '物件を比較してほしい'].map((quickMsg) => (
            <button
              key={quickMsg}
              onClick={() => setInputMessage(quickMsg)}
              className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
              disabled={isLoading}
            >
              {quickMsg}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              placeholder="投資の目標、現在の状況、物件の希望条件など、なんでもお聞かせください..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                // IME入力中（日本語変換中）は送信しない
                if (isComposing) {
                  return
                }
                
                // Ctrl+Enterで送信
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault()
                  sendMessage()
                }
                
                // 単純なEnterは改行（デフォルト動作）
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
              <span>💡 Ctrl+Enterで送信、Enterで改行</span>
              <span className={inputMessage.length > 500 ? 'text-red-500' : 'text-gray-400'}>
                {inputMessage.length}/500
              </span>
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim() || inputMessage.length > 500}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isLoading || !inputMessage.trim() || inputMessage.length > 500
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>分析中</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>送信</span>
                <span>✨</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
