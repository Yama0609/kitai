// レベル別物件推薦システム
import { InvestorProfile, InvestorLevel, classifyInvestor } from './investor-profile';

export interface Property {
  id: string;
  name: string;
  location: {
    prefecture: string;
    city: string;
    ward?: string;
    nearestStation: string;
    walkingMinutes: number;
  };
  price: number;                    // 物件価格（万円）
  monthlyRent: number;             // 月額賃料（万円）
  yearlyRent: number;              // 年間賃料（万円）
  grossYield: number;              // 表面利回り（%）
  netYield: number;                // 実質利回り（%）
  propertyType: 'apartment' | 'mansion' | 'house' | 'building';
  buildingAge: number;             // 築年数
  floorArea: number;               // 専有面積（㎡）
  layout: string;                  // 間取り
  features: string[];              // 特徴・設備
  managementFee: number;           // 管理費（月額・万円）
  repairReserve: number;           // 修繕積立金（月額・万円）
  occupancyRate: number;           // 稼働率（%）
  futureRisk: {
    marketRisk: 'low' | 'medium' | 'high';
    liquidityRisk: 'low' | 'medium' | 'high';
    maintenanceRisk: 'low' | 'medium' | 'high';
  };
  investmentHighlights: string[];  // 投資のポイント
  concernPoints: string[];         // 注意点
}

export interface PropertyMatch {
  property: Property;
  matchScore: number;              // マッチングスコア（0-100）
  reasons: string[];               // マッチング理由
  warnings: string[];              // 注意事項
  recommendation: string;          // 推薦理由
}

// レベル別サンプル物件データ
const SAMPLE_PROPERTIES: Property[] = [
  // ビギナー向け物件
  {
    id: 'beginner_001',
    name: '札幌駅前ワンルームマンション',
    location: {
      prefecture: '北海道',
      city: '札幌市',
      ward: '北区',
      nearestStation: 'JR札幌駅',
      walkingMinutes: 5
    },
    price: 1800,
    monthlyRent: 6.5,
    yearlyRent: 78,
    grossYield: 4.3,
    netYield: 3.1,
    propertyType: 'mansion',
    buildingAge: 8,
    floorArea: 25.2,
    layout: '1K',
    features: ['オートロック', '宅配ボックス', 'エアコン', 'IHコンロ'],
    managementFee: 0.8,
    repairReserve: 0.3,
    occupancyRate: 95,
    futureRisk: {
      marketRisk: 'low',
      liquidityRisk: 'low',
      maintenanceRisk: 'low'
    },
    investmentHighlights: [
      '札幌駅徒歩5分の好立地',
      '単身者需要が安定',
      '管理会社の実績良好',
      '将来の資産価値維持期待'
    ],
    concernPoints: [
      '利回りは控えめ',
      '競合物件が多い立地'
    ]
  },
  {
    id: 'beginner_002', 
    name: '豊平区ファミリーマンション',
    location: {
      prefecture: '北海道',
      city: '札幌市',
      ward: '豊平区',
      nearestStation: '地下鉄東豊線豊平公園駅',
      walkingMinutes: 8
    },
    price: 2800,
    monthlyRent: 9.8,
    yearlyRent: 117.6,
    grossYield: 4.2,
    netYield: 2.9,
    propertyType: 'mansion',
    buildingAge: 12,
    floorArea: 65.4,
    layout: '3LDK',
    features: ['ファミリー向け', '駐車場付き', '南向き', '床暖房'],
    managementFee: 1.2,
    repairReserve: 0.6,
    occupancyRate: 92,
    futureRisk: {
      marketRisk: 'low',
      liquidityRisk: 'medium',
      maintenanceRisk: 'medium'
    },
    investmentHighlights: [
      'ファミリー需要が安定',
      '住環境良好',
      '駐車場確保済み',
      '学校・公園近く'
    ],
    concernPoints: [
      '空室期間が長期化リスク',
      '修繕費用が高額になる可能性'
    ]
  },

  // 経験者向け物件
  {
    id: 'experienced_001',
    name: '中央区投資用マンション',
    location: {
      prefecture: '北海道', 
      city: '札幌市',
      ward: '中央区',
      nearestStation: '地下鉄南北線大通駅',
      walkingMinutes: 7
    },
    price: 4500,
    monthlyRent: 18.5,
    yearlyRent: 222,
    grossYield: 4.9,
    netYield: 3.6,
    propertyType: 'mansion',
    buildingAge: 15,
    floorArea: 45.8,
    layout: '1LDK',
    features: ['都心立地', 'リノベーション済み', 'ペット可', '24時間管理'],
    managementFee: 1.5,
    repairReserve: 0.8,
    occupancyRate: 98,
    futureRisk: {
      marketRisk: 'low',
      liquidityRisk: 'low',
      maintenanceRisk: 'medium'
    },
    investmentHighlights: [
      '都心部の希少立地',
      '高い稼働率維持',
      'リノベーション効果',
      '資産価値の安定性'
    ],
    concernPoints: [
      '初期投資額が高め',
      '管理費負担大'
    ]
  },

  // セミプロ向け物件
  {
    id: 'semipro_001',
    name: '札幌駅前商業ビル',
    location: {
      prefecture: '北海道',
      city: '札幌市',
      ward: '中央区', 
      nearestStation: 'JR札幌駅',
      walkingMinutes: 3
    },
    price: 12000,
    monthlyRent: 55,
    yearlyRent: 660,
    grossYield: 5.5,
    netYield: 4.1,
    propertyType: 'building',
    buildingAge: 20,
    floorArea: 180,
    layout: '事務所',
    features: ['商業地域', '複数テナント', 'エレベーター', '駐車場'],
    managementFee: 3.2,
    repairReserve: 1.8,
    occupancyRate: 89,
    futureRisk: {
      marketRisk: 'medium',
      liquidityRisk: 'medium',
      maintenanceRisk: 'high'
    },
    investmentHighlights: [
      '札幌中心部の商業ビル',
      '複数テナントでリスク分散',
      '高利回り実現',
      '将来開発余地あり'
    ],
    concernPoints: [
      'テナント空室リスク',
      '大規模修繕費用',
      '管理の複雑さ'
    ]
  },

  // プロ向け物件
  {
    id: 'pro_001',
    name: 'すすきの一棟マンション',
    location: {
      prefecture: '北海道',
      city: '札幌市',
      ward: '中央区',
      nearestStation: '地下鉄南北線すすきの駅',
      walkingMinutes: 2
    },
    price: 28000,
    monthlyRent: 180,
    yearlyRent: 2160,
    grossYield: 7.7,
    netYield: 5.8,
    propertyType: 'building',
    buildingAge: 18,
    floorArea: 450,
    layout: '1R×12戸',
    features: ['一棟マンション', '繁華街立地', '高利回り', '民泊転用可能性'],
    managementFee: 8.5,
    repairReserve: 3.2,
    occupancyRate: 94,
    futureRisk: {
      marketRisk: 'high',
      liquidityRisk: 'medium',
      maintenanceRisk: 'high'
    },
    investmentHighlights: [
      'すすきの中心部立地',
      '高利回り物件',
      '観光需要も期待',
      '土地価値の安定性'
    ],
    concernPoints: [
      '繁華街特有のリスク',
      '高額な修繕費用',
      '管理の専門性要求'
    ]
  }
];

export class PropertyMatcher {
  // レベル別物件推薦
  static getRecommendations(profile: InvestorProfile, limit: number = 3): PropertyMatch[] {
    const classification = classifyInvestor(profile);
    const suitableProperties = this.filterPropertiesByLevel(classification);
    
    return suitableProperties
      .map(property => this.calculateMatch(property, profile, classification))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  // レベル別物件フィルタリング
  private static filterPropertiesByLevel(classification: { level: string; maxPropertyPrice: number }): Property[] {
    return SAMPLE_PROPERTIES.filter(property => {
      // 価格制限チェック
      if (property.price > classification.maxPropertyPrice) {
        return false;
      }

      // レベル別特性チェック
      switch (classification.level) {
        case 'beginner':
          return property.price <= 10000 && 
                 property.futureRisk.marketRisk !== 'high' &&
                 property.occupancyRate >= 90;
        
        case 'experienced':
          return property.price <= 15000 &&
                 property.netYield >= 3.0;
        
        case 'semi-pro':
          return property.price <= 30000 &&
                 property.grossYield >= 4.0;
        
        case 'pro':
          return true; // プロは全物件対象
        
        default:
          return true;
      }
    });
  }

  // マッチングスコア計算
  private static calculateMatch(
    property: Property, 
    profile: InvestorProfile, 
    classification: { level: InvestorLevel; recommendedYieldRange: { min: number; max: number } }
  ): PropertyMatch {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // 価格適合性（30点）
    if (profile.budgetRange) {
      if (property.price >= profile.budgetRange.min && 
          property.price <= profile.budgetRange.max) {
        score += 30;
        reasons.push('予算範囲に適合');
      } else if (property.price <= profile.budgetRange.max * 1.1) {
        score += 20;
        reasons.push('予算にほぼ適合');
      } else {
        warnings.push('予算を超過している可能性');
      }
    }

    // 利回り適合性（25点）
    const targetYield = profile.targetYield || classification.recommendedYieldRange.min;
    if (property.grossYield >= targetYield) {
      score += 25;
      reasons.push(`目標利回り${targetYield}%を達成`);
    } else if (property.grossYield >= targetYield * 0.8) {
      score += 15;
      reasons.push('利回りがほぼ目標に到達');
    }

    // リスク適合性（20点）
    const riskTolerance = profile.riskTolerance || 'medium';
    if (this.isRiskCompatible(property, riskTolerance)) {
      score += 20;
      reasons.push('リスクレベルが適合');
    } else {
      warnings.push('リスクレベルが許容範囲を超える可能性');
    }

    // 立地評価（15点）
    if (property.location.walkingMinutes <= 10) {
      score += 15;
      reasons.push('駅近の好立地');
    } else if (property.location.walkingMinutes <= 15) {
      score += 10;
      reasons.push('アクセス良好');
    }

    // 稼働率（10点）
    if (property.occupancyRate >= 95) {
      score += 10;
      reasons.push('高い稼働率');
    } else if (property.occupancyRate >= 90) {
      score += 7;
      reasons.push('安定した稼働率');
    }

    // レベル別ボーナス
    score += this.getLevelBonus(property, classification.level);

    const recommendation = this.generateRecommendation(property, classification, score);

    return {
      property,
      matchScore: Math.min(score, 100),
      reasons,
      warnings,
      recommendation
    };
  }

  private static isRiskCompatible(property: Property, tolerance: string): boolean {
    const riskScore = this.calculateRiskScore(property);
    
    switch (tolerance) {
      case 'low': return riskScore <= 3;
      case 'medium': return riskScore <= 6;
      case 'high': return riskScore <= 9;
      default: return true;
    }
  }

  private static calculateRiskScore(property: Property): number {
    const riskMap = { low: 1, medium: 2, high: 3 };
    return riskMap[property.futureRisk.marketRisk] + 
           riskMap[property.futureRisk.liquidityRisk] + 
           riskMap[property.futureRisk.maintenanceRisk];
  }

  private static getLevelBonus(property: Property, level: InvestorLevel): number {
    const bonusMap = {
      'beginner': property.futureRisk.marketRisk === 'low' ? 5 : 0,
      'experienced': property.netYield >= 3.5 ? 5 : 0,
      'semi-pro': property.grossYield >= 5.0 ? 5 : 0,
      'pro': property.grossYield >= 6.0 ? 5 : 0
    };
    
    return bonusMap[level] || 0;
  }

  private static generateRecommendation(
    property: Property, 
    classification: { level: InvestorLevel }, 
    score: number
  ): string {
    if (score >= 80) {
      return `${classification.level}の方に強くお勧めします。条件がよく合致しています。`;
    } else if (score >= 60) {
      return `${classification.level}の方に適した物件です。検討価値があります。`;
    } else if (score >= 40) {
      return '条件次第では検討できる物件です。詳細な分析をお勧めします。';
    } else {
      return '現在の条件にはあまり適さない可能性があります。';
    }
  }

  // 物件詳細分析
  static analyzeProperty(property: Property, _profile: InvestorProfile): {
    cashFlow: number;
    roi: number;
    paybackPeriod: number;
    riskAssessment: string;
    recommendations: string[];
  } {
    const annualRent = property.yearlyRent;
    const annualExpenses = (property.managementFee + property.repairReserve) * 12;
    const netCashFlow = annualRent - annualExpenses;
    const roi = (netCashFlow / property.price) * 100;
    const paybackPeriod = property.price / netCashFlow;

    const riskLevel = this.calculateRiskScore(property);
    const riskAssessment = riskLevel <= 3 ? '低リスク' : 
                          riskLevel <= 6 ? '中リスク' : '高リスク';

    const recommendations = [
      `年間キャッシュフロー: ${netCashFlow.toFixed(1)}万円`,
      `実質ROI: ${roi.toFixed(2)}%`,
      `投資回収期間: ${paybackPeriod.toFixed(1)}年`,
      ...property.investmentHighlights
    ];

    return {
      cashFlow: netCashFlow,
      roi,
      paybackPeriod,
      riskAssessment,
      recommendations
    };
  }
}