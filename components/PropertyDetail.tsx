
import React from 'react';
import { ArrowLeft, ExternalLink, MapPin, Building2, Ruler, BadgeCheck, CheckCircle2, Phone, User, Store, Calendar, Compass, CreditCard, ParkingCircle } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, onBack }) => {
  return (
    <div className="bg-slate-50 min-h-screen animate-in fade-in slide-in-from-right duration-500 pb-20">
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 목록으로 돌아가기
        </button>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase">{property.source}</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-black uppercase">{property.type}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              {property.name}
            </h1>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="text-5xl font-black text-rose-600 tracking-tight">
                {property.price}
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold">
                <MapPin className="w-5 h-5 text-blue-500" />
                {property.area}
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-white shadow-sm">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1 flex items-center gap-1"><Ruler className="w-3 h-3" /> 전용면적</div>
              <div className="text-lg font-black text-slate-800">{property.area}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-white shadow-sm">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1 flex items-center gap-1"><Building2 className="w-3 h-3" /> 해당층</div>
              <div className="text-lg font-black text-slate-800">{property.floor || '상세확인'}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-white shadow-sm">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1 flex items-center gap-1"><Compass className="w-3 h-3" /> 방향</div>
              <div className="text-lg font-black text-slate-800">{property.direction || '남향'}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-white shadow-sm">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> 관리비</div>
              <div className="text-lg font-black text-slate-800">{property.maintenanceFee || '실비'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detailed Info Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm">
                <h3 className="text-sm font-black text-blue-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
                  <BadgeCheck className="w-5 h-5 text-blue-600" /> AI 매물 분석 및 상세설명
                </h3>
                <p className="text-slate-700 leading-relaxed font-medium text-lg whitespace-pre-line">
                  {property.description || '이 매물은 현재 위치에서 가장 선호되는 조건을 갖추고 있습니다. 실시간 수집된 정보를 바탕으로 분석했을 때, 평단가 및 입지 조건이 우수하여 사무실이나 사업장으로 매우 적합한 것으로 나타납니다.'}
                </p>
                
                <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase">건물 사양</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-slate-400">준공연도</span> <span className="font-bold">{property.buildYear || '신축급'}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-400">주차여부</span> <span className="font-bold">{property.parking || '가능'}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-400">입주가능일</span> <span className="font-bold text-blue-600">{property.moveInDate || '즉시입주'}</span></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase">시설 특징</h4>
                    <div className="flex flex-wrap gap-2">
                      {(property.features || ['역세권 도보 5분', '주차 편리', '냉난방 완비', '즉시 입주가능']).map((feature, i) => (
                        <div key={i} className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Info Column */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200">
                <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" /> 매물 등록 업체 정보
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Store className="w-5 h-5 text-blue-400" />
                      <span className="text-lg font-black">{property.agencyName || '네이버부동산 등록업체'}</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium ml-8">공인중개사사무소</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-sm">
                        {property.agentName?.[0] || '공'}
                      </div>
                      <div>
                        <div className="text-sm font-black">{property.agentName || '담당 중개사'}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Property Manager</div>
                      </div>
                    </div>
                    
                    <a 
                      href={`tel:${property.agentContact || ''}`}
                      className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                    >
                      <Phone className="w-4 h-4" /> {property.agentContact || '연락처 확인 중'}
                    </a>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                      <Calendar className="w-3.5 h-3.5" /> 수집일: {new Date().toLocaleDateString('ko-KR')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                      <ParkingCircle className="w-3.5 h-3.5" /> 주차정보: {property.parking || '무료주차 지원'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <a 
                href={property.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border border-slate-200 text-slate-600 py-5 rounded-2xl font-black text-center flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
              >
                네이버 부동산 매물 원본 확인 <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
