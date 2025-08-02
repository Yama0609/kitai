export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    // 高度なダミーAI応答（文脈理解対応）
    const messageNormalized = message.toLowerCase().replace(/[、。！？]/g, ' ')
    
    // パターン別応答システム
    const patterns = [
      {
        keywords: ['収益', '下が', '減っ', '悪化', '改善', 'なんとか'],
        response: '収益低下でお困りですね。主な改善策をご提案します：①家賃見直し（相場調査・リフォーム）②空室対策（仲介手数料見直し・設備充実）③経費削減（管理会社変更・税務最適化）④物件追加投資での分散。現在の空室率や築年数を教えていただけますか？'
      },
      {
        keywords: ['空室', '入居', '借り手', '退去', '客付'],
        response: '空室対策でお悩みですね。効果的な方法をお教えします：①家賃設定の見直し（周辺相場-10%程度）②設備投資（ウォシュレット・エアコン・宅配ボックス）③仲介会社への営業強化④ネット掲載の改善。築年数と現在の家賃設定はいかがですか？'
      },
      {
        keywords: ['収益物件', '投資物件', '物件選び', '購入'],
        response: '収益物件選びですね！重要なポイントは：①立地（駅徒歩10分以内・生活利便性）②利回り（実質利回り5%以上目安）③築年数（RC造なら築20年以内）④管理状況。ご予算と希望エリアをお聞かせください。'
      },
      {
        keywords: ['予算', '資金', '融資', 'ローン', '銀行'],
        response: 'ご予算や融資についてですね。一般的に：①自己資金は物件価格の20-30%②年収の7-10倍程度まで融資可能③金利は1-3%程度④返済比率は35%以内が目安。ご年収と自己資金額の概算はいかがでしょうか？'
      },
      {
        keywords: ['初心者', '始め', 'はじめ', '経験', '勉強'],
        response: '不動産投資初心者でいらっしゃいますね。おすすめの進め方：①区分マンションから開始②築浅・駅近物件を選択③信頼できる管理会社確保④税務・法務の基礎学習⑤複数物件での分散投資。まずはご予算から検討しませんか？'
      },
      {
        keywords: ['利回り', '収益性', '儲け', '利益'],
        response: '利回りについてですね。重要な指標：①表面利回り＝年間賃料÷物件価格②実質利回り＝（年間賃料-経費）÷物件価格③都内3-5%、地方5-8%が目安④将来の資産価値も重要。現在検討中の物件はありますか？'
      },
      {
        keywords: ['リスク', '心配', '不安', '失敗'],
        response: 'リスク管理は重要ですね。主なリスクと対策：①空室リスク→立地・設備で軽減②家賃下落→相場調査・メンテナンス③災害リスク→保険加入・耐震性確認④金利上昇→固定金利検討。どのリスクが最もご心配でしょうか？'
      },
      {
        keywords: ['税金', '確定申告', '経費', '節税'],
        response: '不動産投資の税務についてですね。主なポイント：①不動産所得は総合課税②減価償却費・管理費・修繕費等が経費③青色申告で65万円控除④損益通算で給与所得と相殺可能。税理士への相談をお勧めします。'
      }
    ]
    
    // 最適な応答を検索
    let response = "ご質問をありがとうございます。不動産投資について具体的なご相談内容をお聞かせください。予算、希望エリア、投資経験などの情報があると、より詳しいアドバイスが可能です。"
    
    for (const pattern of patterns) {
      const matchCount = pattern.keywords.filter(keyword => 
        messageNormalized.includes(keyword)
      ).length
      
      if (matchCount > 0) {
        response = pattern.response
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
