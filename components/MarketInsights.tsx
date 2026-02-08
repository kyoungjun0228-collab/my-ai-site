
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { MarketInsight } from '../types';

interface MarketInsightsProps {
  insight: MarketInsight | null;
  area: string;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ insight, area }) => {
  if (!insight) return null;

  const getTrendIcon = () => {
    switch (insight.trend) {
      case 'UP': return <TrendingUp className="text-rose-500 w-6 h-6" />;
      case 'DOWN': return <TrendingDown className="text-blue-500 w-6 h-6" />;
      default: return <Minus className="text-slate-400 w-6 h-6" />;
    }
  };

  const getTrendText = () => {
    switch (insight.trend) {
      case 'UP': return '상승세';
      case 'DOWN': return '하락세';
      default: return '보합세';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{area} AI 마켓 분석</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
          {getTrendIcon()}
          <span className="text-sm font-bold text-slate-700">{getTrendText()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">종합 요약</h3>
          <p className="text-slate-700 leading-relaxed text-sm">
            {insight.summary}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">투자 호재 / 장점</h3>
          <ul className="space-y-2">
            {insight.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">리스크 / 단점</h3>
          <ul className="space-y-2">
            {insight.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;
