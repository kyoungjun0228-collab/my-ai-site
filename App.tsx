
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PropertyTable from './components/PropertyTable';
import PropertyDetail from './components/PropertyDetail';
import { SearchParams, Property, AppView } from './types';
import { fetchProperties } from './services/geminiService';
import { AlertCircle, Building2, BarChart3, Map as MapIcon, Globe, Loader2, Search } from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({
    area: '',
    subArea: '',
    categories: ['지식산업센터'],
    tradeType: ['월세'], // Default as array
    depositRange: [0, 5000],
    rentRange: [0, 300]
  });

  const [view, setView] = useState<AppView>('list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!params.area) return;

    setIsLoading(true);
    setError(null);
    setProperties([]);
    setView('list'); 
    try {
      const propsRes = await fetchProperties(params);
      setProperties(propsRes.properties);
      setSources(propsRes.sources);
      if (propsRes.properties.length === 0) {
        setError('해당 조건의 매물을 찾지 못했습니다. 필터를 조정해 보세요.');
      }
    } catch (err) {
      console.error(err);
      setError('실시간 매물 수집 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadCSV = useCallback(() => {
    if (properties.length === 0) return;
    const headers = ['출처', '매물명', '유형', '가격', '면적', '링크'];
    const csvContent = [
      headers.join(','),
      ...properties.map(p => [`"${p.source}"`, `"${p.name}"`, `"${p.type}"`, `"${p.price}"`, `"${p.area}"`, `"${p.link}"`].join(','))
    ].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${params.area}_부동산_매물.csv`;
    link.click();
  }, [properties, params.area]);

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {view === 'list' && (
        <Sidebar
          params={params}
          setParams={setParams}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      )}

      <main className={`flex-1 transition-all duration-300 ${view === 'list' ? 'p-6 md:p-10' : 'p-0'}`}>
        {view === 'list' ? (
          <>
            <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  🏢 상업용 부동산 AI 수집기
                </h1>
                <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-lg">네이버 부동산 기반 실시간 매물 수집 및 분석</p>
              </div>
              <div className="hidden md:flex gap-3">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-bold text-slate-600">
                  <Globe className="w-5 h-5 text-emerald-500" /> Grounding Active
                </div>
              </div>
            </header>

            {error && (
              <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-700 animate-in slide-in-from-top duration-500">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-8">
                <div className="relative">
                   <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-blue-600 animate-spin" />
                   <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">실시간 웹 수집 중...</h3>
                  <p className="text-slate-500 font-medium text-sm md:text-base">최신 매물 정보를 필터링하고 분석하고 있습니다.</p>
                </div>
                <div className="w-64 md:w-80 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-progress origin-left" />
                </div>
              </div>
            ) : properties.length > 0 ? (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 bg-blue-50 rounded-xl"><MapIcon className="w-5 h-5 text-blue-600" /></div>
                      <span className="text-xs font-black text-slate-400 uppercase">위치</span>
                    </div>
                    <div className="text-xl md:text-2xl font-black text-slate-800 truncate">{params.area} {params.subArea}</div>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 bg-purple-50 rounded-xl"><BarChart3 className="w-5 h-5 text-purple-600" /></div>
                      <span className="text-xs font-black text-slate-400 uppercase">수집량</span>
                    </div>
                    <div className="text-xl md:text-2xl font-black text-slate-800">{properties.length}개 발견</div>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 bg-amber-50 rounded-xl"><Globe className="w-5 h-5 text-amber-600" /></div>
                      <span className="text-xs font-black text-slate-400 uppercase">출처</span>
                    </div>
                    <div className="text-xl md:text-2xl font-black text-slate-800">네이버 외 {sources.length}개</div>
                  </div>
                </div>

                <PropertyTable 
                  properties={properties} 
                  onDownload={handleDownloadCSV} 
                  onSelectProperty={handleSelectProperty}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white border-2 border-dashed border-slate-100 rounded-[3rem] text-center shadow-inner mx-auto max-w-4xl">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
                  <Search className="w-12 h-12 text-blue-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">검색을 시작하세요</h3>
                <p className="text-slate-400 mt-3 text-sm md:text-base">좌측 필터에서 지역을 선택하면 AI가 매물을 수집합니다.</p>
              </div>
            )}
          </>
        ) : (
          selectedProperty && (
            <PropertyDetail 
              property={selectedProperty} 
              onBack={() => setView('list')} 
            />
          )
        )}
      </main>
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
