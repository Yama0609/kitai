'use client'

import { useState } from 'react'

export default function SimpleChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: 'こんにちは！不動産投資についてご相談をお受けしています。どのようなことでお困りでしょうか？',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* チャットヘッダー */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-lg font-semibold">💬 不動産投資AI相談</h2>
      </div>

      {/* メッセージエリア */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
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
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block bg-white border border-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">AIが考えています...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 入力エリア */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="不動産投資についてご質問ください"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className={`px-6 py-2 rounded-lg font-medium ${
              isLoading || !inputMessage.trim()
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'
            }`}
          >
            {isLoading ? '送信中...' : '送信'}
          </button>
        </div>
        <div className="mt-2 text-xs text-blue-600 text-center">
          💬 不動産投資のご質問をお気軽にどうぞ
        </div>
      </div>
    </div>
  )
}
