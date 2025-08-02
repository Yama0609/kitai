"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Message } from './message'

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export function ChatContainer() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // テスト用に認証チェックを一時的に無効化
  // if (!session) {
  //   return <div>ログインが必要です</div>
  // }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              不動産投資について何でもお聞きください！
            </div>
          )}
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              回答を生成中...
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="投資条件や質問を入力してください..."
            className="flex-1 border rounded-lg px-3 py-2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  )
}
