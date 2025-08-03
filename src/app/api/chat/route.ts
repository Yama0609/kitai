// Step 8: 高度なAI会話フロー統合システム - 投資家プロファイル管理
import OpenAI from 'openai'
import { ConversationManager } from '@/lib/ai-features/conversation-flow'
import { PropertyMatcher } from '@/lib/ai-features/property-matcher'
import { classifyInvestor } from '@/lib/ai-features/investor-profile'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, sessionId, conversationState } = await request.json()
    
    if (!message || message.trim().length === 0) {
      return new Response(JSON.stringify({
        message: '質問内容を入力してください。不動産投資に関するどんなことでもお聞かせください！',
        timestamp: new Date().toISOString(),
        type: 'error',
        step: 8
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    // セッション管理
    const sessionKey = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const conversationManager = new ConversationManager(sessionKey, conversationState)
    
    // ユーザーメッセージを記録
    conversationManager.addMessage({
      role: 'user',
      content: message
    })
    
    // プロファイル情報の抽出と更新
    const extractedInfo = conversationManager.updateProfileFromMessage(message)
    const currentState = conversationManager.getState()
    
    // 次の質問の取得
    const nextQuestion = conversationManager.getNextQuestion()
    let propertyRecommendations: Array<{
      property: { 
        name: string; 
        price: number; 
        grossYield: number; 
        netYield: number;
        layout: string; 
        floorArea: number; 
        location: { 
          city: string; 
          ward?: string; 
          nearestStation: string; 
          walkingMinutes: number; 
        };
        investmentHighlights: string[];
      };
      matchScore: number;
      recommendation: string;
      reasons: string[];
      warnings: string[];
    }> = []
    let aiAnalysis: {
      investorLevel: string;
      maxPropertyPrice: number;
      recommendedYield: { min: number; max: number };
      characteristics: string[];
    } | null = null

    // 物件推薦フェーズの場合
    if (currentState.phase === 'property_search' || currentState.phase === 'detailed_advice') {
      const classification = classifyInvestor(currentState.profile)
      propertyRecommendations = PropertyMatcher.getRecommendations(currentState.profile, 3)
      
      aiAnalysis = {
        investorLevel: classification.level,
        maxPropertyPrice: classification.maxPropertyPrice,
        recommendedYield: classification.recommendedYieldRange,
        characteristics: classification.characteristics
      }
    }

    // デモモード（基本機能フル動作）
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'test-key-for-development') {
      
      // 会話フローに基づく応答生成
      let response = nextQuestion || '投資に関してご質問をお聞かせください。'
      
      // 物件推薦カードを追加
      if (propertyRecommendations.length > 0) {
        const propertyCards = propertyRecommendations.map(match => {
          const property = match.property
          return `
**🏢 ${property.name}**
📍 ${property.location.city}${property.location.ward} (${property.location.nearestStation}徒歩${property.location.walkingMinutes}分)
💰 価格: ${property.price.toLocaleString()}万円
📊 利回り: 表面${property.grossYield}% / 実質${property.netYield}%
🏠 ${property.layout} / ${property.floorArea}㎡
⭐ マッチ度: ${match.matchScore}点/100点

**推薦理由:**
${match.reasons.map(r => `• ${r}`).join('\n')}

**投資ポイント:**
${property.investmentHighlights.slice(0, 2).map(h => `• ${h}`).join('\n')}
${match.warnings.length > 0 ? `\n⚠️ ${match.warnings[0]}` : ''}
`
        }).join('\n---\n')
        
        response += `\n\n**🎯 あなたにお勧めの物件**\n\n${propertyCards}`
      }

      // AI分析情報を追加
      if (aiAnalysis) {
        const levelNames: Record<string, string> = {
          'beginner': 'ビギナー投資家',
          'experienced': '経験豊富な投資家',
          'semi-pro': 'セミプロ投資家', 
          'pro': 'プロ投資家'
        }
        
        response += `\n\n**📊 あなたの投資家プロファイル**
🎯 レベル: ${levelNames[aiAnalysis.investorLevel] || aiAnalysis.investorLevel}
💰 推奨物件価格: ${aiAnalysis.maxPropertyPrice.toLocaleString()}万円以下
📈 目標利回り: ${aiAnalysis.recommendedYield.min}-${aiAnalysis.recommendedYield.max}%

**特徴:**
${aiAnalysis.characteristics.map(c => `• ${c}`).join('\n')}`
      }

      // AIメッセージを記録
      conversationManager.addMessage({
        role: 'assistant',
        content: response,
        metadata: {
          phase: currentState.phase,
          extractedInfo,
          suggestions: propertyRecommendations.map(p => p.property.name)
        }
      })
      
      return new Response(JSON.stringify({
        message: response,
        timestamp: new Date().toISOString(),
        type: 'ai',
        step: 8,
        isDemo: true,
        model: 'enhanced-conversation-flow',
        sessionId: sessionKey,
        conversationState: conversationManager.getSerializableState(),
        extractedProfile: extractedInfo,
        propertyRecommendations: propertyRecommendations.map(match => ({
          property: match.property,
          matchScore: match.matchScore,
          recommendation: match.recommendation
        })),
        aiAnalysis
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    // 高度なOpenAI統合（会話履歴とプロファイル考慮）
    const conversationHistory = currentState.conversationHistory.slice(-10) // 最新10件のみ
    
    const enhancedSystemPrompt = `あなたは日本の不動産投資に特化した専門のAIアドバイザーです。

【ユーザープロファイル】
- 投資家レベル: ${aiAnalysis?.investorLevel || 'unknown'}
- 年収: ${currentState.profile.annualIncome || 'unknown'}万円
- 投資経験: ${currentState.profile.experienceYears || 'unknown'}年
- 投資目標: ${currentState.profile.investmentGoal || 'unknown'}
- 予算範囲: ${currentState.profile.budgetRange ? `${currentState.profile.budgetRange.min}-${currentState.profile.budgetRange.max}万円` : 'unknown'}

【現在の会話フェーズ】
${currentState.phase} (ステップ ${currentState.step})

【専門分野】
- 投資家レベル別の戦略提案
- 札幌・北海道不動産市場分析
- 個人最適化された物件推薦
- リスク評価と管理戦略
- 具体的な収支シミュレーション

【回答スタイル】
1. ユーザーのレベルに合わせた説明
2. 会話の流れを考慮した自然な対話
3. 具体的な数値と根拠を提示
4. リスクの透明性を重視
5. 次のステップを明確に提案

【重要事項】
- 投資判断は最終的にユーザー自身の責任
- 法的・税務的詳細は専門家相談を推奨
- 市場予測の不確実性を明示`

    // 会話履歴をメッセージ形式に変換
    const messages = [
      { role: "system" as const, content: enhancedSystemPrompt },
      ...conversationHistory.map(msg => ({
        role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: msg.content
      })),
      { role: "user" as const, content: message }
    ]

    // OpenAI APIに送信
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1200,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const aiResponse = completion.choices[0]?.message?.content || '申し訳ございません。回答の生成中にエラーが発生しました。もう一度お試しください。'
    
    // AIメッセージを記録
    conversationManager.addMessage({
      role: 'assistant',
      content: aiResponse,
      metadata: {
        phase: currentState.phase,
        extractedInfo,
        suggestions: propertyRecommendations.map(p => p.property.name)
      }
    })
    
    // Step 8の高度なAI応答
    return new Response(JSON.stringify({
      message: aiResponse,
      timestamp: new Date().toISOString(),
      type: 'ai',
      step: 8,
      isDemo: false,
      model: 'gpt-4o-mini-enhanced',
      sessionId: sessionKey,
      conversationState: conversationManager.getSerializableState(),
      extractedProfile: extractedInfo,
      propertyRecommendations: propertyRecommendations.map(match => ({
        property: match.property,
        matchScore: match.matchScore,
        recommendation: match.recommendation
      })),
      aiAnalysis,
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
