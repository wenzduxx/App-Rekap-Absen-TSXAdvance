import React from 'react';
import { MoreVertical, Download, Filter, Trophy, FileText, Activity } from 'lucide-react';
import { StudentRecord, RecordType } from '../types';

interface RecordTableProps {
  records: StudentRecord[];
}

export const RecordTable: React.FC<RecordTableProps> = ({ records }) => {
  const getIcon = (type: RecordType) => {
    switch (type) {
      case RecordType.ACHIEVEMENT: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case RecordType.ACADEMIC: return <FileText className="w-4 h-4 text-blue-500" />;
      case RecordType.ACTIVITY: return <Activity className="w-4 h-4 text-green-500" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (grade: string) => {
    const isGood = ['A', 'A-', '1st Place', 'Winner', 'Gold'].some(v => grade.includes(v));
    const isAvg = ['B', 'B+', 'Finalist'].some(v => grade.includes(v));
    
    let bgClass = 'bg-slate-100 text-slate-700';
    if (isGood) bgClass = 'bg-green-50 text-green-700 border border-green-200';
    else if (isAvg) bgClass = 'bg-blue-50 text-blue-700 border border-blue-200';
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${bgClass}`}>
        {grade}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Academic & Achievement Log</h3>
          <p className="text-sm text-slate-500 mt-1">Detailed history of grades, awards, and activities.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description / Subject</th>
              <th className="px-6 py-4">Verifier / Lecturer</th>
              <th className="px-6 py-4 text-center">Result/Grade</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{record.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getIcon(record.category)}
                    <span className="text-sm text-slate-600">{record.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-800">{record.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{record.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {record.verifiedBy.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-600">{record.verifiedBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getStatusBadge(record.gradeOrResult)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">1-5</span> of <span className="font-semibold text-slate-700">{records.length}</span> results</p>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-300 rounded bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-600">1</button>
          <button className="px-3 py-1 border border-slate-300 rounded bg-white text-sm text-slate-600 hover:bg-slate-50">2</button>
          <button className="px-3 py-1 border border-slate-300 rounded bg-white text-sm text-slate-600 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
};