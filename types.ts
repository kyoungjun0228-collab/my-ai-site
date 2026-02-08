
export type TradeType = '월세' | '단기월세';

export interface Property {
  id: string;
  source: string;
  name: string;
  type: string;
  price: string;
  area: string;
  link: string;
  priceValue: number;
  description?: string;
  features?: string[];
  locationDetail?: string;
  // 추가된 상세 필드
  floor?: string;
  direction?: string;
  maintenanceFee?: string;
  buildYear?: string;
  parking?: string;
  moveInDate?: string;
  // 업체/중개사 정보
  agentName?: string;
  agentContact?: string;
  agencyName?: string;
}

export interface SearchParams {
  area: string;      // 시/도
  subArea: string;   // 구/동
  categories: string[];
  tradeType: TradeType[]; // Changed to array for multi-selection
  depositRange: [number, number]; 
  rentRange: [number, number];    
}

export type AppView = 'list' | 'detail';

/**
 * Interface for AI-generated market insights for a specific area.
 */
export interface MarketInsight {
  trend: 'UP' | 'DOWN' | 'STABLE';
  summary: string;
  pros: string[];
  cons: string[];
}
