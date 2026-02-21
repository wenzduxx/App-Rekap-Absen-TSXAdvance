import React, { useState } from 'react';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { StudentProfile } from '../types';
import { mockStudents } from '../data';

interface DashboardProps {
  onSelectStudent?: (student: StudentProfile) => void;
  students?: StudentProfile[];
  onNavigateToHistory?: (viewMode: 'issues' | 'all') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectStudent, students: propStudents, onNavigateToHistory }) => {
  // Use props if available, otherwise fallback (though App.tsx now always passes it)
  const students = propStudents || mockStudents;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedMajor, setSelectedMajor] = useState('all');

  // Filter Logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.includes(searchTerm);
    
    const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
    const matchesMajor = selectedMajor === 'all' || student.major === selectedMajor;

    return matchesSearch && matchesBatch && matchesMajor;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  const getProgressColor = (status: string) => {
      switch(status) {
      case 'Excellent': return 'bg-emerald-500';
      case 'Good': return 'bg-blue-500';
      case 'Warning': return 'bg-amber-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  }

  const getTextColor = (status: string) => {
      switch(status) {
      case 'Excellent': return 'text-emerald-600';
      case 'Good': return 'text-blue-600';
      case 'Warning': return 'text-amber-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-slate-900';
    }
  }

  const getAvatarColor = (color: string) => {
      const colors: any = {
          blue: 'bg-blue-100 text-blue-600',
          purple: 'bg-purple-100 text-purple-600',
          orange: 'bg-orange-100 text-orange-600',
          teal: 'bg-teal-100 text-teal-600',
          red: 'bg-red-100 text-red-600',
          indigo: 'bg-indigo-100 text-indigo-600',
          green: 'bg-emerald-100 text-emerald-600',
      };
      return colors[color] || colors.blue;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold leading-tight text-slate-900">Student Attendance Overview</h2>
          <p className="text-slate-500 text-sm font-normal">Manage and view detailed student attendance records for the current semester.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-stretch justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 w-full md:max-w-xs lg:max-w-md">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Search Student</label>
          <div className="relative flex w-full items-center rounded-lg h-10 border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500/50 overflow-hidden transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 text-sm placeholder:text-slate-500/70 h-full w-full outline-none" 
                placeholder="Find by Name or NIM..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Major Filter */}
          <div className="flex-1 md:w-40 min-w-[140px]">
             <label className="block text-xs font-medium text-slate-500 mb-1.5">Filter by Major</label>
             <div className="relative">
                <select 
                  className="w-full appearance-none rounded-lg h-10 border border-slate-200 bg-white text-slate-900 text-sm px-3 pr-8 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer truncate"
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                >
                    <option value="all">All Majors</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Systems">Information Systems</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Management">Management</option>
                    <option value="Psychology">Psychology</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-slate-500 pointer-events-none w-5 h-5" />
             </div>
          </div>

          {/* Angkatan Filter */}
          <div className="flex-1 md:w-36 min-w-[130px]">
             <label className="block text-xs font-medium text-slate-500 mb-1.5">Filter by Angkatan</label>
             <div className="relative">
                <select 
                  className="w-full appearance-none rounded-lg h-10 border border-slate-200 bg-white text-slate-900 text-sm px-3 pr-8 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                    <option value="all">All Batches</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-slate-500 pointer-events-none w-5 h-5" />
             </div>
          </div>

          {/* Export Button */}
          <div className="flex-none flex items-end">
            <button className="flex items-center justify-center h-10 px-4 bg-[#135bec] hover:bg-blue-700 text-white rounded-lg gap-2 text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#135bec]">
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f6f6f8] sticky top-0 z-10">
                    <tr>
                        <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Student Name</th>
                        <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">NIM</th>
                        <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Major & Batch</th>
                        <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Gender</th>
                        <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Attendance Details</th>
                        <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Percentage</th>
                        <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                            <td className="p-4">
                                <div 
                                  className="flex items-center gap-3 pl-4 md:pl-8 cursor-pointer"
                                  onClick={() => onSelectStudent && onSelectStudent(student)}
                                >
                                    <div className={`h-9 w-9 rounded-full ${getAvatarColor(student.color)} flex items-center justify-center font-bold text-sm shrink-0 group-hover:ring-2 group-hover:ring-blue-200 transition-all`}>
                                        {student.initials}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-bold text-slate-900 group-hover:text-[#135bec] transition-colors decoration-blue-500/30 underline-offset-4 group-hover:underline">{student.name}</span>
                                        <span className="text-xs text-slate-400 md:hidden">{student.nim}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-slate-500 font-mono text-center">{student.nim}</td>
                            <td className="p-4 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-xs font-bold text-slate-700">{student.major}</span>
                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1">Batch {student.batch}</span>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                <span className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-medium ${student.gender === 'Male' ? 'bg-slate-100 text-slate-600' : 'bg-pink-50 text-pink-600'}`}>
                                    {student.gender === 'Male' ? 'L' : 'P'}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-slate-900">
                                {/* Improved Attendance Display */}
                                <div className="flex items-center justify-center gap-2">
                                    <div 
                                        onClick={(e) => { e.stopPropagation(); onNavigateToHistory && onNavigateToHistory('all'); }}
                                        className="flex flex-col items-center justify-center w-10 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-100 hover:scale-105 transition-all"
                                        title="View All History"
                                    >
                                        <span className="text-[10px] font-bold uppercase text-emerald-500/80">H</span>
                                        <span className="text-sm font-bold">{student.h}</span>
                                    </div>
                                    <div 
                                        onClick={(e) => { e.stopPropagation(); onNavigateToHistory && onNavigateToHistory('issues'); }}
                                        className="flex flex-col items-center justify-center w-10 py-1 rounded bg-amber-50 border border-amber-100 text-amber-700 cursor-pointer hover:bg-amber-100 hover:scale-105 transition-all"
                                        title="View Absence & Issues"
                                    >
                                        <span className="text-[10px] font-bold uppercase text-amber-500/80">I</span>
                                        <span className="text-sm font-bold">{student.i}</span>
                                    </div>
                                    <div 
                                        onClick={(e) => { e.stopPropagation(); onNavigateToHistory && onNavigateToHistory('issues'); }}
                                        className="flex flex-col items-center justify-center w-10 py-1 rounded bg-blue-50 border border-blue-100 text-blue-700 cursor-pointer hover:bg-blue-100 hover:scale-105 transition-all"
                                        title="View Absence & Issues"
                                    >
                                        <span className="text-[10px] font-bold uppercase text-blue-500/80">S</span>
                                        <span className="text-sm font-bold">{student.s}</span>
                                    </div>
                                    <div 
                                        onClick={(e) => { e.stopPropagation(); onNavigateToHistory && onNavigateToHistory('issues'); }}
                                        className="flex flex-col items-center justify-center w-10 py-1 rounded bg-red-50 border border-red-100 text-red-700 cursor-pointer hover:bg-red-100 hover:scale-105 transition-all"
                                        title="View Absence & Issues"
                                    >
                                        <span className="text-[10px] font-bold uppercase text-red-500/80">A</span>
                                        <span className="text-sm font-bold">{student.a}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
                                    <span className={`text-sm font-bold ${getTextColor(student.attendanceStatus)}`}>{student.pct}%</span>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className={`${getProgressColor(student.attendanceStatus)} h-full rounded-full`} style={{width: `${student.pct}%`}}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.attendanceStatus)}`}>
                                    {student.attendanceStatus}
                                </span>
                            </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No students found matching your criteria.
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 bg-white">
            <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{filteredStudents.length}</span> of <span className="font-medium text-slate-900">{students.length}</span> students</p>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-slate-200 bg-[#f6f6f8] text-slate-500 hover:bg-slate-100 disabled:opacity-50">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="h-8 w-8 rounded-lg bg-[#135bec] text-white text-sm font-medium">1</button>
                <button className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-500 text-sm font-medium transition-colors">2</button>
                <button className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-500 text-sm font-medium transition-colors">3</button>
                <button className="p-2 rounded-lg border border-slate-200 bg-[#f6f6f8] text-slate-500 hover:bg-slate-100">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};