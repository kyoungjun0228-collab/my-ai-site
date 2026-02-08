
import { GoogleGenAI, Type } from "@google/genai";
import { Property, SearchParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GroundedPropertyResponse {
  properties: Property[];
  sources: { title: string; uri: string }[];
}

/**
 * Fetches real estate properties with exhaustive details including agent info.
 * Explicitly enforces price ranges in the prompt for accuracy.
 */
export const fetchProperties = async (params: SearchParams): Promise<GroundedPropertyResponse> => {
  const fullLocation = `${params.area} ${params.subArea}`.trim();
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `부동산 전문가로서 "${fullLocation}" 지역의 ${params.categories.join(', ')} 매물을 찾고 상세 리포트를 작성하세요.
      
      매우 엄격한 필터 조건:
      1. 거래 방식: ${params.tradeType.join(', ')}
      2. 보증금 범위: ${params.depositRange[0]}만원 이상 ~ ${params.depositRange[1]}만원 이하 (반드시 이 범위 내의 매물만 수집하세요)
      3. 월세 범위: ${params.rentRange[0]}만원 이상 ~ ${params.rentRange[1]}만원 이하 (반드시 이 범위 내의 매물만 수집하세요)
      
      필수 요구사항:
      - 제외대상: 공유오피스, 비즈니스센터, 소호사무실, 창업지원센터는 절대 제외.
      - 상세 정보 수집: 가능한 모든 기술적 사양을 수집하세요. 층수, 방향, 관리비, 주차대수, 입주가능일, 건축물 용도 등.
      - 업체 정보: 해당 매물을 등록한 부동산 중개업소 명칭, 담당자 이름, 연락처 정보를 반드시 포함하세요.
      - 출처: 'source'는 한글로 표기 (예: 네이버 부동산).
      - 최소 15개 이상의 결과를 반환하세요.
      
      주의: 설정한 보증금과 월세 범위를 벗어나는 매물은 사용자가 원하지 않으므로 절대로 포함하지 마십시오.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            source: { type: Type.STRING },
            name: { type: Type.STRING },
            type: { type: Type.STRING },
            price: { type: Type.STRING },
            area: { type: Type.STRING },
            link: { type: Type.STRING },
            priceValue: { type: Type.NUMBER },
            description: { type: Type.STRING },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            locationDetail: { type: Type.STRING },
            floor: { type: Type.STRING },
            direction: { type: Type.STRING },
            maintenanceFee: { type: Type.STRING },
            buildYear: { type: Type.STRING },
            parking: { type: Type.STRING },
            moveInDate: { type: Type.STRING },
            agentName: { type: Type.STRING },
            agentContact: { type: Type.STRING },
            agencyName: { type: Type.STRING }
          },
          required: ['id', 'source', 'name', 'type', 'price', 'area', 'link', 'priceValue']
        }
      }
    }
  });

  try {
    const rawText = response.text || "[]";
    const cleanJson = rawText.replace(/```json\n?|```/g, '').trim();
    const properties = JSON.parse(cleanJson);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return { properties, sources };
  } catch (e) {
    console.error("Parsing error:", e);
    return { properties: [], sources: [] };
  }
};
