// 会話フロー管理システム
import { InvestorProfile, InvestorLevel, classifyInvestor } from './investor-profile';

export type ConversationPhase = 
  | 'greeting'           // 初回挨拶
  | 'profiling'         // プロファイル収集
  | 'strategy_planning' // 投資戦略立案
  | 'property_search'   // 物件検索・推薦
  | 'detailed_advice'   // 詳細アドバイス
  | 'follow_up';        // フォローアップ

export interface ConversationState {
  userId?: string;
  sessionId: string;
  phase: ConversationPhase;
  step: number;
  profile: InvestorProfile;
  collectedInfo: string[];        // 収集済み情報
  pendingQuestions: string[];     // 未回答質問
  conversationHistory: Message[];
  lastInteraction: string;
  metadata: {
    totalMessages: number;
    profilingStarted: boolean;
    profileCompleted: boolean;
    strategySuggested: boolean;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    phase: ConversationPhase;
    extractedInfo?: Partial<InvestorProfile>;
    suggestions?: string[];
  };
}

export class ConversationManager {
  private state: ConversationState;

  constructor(sessionId: string, existingState?: Partial<ConversationState>) {
    this.state = {
      sessionId,
      phase: 'greeting',
      step: 0,
      profile: {},
      collectedInfo: [],
      pendingQuestions: [],
      conversationHistory: [],
      lastInteraction: new Date().toISOString(),
      metadata: {
        totalMessages: 0,
        profilingStarted: false,
        profileCompleted: false,
        strategySuggested: false
      },
      ...existingState
    };
  }

  // メッセージ追加と状態更新
  addMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    this.state.conversationHistory.push(newMessage);
    this.state.metadata.totalMessages++;
    this.state.lastInteraction = newMessage.timestamp;

    return newMessage;
  }

  // 現在のフェーズに基づく次の質問を生成
  getNextQuestion(): string | null {
    const { phase, profile, metadata } = this.state;

    switch (phase) {
      case 'greeting':
        return this.getGreetingMessage();
      
      case 'profiling':
        return this.getProfilingQuestion();
      
      case 'strategy_planning':
        return this.getStrategyQuestion();
      
      case 'property_search':
        return this.getPropertySearchGuidance();
      
      default:
        return null;
    }
  }

  private getGreetingMessage(): string {
    return `こんにちは！AI不動産投資アドバイザーです 🏢✨

あなたの投資目標に最適な戦略と物件をご提案するため、まずは簡単な質問にお答えください。

**まず最初に、現在の状況を教えてください：**
1. 年収はどのくらいでしょうか？
2. 不動産投資の経験はありますか？
3. どのような投資目標をお持ちですか？

ざっくりとした内容で構いませんので、お気軽にお聞かせください！`;
  }

  private getProfilingQuestion(): string {
    const missing = this.getMissingProfileInfo();
    
    if (missing.length === 0) {
      this.advanceToStrategyPlanning();
      return this.getStrategyQuestion();
    }

    const questions = {
      'annualIncome': '年収について詳しく教えてください。（例：600万円、1200万円など）',
      'totalAssets': '現在の総資産はどのくらいでしょうか？（預金・株式・不動産等の合計）',
      'experienceYears': '不動産投資の経験年数を教えてください。初心者の場合は0年で構いません。',
      'investmentGoal': '投資の目標は何でしょうか？（例：老後資金、副収入、資産形成など）',
      'riskTolerance': 'リスクに対してはどのようなお考えですか？（安定重視 / バランス型 / 積極的）',
      'budgetRange': '物件購入の予算はどの程度を想定していますか？'
    };

    const nextQuestion = missing[0] as keyof typeof questions;
    return questions[nextQuestion] || 'その他に教えていただきたい情報はありますか？';
  }

  private getStrategyQuestion(): string {
    const classification = classifyInvestor(this.state.profile);
    
    return `**あなたの投資家プロファイル分析が完了しました！**

🎯 **投資家レベル**: ${this.getLevelDisplayName(classification.level)}
💰 **推奨物件価格帯**: ${classification.maxPropertyPrice.toLocaleString()}万円以下
📊 **目標利回り**: ${classification.recommendedYieldRange.min}-${classification.recommendedYieldRange.max}%
🛡️ **リスクプロファイル**: ${classification.riskProfile}

**あなたの特徴:**
${classification.characteristics.map(c => `• ${c}`).join('\n')}

どのような物件を探したいですか？エリアや具体的な条件があれば教えてください！`;
  }

  private getPropertySearchGuidance(): string {
    const classification = classifyInvestor(this.state.profile);
    
    return `${this.getLevelDisplayName(classification.level)}向けの物件をお探しですね！

**推奨戦略:**
${classification.characteristics.map(c => `• ${c}`).join('\n')}

具体的にどのような物件情報をお探しでしょうか？
- エリア（札幌、その他の希望地域）
- 物件タイプ（ワンルーム、ファミリー向けなど）
- 特別な条件（駅近、築年数など）`;
  }

  // プロファイル情報の抽出とアップデート
  updateProfileFromMessage(message: string): Partial<InvestorProfile> {
    const extracted: Partial<InvestorProfile> = {};
    const text = message.toLowerCase();

    // 年収の抽出
    const incomeMatch = message.match(/(\d+)万円|年収.*?(\d+)/);
    if (incomeMatch) {
      extracted.annualIncome = parseInt(incomeMatch[1] || incomeMatch[2]);
    }

    // 経験年数の抽出
    const expMatch = message.match(/(\d+)年|経験.*?(\d+)|初心者|未経験/);
    if (expMatch) {
      if (message.includes('初心者') || message.includes('未経験')) {
        extracted.experienceYears = 0;
      } else {
        extracted.experienceYears = parseInt(expMatch[1] || expMatch[2]);
      }
    }

    // 予算の抽出
    const budgetMatch = message.match(/(\d+)万円|予算.*?(\d+)/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1] || budgetMatch[2]);
      extracted.budgetRange = { min: budget * 0.8, max: budget * 1.2 };
    }

    // リスク許容度の抽出
    if (text.includes('安定') || text.includes('低リスク')) {
      extracted.riskTolerance = 'low';
    } else if (text.includes('積極') || text.includes('高リスク')) {
      extracted.riskTolerance = 'high';
    } else if (text.includes('バランス') || text.includes('中リスク')) {
      extracted.riskTolerance = 'medium';
    }

    // 投資目標の抽出
    if (text.includes('老後') || text.includes('年金')) {
      extracted.investmentGoal = '老後資金形成';
    } else if (text.includes('副収入') || text.includes('収入')) {
      extracted.investmentGoal = '副収入獲得';
    } else if (text.includes('資産') || text.includes('築')) {
      extracted.investmentGoal = '資産形成・拡大';
    }

    // プロファイルを更新
    this.state.profile = { ...this.state.profile, ...extracted };
    
    return extracted;
  }

  // フェーズ進行管理
  advancePhase(): void {
    const phases: ConversationPhase[] = [
      'greeting', 'profiling', 'strategy_planning', 'property_search', 'detailed_advice', 'follow_up'
    ];
    
    const currentIndex = phases.indexOf(this.state.phase);
    if (currentIndex < phases.length - 1) {
      this.state.phase = phases[currentIndex + 1];
      this.state.step = 0;
    }
  }

  private advanceToStrategyPlanning(): void {
    this.state.phase = 'strategy_planning';
    this.state.metadata.profileCompleted = true;
  }

  // 不足しているプロファイル情報を取得
  private getMissingProfileInfo(): string[] {
    const required = ['annualIncome', 'experienceYears', 'investmentGoal'];
    return required.filter(field => 
      !this.state.profile[field as keyof InvestorProfile]
    );
  }

  private getLevelDisplayName(level: InvestorLevel): string {
    const names = {
      'beginner': 'ビギナー投資家',
      'experienced': '経験豊富な投資家', 
      'semi-pro': 'セミプロ投資家',
      'pro': 'プロ投資家'
    };
    return names[level];
  }

  // 現在の状態を取得
  getState(): ConversationState {
    return { ...this.state };
  }

  // 状態の保存用データを取得
  getSerializableState(): any {
    return {
      sessionId: this.state.sessionId,
      phase: this.state.phase,
      step: this.state.step,
      profile: this.state.profile,
      collectedInfo: this.state.collectedInfo,
      metadata: this.state.metadata,
      lastInteraction: this.state.lastInteraction
    };
  }
}