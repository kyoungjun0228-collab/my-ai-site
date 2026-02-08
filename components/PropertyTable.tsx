
import React from 'react';
import { Download, Search as SearchIcon, Ruler, MapPin, Phone } from 'lucide-react';
import { Property } from '../types';

interface PropertyTableProps {
  properties: Property[];
  onDownload: () => void;
  onSelectProperty: (prop: Property) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onDownload, onSelectProperty }) => {
  if (properties.length === 0) return null;

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl">
      <div className="p-6 md:p-10 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">수집된 매물 리스트</h3>
          <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">총 {properties.length}개의 실제 매물을 확인했습니다.</p>
        </div>
        <button
          onClick={onDownload}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg"
        >
          <Download className="w-4 h-4 md:w-5 h-5" /> 엑셀 저장
        </button>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden p-4 space-y-4 bg-slate-50/50">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]">
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                prop.source.includes('네이버') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {prop.source}
              </span>
              <div className="text-base font-black text-rose-600">{prop.price}</div>
            </div>
            
            <h4 className="text-sm font-black text-slate-900 line-clamp-2 mb-3 leading-tight">
              {prop.name}
            </h4>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                <Ruler className="w-3.5 h-3.5" /> {prop.area}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                <MapPin className="w-3.5 h-3.5" /> {prop.locationDetail || '상세위치'}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onSelectProperty(prop)}
                className="flex-[2] bg-blue-600 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
              >
                AI 분석 <SearchIcon className="w-3.5 h-3.5" />
              </button>
              {prop.agentContact && (
                <a
                  href={`tel:${prop.agentContact}`}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                >
                  전화 <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">출처</th>
              <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">매물 정보</th>
              <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">구분</th>
              <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">가격</th>
              <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">문의처</th>
              <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {properties.map((prop) => (
              <tr key={prop.id} className="hover:bg-blue-50/30 transition-all group">
                <td className="px-6 md:px-10 py-6 md:py-8">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm ${
                    prop.source.includes('네이버') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {prop.source}
                  </span>
                </td>
                <td className="px-6 md:px-10 py-6 md:py-8">
                  <div className="text-sm md:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {prop.name}
                  </div>
                  <div className="text-[10px] md:text-xs text-slate-400 font-bold mt-1">{prop.area} | {prop.locationDetail || '상세위치'}</div>
                </td>
                <td className="px-6 md:px-10 py-6 md:py-8 text-xs font-bold text-slate-500">{prop.type}</td>
                <td className="px-6 md:px-10 py-6 md:py-8 text-base md:text-lg font-black text-rose-600 text-right">{prop.price}</td>
                <td className="px-6 md:px-10 py-6 md:py-8">
                  {prop.agentContact ? (
                    <a 
                      href={`tel:${prop.agentContact}`} 
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-black text-sm transition-colors"
                    >
                      <Phone className="w-4 h-4" /> {prop.agentContact}
                    </a>
                  ) : (
                    <span className="text-slate-300 text-sm font-bold italic">정보없음</span>
                  )}
                </td>
                <td className="px-6 md:px-10 py-6 md:py-8">
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-blue-600 rounded-xl text-[10px] font-black text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                  >
                    AI 상세 분석 <SearchIcon className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyTable;
