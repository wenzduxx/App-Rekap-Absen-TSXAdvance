import React from 'react';
import { TrendingUp, Award, BookOpen, Star } from 'lucide-react';
import { AcademicStat } from '../types';

interface StatsCardsProps {
  stats: AcademicStat[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const getIcon = (label: string) => {
    if (label.includes('GPA')) return <TrendingUp className="w-4 h-4" />;
    if (label.includes('Credits') || label.includes('SKS')) return <BookOpen className="w-4 h-4" />;
    if (label.includes('Rank')) return <Star className="w-4 h-4" />;
    return <Award className="w-4 h-4" />;
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'border-l-primary text-primary';
      case 'yellow': return 'border-l-yellow-500 text-yellow-600';
      case 'orange': return 'border-l-orange-500 text-orange-600';
      case 'red': return 'border-l-red-500 text-red-600';
      default: return 'border-l-slate-500 text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 border-l-4 ${getColorClasses(stat.color)}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-opacity-10 ${stat.color === 'blue' ? 'bg-blue-100' : 'bg-slate-100'}`}>
              {getIcon(stat.label)}
            </div>
          </div>
          {stat.trend !== undefined ? (
            <div className="mt-3 flex items-center text-xs font-medium">
              <span className={`flex items-center gap-1 ${stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trendDirection === 'up' ? '↑' : '↓'} {stat.trend}%
              </span>
              <span className="text-slate-400 ml-1 truncate" title={stat.subtext}>{stat.subtext || 'vs last semester'}</span>
            </div>
          ) : stat.subtext ? (
             <div className="mt-3 flex items-center text-xs font-medium text-slate-400">
               {stat.subtext}
             </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};