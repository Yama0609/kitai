export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    // 一時的なダミーAI応答（OpenAIクォータ問題回避）
    const responses = {
      '収益物件': '収益物件投資をお考えですね！まず、どちらの地域をご検討でしょうか？都内は利回り3-5%程度ですが安定性が高く、地方は7-10%の高利回りが期待できますが空室リスクもあります。ご予算やリスク許容度をお聞かせください。',
      '予算': 'ご予算に応じて最適な投資戦略をご提案いたします。2000万円程度でしたら都内の区分マンションや地方の一棟アパートが選択肢になります。まず、どの程度の利回りを目指されていますか？',
      '初心者': '不動産投資初心者の方には区分マンション投資をお勧めします。管理会社に任せられるため手間が少なく、少額から始められます。まずは築10年以内、駅徒歩10分以内の物件から検討されてはいかがでしょうか？',
      '利回り': '利回りは重要な指標ですね。表面利回りだけでなく、管理費・修繕費・税金を差し引いた実質利回りで判断することが大切です。また、将来の資産価値も考慮して総合的に評価しましょう。',
      'リスク': '不動産投資の主なリスクは空室リスク、家賃下落リスク、災害リスクです。立地選定、適切な家賃設定、火災・地震保険加入で軽減できます。投資は余裕資金で行い、複数物件への分散投資も効果的です。'
    }
    
    // メッセージ内容に応じた応答
    let response = "ご質問をありがとうございます。不動産投資について具体的なご相談内容をお聞かせください。予算、希望エリア、投資経験などの情報があると、より詳しいアドバイスが可能です。"
    
    for (const [keyword, answer] of Object.entries(responses)) {
      if (message.includes(keyword) || message.toLowerCase().includes(keyword.toLowerCase())) {
        response = answer
        break
      }
    }
    
    // 自然な遅延
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
    return new Response(JSON.stringify({
      message: '申し訳ございません。一時的にエラーが発生しています。しばらく後に再度お試しください。',
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
