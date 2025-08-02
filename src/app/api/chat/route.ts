import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    // 不動産投資専門AIアドバイザーのプロンプト
    const systemPrompt = `あなたは不動産投資の専門家AIアドバイザーです。以下の役割で回答してください：

【専門性】
- 不動産投資に関する深い知識を持つプロフェッショナル
- 初心者から上級者まで適切なレベルでアドバイス
- 実用的で具体的な情報を提供

【回答スタイル】
- 丁寧で親しみやすい口調
- 日本の不動産市場に精通
- リスクとメリットを両方説明
- 具体的な数値や例を使って説明

【重要なポイント】
- 投資にはリスクがあることを必ず伝える
- 個人の状況に応じたアドバイス
- 法的・税務的な専門事項は専門家への相談を推奨
- 200文字以内で簡潔に回答

ユーザーの質問に対して、上記の方針で回答してください。`

    // OpenAI APIに送信
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })
    
    // OpenAIからのレスポンスを取得
    const aiResponse = completion.choices[0]?.message?.content || 
                      '申し訳ございませんが、現在回答を生成できません。しばらく後に再度お試しください。'
    
    return new Response(JSON.stringify({
      message: aiResponse,
      timestamp: new Date().toISOString(),
      type: 'ai'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
  } catch (error) {
    console.error('OpenAI Chat API Error:', error)
    
    // OpenAI APIエラーの場合は詳細なエラーメッセージ
    let errorMessage = 'AIとの通信中にエラーが発生しました。しばらく後に再度お試しください。'
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AIサービスの設定に問題があります。'
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'アクセスが集中しています。少し時間をおいて再度お試しください。'
      }
    }
    
    return new Response(JSON.stringify({
      message: errorMessage,
      timestamp: new Date().toISOString(),
      type: 'error'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
