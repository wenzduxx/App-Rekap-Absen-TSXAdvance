import React, { useState } from 'react';
import { User, AlertTriangle, TrendingUp, Users, Calendar, Download, Printer, Filter, Award, BarChart2, PieChart, TrendingDown, BookOpen, CreditCard, Clock, ChevronRight } from 'lucide-react';

export const Statistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('This Semester');
  const [comparisonMode, setComparisonMode] = useState<'major' | 'batch'>('major');

  // Mock Data for Comparative Analysis
  const dataByMajor = [
      { label: 'Computer Science', value: 92, count: 120, color: 'bg-blue-500' },
      { label: 'Information Systems', value: 88, count: 95, color: 'bg-indigo-500' },
      { label: 'Accounting', value: 95, count: 80, color: 'bg-emerald-500' },
      { label: 'Management', value: 78, count: 110, color: 'bg-amber-500' },
      { label: 'Psychology', value: 90, count: 65, color: 'bg-pink-500' },
  ];

  const dataByBatch = [
      { label: 'Batch 2024', value: 96, count: 150, color: 'bg-emerald-500' },
      { label: 'Batch 2023', value: 88, count: 140, color: 'bg-blue-500' },
      { label: 'Batch 2022', value: 82, count: 130, color: 'bg-indigo-500' },
      { label: 'Batch 2021', value: 75, count: 120, color: 'bg-amber-500' },
      { label: 'Batch 2020', value: 60, count: 40, color: 'bg-red-500' },
  ];

  const activeComparisonData = comparisonMode === 'major' ? dataByMajor : dataByBatch;

  // Mock Data for Low GPA
  const lowGpaStudents = [
      { name: 'Rudi Ardiansyah', nim: '10293852', major: 'Comp. Science', gpa: 2.90, prevGpa: 3.10, initials: 'RA', color: 'bg-orange-100 text-orange-600' },
      { name: 'James Rodriguez', nim: '202200567', major: 'Software Eng', gpa: 2.45, prevGpa: 2.80, initials: 'JR', color: 'bg-red-100 text-red-600' },
      { name: 'Ahmad Kurniawan', nim: '10293811', major: 'Management', gpa: 2.10, prevGpa: 2.15, initials: 'AK', color: 'bg-red-100 text-red-600' },
  ];

  // Mock Data for Unpaid Tuition
  const unpaidStudents = [
      { name: 'James Rodriguez', nim: '202200567', amount: 5500000, dueDate: 'Aug 15, 2023', status: 'Overdue' },
      { name: 'Rudi Ardiansyah', nim: '10293852', amount: 5500000, dueDate: 'Sep 01, 2023', status: 'Pending' },
      { name: 'Sarah Connor', nim: '202200991', amount: 2750000, dueDate: 'Sep 15, 2023', status: 'Pending' },
  ];

  const formatIDR = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="w-full space-y-8 pb-10">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold leading-tight text-slate-900">Attendance Analytics</h2>
          <p className="text-slate-500 text-sm">Comprehensive report on student attendance and academic correlation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                >
                    <option>This Semester</option>
                    <option>Last Semester</option>
                    <option>Academic Year 2023/2024</option>
                </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors shadow-sm">
                <Printer className="w-4 h-4" />
                Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#135bec] hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-200">
                <Download className="w-4 h-4" />
                Export PDF
            </button>
        </div>
      </div>

      {/* KPI Cards - Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex justify-between items-start z-10">
                  <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Attendance</p>
                      <h3 className="text-3xl font-bold text-slate-900 mt-1">87.5%</h3>
                  </div>
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <TrendingUp className="w-5 h-5" />
                  </div>
              </div>
              <div className="flex items-center gap-2 z-10">
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                      ↑ 2.1%
                  </span>
                  <span className="text-xs text-slate-400">vs last month</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex justify-between items-start z-10">
                  <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Warnings</p>
                      <h3 className="text-3xl font-bold text-slate-900 mt-1">24</h3>
                  </div>
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                      <AlertTriangle className="w-5 h-5" />
                  </div>
              </div>
              <div className="flex items-center gap-2 z-10">
                  <span className="text-xs font-bold text-red-500 flex items-center">
                      + 5 New
                  </span>
                  <span className="text-xs text-slate-400">this week</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex justify-between items-start z-10">
                  <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perfect Attendance</p>
                      <h3 className="text-3xl font-bold text-slate-900 mt-1">142</h3>
                  </div>
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Award className="w-5 h-5" />
                  </div>
              </div>
              <div className="flex items-center gap-2 z-10">
                  <span className="text-xs text-slate-500">
                      Students with 100% (H)
                  </span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex justify-between items-start z-10">
                  <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Students</p>
                      <h3 className="text-3xl font-bold text-slate-900 mt-1">1,204</h3>
                  </div>
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                      <Users className="w-5 h-5" />
                  </div>
              </div>
              <div className="flex items-center gap-2 z-10">
                   <span className="text-xs text-slate-500">
                      Total enrolled
                  </span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COL: Comparative Analysis */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-slate-400" />
                        Comparative Attendance
                    </h3>
                    <p className="text-xs text-slate-500">Average attendance rate breakdown</p>
                </div>
                {/* Tabs */}
                <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
                    <button 
                        onClick={() => setComparisonMode('major')}
                        className={`px-4 py-1.5 rounded-md transition-all ${comparisonMode === 'major' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        By Major
                    </button>
                    <button 
                        onClick={() => setComparisonMode('batch')}
                        className={`px-4 py-1.5 rounded-md transition-all ${comparisonMode === 'batch' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        By Batch
                    </button>
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center space-y-5">
                {activeComparisonData.map((item, idx) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                            <span className="text-xs font-medium text-slate-500">{item.value}% <span className="text-slate-300">|</span> {item.count} students</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-90 ${item.color}`} 
                                style={{ width: `${item.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
                <p className="text-xs text-slate-500 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <strong>Insight:</strong> {comparisonMode === 'major' ? 'Accounting' : 'Batch 2024'} has the highest attendance consistency this month.
                </p>
            </div>
        </div>

        {/* RIGHT COL: Overall Distribution */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-slate-400" />
                  Overall Distribution
              </h3>
              <p className="text-xs text-slate-500">Total breakdown by status</p>
           </div>
           
           <div className="p-6 flex-1 flex flex-col items-center justify-center relative">
              <div className="relative w-56 h-56 rounded-full shadow-inner animate-in fade-in zoom-in duration-500 flex items-center justify-center" style={{
                  background: 'conic-gradient(#10b981 0% 75%, #f59e0b 75% 85%, #3b82f6 85% 92%, #ef4444 92% 100%)'
              }}>
                 <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-sm z-10">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">2.4k</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Records</span>
                 </div>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-8">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
                        <span className="text-xs font-bold text-slate-600">Present</span>
                     </div>
                     <span className="text-xs font-mono text-slate-400">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-200"></span>
                        <span className="text-xs font-bold text-slate-600">Permit</span>
                     </div>
                     <span className="text-xs font-mono text-slate-400">10%</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
                        <span className="text-xs font-bold text-slate-600">Sick</span>
                     </div>
                     <span className="text-xs font-mono text-slate-400">7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-200"></span>
                        <span className="text-xs font-bold text-slate-600">Alpha</span>
                     </div>
                     <span className="text-xs font-mono text-slate-400">8%</span>
                  </div>
              </div>
           </div>
        </div>

        {/* BOTTOM ROW: Monthly Trends */}
        <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Monthly Attendance Trends</h3>
                    <p className="text-xs text-slate-500">Historical performance view</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Target &gt; 85%
                    </span>
                </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 w-full pt-4 pb-2 relative">
                {/* Background Lines */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between text-xs text-slate-400 pb-8 opacity-20 z-0">
                    <div className="w-full border-t border-slate-400"></div>
                    <div className="w-full border-t border-slate-400"></div>
                    <div className="w-full border-t border-slate-400"></div>
                    <div className="w-full border-t border-slate-400"></div>
                    <div className="w-full border-t border-slate-400"></div>
                </div>

                {[
                    { month: 'Aug', pct: 85, h: '85%' },
                    { month: 'Sep', pct: 92, h: '92%' },
                    { month: 'Oct', pct: 88, h: '88%' },
                    { month: 'Nov', pct: 78, h: '78%' },
                    { month: 'Dec', pct: 65, h: '65%' },
                    { month: 'Jan', pct: 45, h: '45%' }, // Simulated drop
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 flex-1 group z-10 h-full justify-end">
                        <div className="w-full max-w-[60px] bg-slate-100 rounded-t-lg relative flex items-end justify-center group-hover:bg-slate-200 transition-colors h-full">
                            <div 
                                className={`w-full rounded-t-lg relative transition-all duration-700 ${item.pct < 75 ? 'bg-amber-400' : 'bg-[#135bec]'}`} 
                                style={{ height: item.h }}
                            >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl transition-all whitespace-nowrap z-20">
                                    {item.pct}% Rate
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* BOTTOM SECTION: Students at Risk Table */}
        <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
              <div>
                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="text-red-500 w-5 h-5" />
                    Students at Risk (Attendance)
                 </h3>
                 <p className="text-xs text-slate-500">Requires immediate academic intervention</p>
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 shadow-sm">
                  View All Risks
              </button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50">
                    <tr>
                       <th className="p-4 text-xs font-bold tracking-wide text-slate-500 uppercase border-b border-slate-200">Student Name</th>
                       <th className="p-4 text-xs font-bold tracking-wide text-slate-500 uppercase border-b border-slate-200">Major/Batch</th>
                       <th className="p-4 text-xs font-bold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Absences (Alpha)</th>
                       <th className="p-4 text-xs font-bold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-center">Attendance Rate</th>
                       <th className="p-4 text-xs font-bold tracking-wide text-slate-500 uppercase border-b border-slate-200 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-red-50/50 transition-colors group">
                       <td className="p-4">
                          <div className="flex items-center gap-3">
                             <div className="h-9 w-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs border border-red-200">AK</div>
                             <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">Ahmad Kurniawan</span>
                                <span className="text-xs text-slate-500 font-mono">10293811</span>
                             </div>
                          </div>
                       </td>
                       <td className="p-4">
                           <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">Management</span>
                                <span className="text-xs text-slate-400">Batch 2023</span>
                           </div>
                       </td>
                       <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center h-6 px-3 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                             7 Alpha
                          </span>
                       </td>
                       <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                             <span className="text-sm font-bold text-red-600">40%</span>
                             <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: '40%' }}></div>
                             </div>
                          </div>
                       </td>
                       <td className="p-4 text-right">
                          <button className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-200 transition-colors">
                             Send Warning
                          </button>
                       </td>
                    </tr>
                    
                    <tr className="hover:bg-amber-50/50 transition-colors group">
                       <td className="p-4">
                          <div className="flex items-center gap-3">
                             <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs border border-orange-200">RA</div>
                             <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">Rudi Ardiansyah</span>
                                <span className="text-xs text-slate-500 font-mono">10293852</span>
                             </div>
                          </div>
                       </td>
                       <td className="p-4">
                           <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">Comp. Science</span>
                                <span className="text-xs text-slate-400">Batch 2023</span>
                           </div>
                       </td>
                       <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center h-6 px-3 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                             2 Alpha
                          </span>
                       </td>
                       <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                             <span className="text-sm font-bold text-orange-600">66.7%</span>
                             <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: '66.7%' }}></div>
                             </div>
                          </div>
                       </td>
                       <td className="p-4 text-right">
                          <button className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-colors">
                             View Details
                          </button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        {/* ADDITIONAL ALERTS SECTION */}
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GPA Alert Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Academic Performance Alerts</h3>
                            <p className="text-[10px] text-slate-500">Students with GPA below 3.00</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                            {lowGpaStudents.map((student, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-[10px] border border-slate-100 ${student.color}`}>
                                                {student.initials}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{student.name}</div>
                                                <div className="text-xs text-slate-500">{student.major}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-bold text-red-600">{student.gpa.toFixed(2)}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <TrendingDown className="w-3 h-3 text-red-400" />
                                                from {student.prevGpa.toFixed(2)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded hover:bg-slate-50">
                                            Counsel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Unpaid Tuition Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Outstanding Tuition Fees</h3>
                            <p className="text-[10px] text-slate-500">Unpaid or Pending payments</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                            {unpaidStudents.map((student, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{student.name}</span>
                                            <span className="text-xs text-slate-500 font-mono">{student.nim}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{formatIDR(student.amount)}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                <Clock className="w-3 h-3" /> Due: {student.dueDate}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${student.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};