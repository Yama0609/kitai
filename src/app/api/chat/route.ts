// Step 7: OpenAI API本格統合 - 不動産投資AI相談システム
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    if (!message || message.trim().length === 0) {
      return new Response(JSON.stringify({
        message: '質問内容を入力してください。不動産投資に関するどんなことでもお聞かせください！',
        timestamp: new Date().toISOString(),
        type: 'error',
        step: 7
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    // テスト用の改良された不動産投資アドバイス（現在デモモード）
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'test-key-for-development' || true) {
      
      // ユーザーの質問に応じたカスタマイズされたアドバイス
      let specificAdvice = ''
      const messageText = message.toLowerCase()
      
      // 地域別特化アドバイス（札幌・北海道）
      if (messageText.includes('札幌') || messageText.includes('北海道')) {
        if (messageText.includes('8') || messageText.includes('８') || messageText.includes('利回り') || messageText.includes('収益')) {
          specificAdvice = `
**🏔️ 札幌8%利回り物件 投資分析**

1. **札幌市場の現状** - 人口約196万人、安定した賃貸需要
2. **8%利回りの実現性** - 中央区6-8%、西区・東区8-10%が相場
3. **推奨投資エリア**
   - 中央区（大通・すすきの）：観光・ビジネス需要
   - 北区（札幌駅周辺）：交通利便性抜群
   - 豊平区：住環境良好、ファミリー需要

4. **季節要因の考慮** - 暖房費込み家賃が一般的（月+5,000-15,000円）

**札幌特有のリスク＆対策**
- **除雪・雪害対策**: 年間10-20万円の除雪費用を想定
- **暖房設備投資**: ガス暖房推奨（灯油より管理楽）
- **学生需要活用**: 北海道大学（北18条）周辺は安定需要
- **観光需要**: 中央区は民泊転用可能性あり（法的確認必要）

**💰 札幌8%物件の収支例**
物件価格: 2,500万円
家賃収入: 年200万円（月16.7万円）
表面利回り: 8.0%
実質利回り: 約6.5%（除雪費・管理費控除後）`
        } else {
          specificAdvice = `
**🏔️ 札幌不動産投資 完全ガイド**

1. **立地戦略** - 地下鉄沿線重視
   - 南北線：さっぽろ〜真駒内
   - 東西線：宮の沢〜新さっぽろ
   - 東豊線：栄町〜福住

2. **物件タイプ別 家賃相場**
   - 1K: 3.5-5.5万円（学生・単身者向け）
   - 1LDK: 5-8万円（若年カップル向け）
   - 2-3LDK: 7-12万円（ファミリー向け）

3. **北海道特有の建物仕様**
   - 二重窓・断熱材強化必須
   - セントラルヒーティング導入物件が人気
   - 駐車場確保重要（1台分必須）

4. **管理費用** - 本州より高め（除雪・暖房管理費）`
        }
      } else if (messageText.includes('買いたい') || messageText.includes('購入') || messageText.includes('欲しい') || messageText.includes('かう')) {
        specificAdvice = `
**物件購入のステップ**
1. **資金計画の確立** - 自己資金と借入額を明確に
2. **物件選定基準** - 立地・築年数・収益性を重視
3. **物件調査** - 現地確認と周辺環境チェック
4. **収支シミュレーション** - 家賃収入と維持費を計算`
      } else if (messageText.includes('予算') || messageText.includes('資金') || messageText.includes('お金')) {
        specificAdvice = `
**資金計画のポイント**
1. **自己資金20-30%** - 物件価格の2-3割準備
2. **諸費用8-10%** - 登記費用・仲介手数料等
3. **運転資金** - 空室・修繕費用の備え
4. **ローン金利** - 現在1-3%程度で推移`
      } else if (messageText.includes('利回り') || messageText.includes('収益') || messageText.includes('儲け')) {
        specificAdvice = `
**利回りの基本知識**
1. **表面利回り** - 年間家賃収入÷物件価格×100
2. **実質利回り** - (年間家賃-経費)÷(物件価格+諸費用)×100
3. **目安基準** - 都心部5-7%、地方7-10%
4. **注意点** - 高利回りは高リスクの可能性`
      } else {
        specificAdvice = `
**不動産投資の基本戦略**
1. **立地重視** - 駅徒歩10分以内、人口増加エリア
2. **物件タイプ** - ワンルーム、ファミリー向けの選択
3. **管理方法** - 自主管理vs管理会社委託
4. **出口戦略** - 売却タイミングの計画`
      }
      
      return new Response(JSON.stringify({
        message: `ご質問「${message}」にお答えします！

🏢 **不動産投資AI相談 - デモモード**

${specificAdvice}

**⚠️ リスク管理も重要です**
- 空室リスク：稼働率85-90%を想定
- 金利上昇リスク：固定金利も検討
- 災害リスク：保険加入は必須
- 法的リスク：法改正への対応

**📊 収益シミュレーション例**
物件価格：3,000万円
家賃収入：年240万円（月20万円）
表面利回り：8.0%
実質利回り：約6.0%（諸経費控除後）

**次のステップ**
1. 具体的な予算設定
2. 希望エリアの絞り込み
3. 物件情報収集開始
4. 金融機関への事前相談

*投資判断は最終的にご自身の責任で行ってください。詳細は不動産投資の専門家にご相談することをお勧めします。*

---
現在はデモモードで動作中です。より詳細な分析機能準備中です！`,
        timestamp: new Date().toISOString(),
        type: 'ai',
        step: 7,
        isDemo: true,
        model: 'demo-mode'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    // 不動産投資専用のシステムプロンプト（実際のOpenAI API使用時）
    const systemPrompt = `あなたは日本の不動産投資に特化した専門のAIアドバイザーです。以下の特徴でユーザーに価値ある情報を提供してください：

【専門分野】
- 日本の不動産投資市場分析
- 物件評価と収益計算
- 税制優遇と節税対策
- 融資戦略とリスク管理
- 市場動向と将来予測

【回答スタイル】
1. 親しみやすく、わかりやすい日本語で回答
2. 具体的な数値例や計算方法を提示
3. リスクと注意点も必ず説明
4. 初心者にも理解しやすい説明を心がける
5. 必要に応じて次のステップを提案

【重要な注意事項】
- 投資にはリスクが伴うことを明記
- 個別の投資判断は最終的にユーザー自身の責任
- 法的・税務的な詳細は専門家への相談を推奨
- 市場予測は過去のデータに基づく推測であることを明示

【回答形式】
- 結論を先に述べる
- 理由を3つ以内で整理
- 具体例があれば提示
- 次のアクションを提案`

    // OpenAI APIに送信
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const aiResponse = completion.choices[0]?.message?.content || '申し訳ございません。回答の生成中にエラーが発生しました。もう一度お試しください。'
    
    // Step 7の本格的なAI応答
    return new Response(JSON.stringify({
      message: aiResponse,
      timestamp: new Date().toISOString(),
      type: 'ai',
      step: 7,
      isDemo: false,
      model: 'gpt-4o-mini',
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
  } catch (error: unknown) {
    console.error('Step 7 OpenAI API Error:', error)
    
    // OpenAI APIエラーの詳細処理
    let errorMessage = '申し訳ございません。AI応答の生成中にエラーが発生しました。'
    let errorCode = 'unknown'
    let errorType = 'api_error'
    
    // エラーオブジェクトの型安全なチェック
    if (error && typeof error === 'object' && 'code' in error) {
      const apiError = error as { code?: string; type?: string }
      errorCode = apiError.code || 'unknown'
      errorType = apiError.type || 'api_error'
      
      if (apiError.code === 'insufficient_quota') {
        errorMessage = 'APIクォータが不足しています。しばらく時間をおいてからお試しください。'
      } else if (apiError.code === 'rate_limit_exceeded') {
        errorMessage = 'リクエスト制限に達しました。少し時間をおいてからお試しください。'
      } else if (apiError.code === 'invalid_api_key') {
        errorMessage = 'システム設定に問題があります。管理者にお問い合わせください。'
      }
    }
    
    return new Response(JSON.stringify({
      message: errorMessage,
      timestamp: new Date().toISOString(),
      type: 'error',
      step: 7,
      error_code: errorCode,
      error_type: errorType
    }), {
      status: 200, // ユーザー向けエラーは200で返す
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
