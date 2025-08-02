import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' }, 
        { status: 400 }
      )
    }

    // シンプルなテストレスポンス
    const botResponse = `こんにちは！「${message}」というメッセージを受け取りました。現在はテスト中です。
    
1000万円のご予算でしたら、以下のような物件がおすすめです：
• 都心部のワンルームマンション（利回り5-6%）
• 地方の中古アパート（利回り7-8%）
• 築浅の投資用マンション（長期安定収益）

ご希望のエリアや投資スタイルがあれば、さらに詳しくご提案できます！`

    return NextResponse.json({
      response: botResponse,
      success: true
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message }, 
      { status: 500 }
    )
  }
}
