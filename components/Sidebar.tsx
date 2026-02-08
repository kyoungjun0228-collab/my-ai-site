
import React, { useMemo, useState } from 'react';
import { Search, Filter, DollarSign, MapPin, Landmark, Building, ChevronDown, Menu, X } from 'lucide-react';
import { SearchParams, TradeType } from '../types';

interface SidebarProps {
  params: SearchParams;
  setParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  onSearch: () => void;
  isLoading: boolean;
}

const CATEGORIES = ["지식산업센터", "상가/사무실"];
const TRADE_TYPES: TradeType[] = ["월세", "단기월세"];

// 대한민국 전국 시/도 및 주요 구/시 데이터
const LOCATION_DATA: Record<string, string[]> = {
  "서울특별시": ["전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  "경기도": ["전체", "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "파주시", "시흥시", "김포시", "광명시", "광주시", "군포시", "이천시", "오산시", "하남시", "양주시", "구리시", "안성시", "포천시", "의왕시", "양평군", "여주시", "동두천시", "가평군", "과천시", "연천군"],
  "인천광역시": ["전체", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"],
  "부산광역시": ["전체", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
  "대구광역시": ["전체", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구", "군위군"],
  "광주광역시": ["전체", "광산구", "남구", "동구", "북구", "서구"],
  "대전광역시": ["전체", "대덕구", "동구", "서구", "유성구", "중구"],
  "울산광역시": ["전체", "남구", "동구", "북구", "울주군", "중구"],
  "세종특별자치시": ["세종시 전체"],
  "강원특별자치도": ["전체", "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  "충청북도": ["전체", "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  "충청남도": ["전체", "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  "전라북도": ["전체", "전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  "전라남도": ["전체", "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  "경상북도": ["전체", "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  "경상남도": ["전체", "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  "제주특별자치도": ["전체", "제주시", "서귀포시"],
  "기타": ["직접입력"]
};

const Sidebar: React.FC<SidebarProps> = ({ params, setParams, onSearch, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const districts = useMemo(() => {
    return LOCATION_DATA[params.area] || ["시/도를 먼저 선택하세요"];
  }, [params.area]);

  const toggleCategory = (cat: string) => {
    setParams(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleTradeType = (type: TradeType) => {
    setParams(prev => {
      const isSelected = prev.tradeType.includes(type);
      const newTypes = isSelected 
        ? prev.tradeType.filter(t => t !== type) 
        : [...prev.tradeType, type];
      
      // At least one must be selected
      if (newTypes.length === 0) return prev;
      return { ...prev, tradeType: newTypes };
    });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newArea = e.target.value;
    setParams(prev => ({
      ...prev,
      area: newArea,
      subArea: LOCATION_DATA[newArea]?.[0] === "전체" ? "" : (LOCATION_DATA[newArea]?.[0] || "")
    }));
  };

  const updateRange = (key: 'depositRange' | 'rentRange', index: number, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue)) return;
    setParams(prev => {
      const newRange = [...prev[key]] as [number, number];
      newRange[index] = numValue;
      return { ...prev, [key]: newRange };
    });
  };

  const handleSearchClick = () => {
    onSearch();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl flex items-center gap-2 font-black"
      >
        {isOpen ? <X className="w-6 h-6" /> : <><Menu className="w-6 h-6" /> 필터설정</>}
      </button>

      <aside className={`
        fixed lg:sticky top-0 left-0 w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto p-6 flex flex-col shadow-xl z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-2 mb-8 text-blue-600">
          <Building className="w-8 h-8" />
          <h1 className="text-xl font-black tracking-tighter text-slate-800">K-BIZ REALTY</h1>
        </div>

        <div className="space-y-6 flex-1">
          {/* Location Selection */}
          <section className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-blue-500" /> 지역 선택
            </label>
            <div className="space-y-3">
              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700 text-sm"
                  value={params.area}
                  onChange={handleAreaChange}
                >
                  <option value="" disabled>시/도 선택</option>
                  {Object.keys(LOCATION_DATA).map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              
              {params.area === "기타" ? (
                <input
                  type="text"
                  placeholder="상세 지역 직접 입력"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm font-medium"
                  value={params.subArea}
                  onChange={(e) => setParams({ ...params, subArea: e.target.value })}
                />
              ) : (
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700 text-sm disabled:opacity-50"
                    value={params.subArea}
                    disabled={!params.area}
                    onChange={(e) => setParams({ ...params, subArea: e.target.value === "전체" ? "" : e.target.value })}
                  >
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>
          </section>

          {/* Categories */}
          <section>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Filter className="w-4 h-4 text-blue-500" /> 매물 종류
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${
                    params.categories.includes(cat)
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-100'
                      : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Trade Type */}
          <section>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <DollarSign className="w-4 h-4 text-blue-500" /> 거래 방식 (중복 가능)
            </label>
            <div className="flex gap-2">
              {TRADE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleTradeType(type)}
                  className={`flex-1 py-2.5 rounded-xl text-xs transition-all border font-bold ${
                    params.tradeType.includes(type)
                      ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* Deposit Range */}
          <section>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Landmark className="w-4 h-4 text-blue-500" /> 보증금 (만원)
            </label>
            <div className="flex gap-2 items-center mb-3">
               <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={params.depositRange[0]}
                placeholder="최소"
                onChange={e => updateRange('depositRange', 0, e.target.value)}
               />
               <span className="text-slate-300">~</span>
               <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={params.depositRange[1]}
                placeholder="최대"
                onChange={e => updateRange('depositRange', 1, e.target.value)}
               />
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={params.depositRange[1]}
              onChange={(e) => updateRange('depositRange', 1, e.target.value)}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </section>

          {/* Monthly Rent Range */}
          <section>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <DollarSign className="w-4 h-4 text-blue-500" /> 월세 (만원)
            </label>
            <div className="flex gap-2 items-center mb-3">
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={params.rentRange[0]}
                placeholder="최소"
                onChange={e => updateRange('rentRange', 0, e.target.value)}
              />
              <span className="text-slate-300">~</span>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={params.rentRange[1]}
                placeholder="최대"
                onChange={e => updateRange('rentRange', 1, e.target.value)}
              />
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={params.rentRange[1]}
              onChange={(e) => updateRange('rentRange', 1, e.target.value)}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </section>
        </div>

        <button
          onClick={handleSearchClick}
          disabled={isLoading || !params.area}
          className={`w-full py-4 mt-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
            isLoading || !params.area
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98]'
          }`}
        >
          {isLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-6 h-6" />}
          매물 대량 수집
        </button>
      </aside>
      
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
