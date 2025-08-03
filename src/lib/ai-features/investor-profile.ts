// 投資家プロファイル管理システム
export interface InvestorProfile {
  // 基本情報
  annualIncome?: number;           // 年収（万円）
  totalAssets?: number;            // 総資産（万円）
  totalDebt?: number;              // 借入額（万円）
  realEstateAssets?: number;       // 不動産資産（万円）
  realEstateDebt?: number;         // 不動産借入額（万円）
  experienceYears?: number;        // 投資経験年数
  
  // 投資戦略
  investmentGoal?: string;         // 投資目標
  riskTolerance?: 'low' | 'medium' | 'high';  // リスク許容度
  timeHorizon?: 'short' | 'medium' | 'long';  // 投資期間
  preferredLocation?: string[];    // 希望投資エリア
  budgetRange?: {
    min: number;
    max: number;
  };
  targetYield?: number;           // 目標利回り（%）
  
  // メタデータ
  profileCompleteness?: number;    // プロファイル完成度（0-100%）
  lastUpdated?: string;
  userId?: string;
}

export type InvestorLevel = 'beginner' | 'experienced' | 'semi-pro' | 'pro';

export interface InvestorClassification {
  level: InvestorLevel;
  maxPropertyPrice: number;       // 推奨最大物件価格
  recommendedYieldRange: {
    min: number;
    max: number;
  };
  riskProfile: string;
  characteristics: string[];
}

// 投資家レベル分類ロジック
export function classifyInvestor(profile: InvestorProfile): InvestorClassification {
  const {
    annualIncome = 0,
    totalAssets = 0,
    realEstateAssets = 0,
    experienceYears = 0
  } = profile;

  // プロ: 経験10年以上 OR 不動産資産10億以上 OR 年収3000万以上
  if (experienceYears >= 10 || realEstateAssets >= 100000 || annualIncome >= 3000) {
    return {
      level: 'pro',
      maxPropertyPrice: 500000, // 5億以下
      recommendedYieldRange: { min: 4, max: 12 },
      riskProfile: '高リスク高リターン戦略可能',
      characteristics: [
        '大型物件投資可能',
        '複雑な投資戦略対応',
        '税務最適化重視',
        'ポートフォリオ分散'
      ]
    };
  }

  // セミプロ: 経験5年以上 AND (不動産資産3億以上 OR 年収1500万以上)
  if (experienceYears >= 5 && (realEstateAssets >= 30000 || annualIncome >= 1500)) {
    return {
      level: 'semi-pro',
      maxPropertyPrice: 30000, // 3億以下
      recommendedYieldRange: { min: 5, max: 10 },
      riskProfile: '中〜高リスク戦略',
      characteristics: [
        '中大型物件対応',
        '複数物件運用',
        '節税対策活用',
        'キャッシュフロー重視'
      ]
    };
  }

  // 経験者: 経験2年以上 AND (不動産資産1億以上 OR 年収800万以上)
  if (experienceYears >= 2 && (realEstateAssets >= 10000 || annualIncome >= 800)) {
    return {
      level: 'experienced',
      maxPropertyPrice: 15000, // 1.5億以下
      recommendedYieldRange: { min: 6, max: 9 },
      riskProfile: '中リスク安定戦略',
      characteristics: [
        '中型物件中心',
        '安定収益重視',
        '立地選定重要',
        '管理効率化'
      ]
    };
  }

  // ビギナー: 上記以外
  return {
    level: 'beginner',
    maxPropertyPrice: 10000, // 1億以下
    recommendedYieldRange: { min: 7, max: 12 },
    riskProfile: '低〜中リスク学習重視',
    characteristics: [
      '小型物件から開始',
      '基礎知識習得重要',
      '管理会社活用推奨',
      'リスク管理重視'
    ]
  };
}

// プロファイル完成度計算
export function calculateProfileCompleteness(profile: InvestorProfile): number {
  const requiredFields = [
    'annualIncome', 'totalAssets', 'experienceYears', 
    'investmentGoal', 'riskTolerance', 'budgetRange'
  ];
  
  const completedFields = requiredFields.filter(field => 
    profile[field as keyof InvestorProfile] !== undefined && 
    profile[field as keyof InvestorProfile] !== null
  ).length;
  
  return Math.round((completedFields / requiredFields.length) * 100);
}

// プロファイル検証
export function validateProfile(profile: InvestorProfile): {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
} {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // 必須フィールドチェック
  if (!profile.annualIncome) missingFields.push('年収');
  if (!profile.experienceYears) missingFields.push('投資経験年数');
  if (!profile.investmentGoal) missingFields.push('投資目標');

  // 警告チェック
  if (profile.annualIncome && profile.budgetRange?.max && 
      profile.budgetRange.max > profile.annualIncome * 10) {
    warnings.push('予算が年収の10倍を超えています。融資審査が困難な可能性があります。');
  }

  if (profile.experienceYears === 0 && profile.budgetRange?.max && 
      profile.budgetRange.max > 5000) {
    warnings.push('初心者の方には5000万円以下の物件から始めることをお勧めします。');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings
  };
}