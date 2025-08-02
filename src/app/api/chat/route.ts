export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    // ダミーAI応答パターン
    const dummyResponses = [
      "こんにちは！不動産投資についてご相談いただき、ありがとうございます。どのようなことでお悩みでしょうか？",
      "承知いたしました。ご予算や希望エリアについて詳しくお聞かせください。",
      "都内でしたら、23区内と多摩地区で利回りや価格帯が大きく異なります。どちらをお考えでしょうか？", 
      "初心者の方には、まず区分マンション投資がおすすめです。管理しやすく、リスクも比較的低いです。",
      "利回り7%以上をお求めでしたら、都心部よりも郊外や地方都市を検討されることをお勧めします。",
      "物件選びで重要なのは、立地・築年数・管理状況の3つです。詳しく解説いたしましょうか？"
    ]
    
    // メッセージ内容に応じて適切なレスポンスを選択
    let response = ""
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('予算') || lowerMessage.includes('2000万')) {
      response = "2000万円のご予算でしたら、都内の区分マンションや地方の一棟物件が選択肢になります。どちらにご興味がおありでしょうか？"
    } else if (lowerMessage.includes('利回り') || lowerMessage.includes('7%')) {
      response = "利回り7%以上をお求めでしたら、地方都市の中古物件や、都内でも条件を絞った物件が候補になります。築年数との兼ね合いもございますが、いかがでしょうか？"
    } else if (lowerMessage.includes('初心者') || lowerMessage.includes('始め')) {
      response = "初心者の方には区分マンション投資から始めることをお勧めします。管理会社に任せられるため、手間が少なく安心です。まずは都内の築浅物件から検討されてはいかがでしょうか？"
    } else if (lowerMessage.includes('場所') || lowerMessage.includes('エリア') || lowerMessage.includes('地域')) {
      response = "エリア選びは投資成功の鍵ですね。都心部は安定していますが利回りは低め、郊外は利回りが高い反面リスクもあります。どちらを重視されますか？"
    } else {
      // デフォルトはランダム選択
      response = dummyResponses[Math.floor(Math.random() * dummyResponses.length)]
    }
    
    // 少し遅延を入れて自然な応答にする
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    return new Response(JSON.stringify({
      message: response,
      timestamp: new Date().toISOString(),
      type: 'ai'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify(
      { error: 'チャット処理中にエラーが発生しました' }
    ), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
