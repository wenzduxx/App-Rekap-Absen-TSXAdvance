import React, { useState, useRef, useEffect } from 'react';
import { StatsCards } from '../components/StatsCards';
import { RecordTable } from '../components/RecordTable';
import { StudentProfile, AcademicStat, SemesterResult } from '../types';
import { TuitionHistoryModal } from '../components/TuitionHistoryModal';
import { ChevronRight, Edit2, Calendar, Book, ShieldCheck, ArrowLeft, Camera, CreditCard, CheckCircle2, XCircle, FileText, History, Clock, Star, HelpingHand, Landmark, Award, ChevronDown } from 'lucide-react';

interface StudentDetailProps {
  student: StudentProfile;
  onBack: () => void;
  onEdit?: () => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack, onEdit }) => {
  const [avatar, setAvatar] = useState(student.avatarUrl);
  const [showTuitionHistory, setShowTuitionHistory] = useState(false);
  
  // Semester State: 'overview' means Cumulative, otherwise SemesterResult ID
  const [selectedSemId, setSelectedSemId] = useState<string>('overview');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(student.avatarUrl);
    setSelectedSemId('overview'); // Reset view when student changes
  }, [student]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- LOGIC FOR PER SEMESTER DATA & TRENDS ---

  // Helper to calculate trend percentage
  const calculateTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
  };

  const getDisplayedStats = (): AcademicStat[] => {
    const history = student.academicHistory || [];

    if (selectedSemId === 'overview') {
        // CUMULATIVE VIEW
        const currentGpa = student.gpa;
        const currentCredits = student.totalCredits;
        
        // Find the last semester record to compare "Cumulative vs Previous Cumulative"
        // Assuming history is sorted, or we take the last element
        const lastSem = history.length > 0 ? history[history.length - 1] : null;
        const secondLastSem = history.length > 1 ? history[history.length - 2] : null;
        
        // Trend: Compare Current Cumulative GPA with Cumulative GPA at end of previous semester
        // If no history, assume 0 trend
        let trendValue = 0;
        if (history.length === 1) {
             // Only 1 sem exist, trend is vs 0? Or neutral. Let's make it 100% growth or just 0.
             trendValue = 0;
        } else if (secondLastSem) {
             // Compare Latest Cumulative vs Previous Cumulative
             // Note: student.gpa should ideally be equal to lastSem.cumulativeGpa if data syncs
             // Use lastSem vs secondLastSem cumulative
             trendValue = calculateTrend(currentGpa, secondLastSem.cumulativeGpa);
        }

        return [
            { 
                label: 'Cumulative GPA (IPK)', 
                value: currentGpa.toFixed(2), 
                trend: Math.abs(trendValue), 
                trendDirection: trendValue >= 0 ? 'up' : 'down', 
                color: 'blue',
                subtext: 'vs prev. semester IPK'
            },
            { label: 'Total Credits (SKS)', value: currentCredits, color: 'yellow', subtext: 'Total Accumulated' },
            { label: 'Achievements', value: student.achievementCount, color: 'orange' },
            { label: 'Discipline Points', value: student.disciplinePoints, color: 'red' },
        ];
    } else {
        // SPECIFIC SEMESTER VIEW
        const currentSem = history.find(h => h.id === selectedSemId);
        if (!currentSem) return []; // Should not happen

        // Find previous semester relative to selected one
        const currentIndex = history.findIndex(h => h.id === selectedSemId);
        const prevSem = currentIndex > 0 ? history[currentIndex - 1] : null;

        // Trend: Compare Semester IPS vs Previous Semester IPS
        const trendValue = prevSem ? calculateTrend(currentSem.gpa, prevSem.gpa) : 0;

        return [
            { 
                label: 'Semester GPA (IPS)', 
                value: currentSem.gpa.toFixed(2), 
                trend: prevSem ? Math.abs(trendValue) : undefined, 
                trendDirection: trendValue >= 0 ? 'up' : 'down', 
                color: 'blue',
                subtext: prevSem ? 'vs prev. semester IPS' : 'First Semester'
            },
            { label: 'Credits Taken (SKS)', value: currentSem.credits, color: 'yellow', subtext: 'Taken this semester' },
            { label: 'Achievements', value: '-', color: 'orange', subtext: 'Data not filtered' }, // Mock: filtering records by date is complex, keeping simple
            { label: 'Discipline Points', value: '-', color: 'red', subtext: 'Data not filtered' },
        ];
    }
  };

  const stats = getDisplayedStats();

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-emerald-600 bg-emerald-500';
      case 'Good': return 'text-blue-600 bg-blue-500';
      case 'Warning': return 'text-amber-600 bg-amber-500';
      case 'Critical': return 'text-red-600 bg-red-500';
      default: return 'text-slate-600 bg-slate-500';
    }
  };

  // Study Progress Calculation
  const progressPercentage = Math.min(Math.round((student.totalCredits / student.targetCredits) * 100), 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Tuition History Modal */}
      {showTuitionHistory && (
          <TuitionHistoryModal 
              student={student} 
              onClose={() => setShowTuitionHistory(false)} 
          />
      )}

      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-500 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <nav className="flex items-center text-sm text-slate-500 font-medium">
              <a href="#" onClick={(e) => {e.preventDefault(); onBack();}} className="hover:text-primary transition-colors">Students</a>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-slate-900">Student Detail</span>
            </nav>
          </div>
          
          {/* SEMESTER FILTER DROPDOWN */}
          <div className="relative group">
              <div className="absolute right-0 top-0 h-full w-full pointer-events-none flex items-center justify-end pr-3 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
              </div>
              <select 
                  value={selectedSemId}
                  onChange={(e) => setSelectedSemId(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-slate-300 transition-all cursor-pointer min-w-[200px]"
              >
                  <option value="overview">Overview (Cumulative)</option>
                  {student.academicHistory && student.academicHistory.length > 0 && (
                      <optgroup label="Semester History">
                          {[...student.academicHistory].reverse().map((sem) => (
                              <option key={sem.id} value={sem.id}>{sem.semesterName}</option>
                          ))}
                      </optgroup>
                  )}
              </select>
          </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="relative shrink-0 group">
            <div className="w-28 h-28 rounded-full p-1 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <img 
                src={avatar} 
                alt={student.name} 
                className="w-full h-full rounded-full object-cover"
              />
              {onEdit && (
                <div 
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
                >
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] font-medium text-white">Change</span>
                </div>
              )}
            </div>
            {onEdit && (
                <>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <button 
                        onClick={triggerFileInput}
                        className="absolute bottom-1 right-0 p-1.5 bg-white rounded-full border border-slate-200 shadow-sm text-slate-500 hover:text-primary hover:border-primary transition-colors md:hidden"
                    >
                        <Camera className="w-3 h-3" />
                    </button>
                </>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-2">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                student.status === 'Active' 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {student.status} Student
              </span>
            </div>
            
            <p className="text-slate-500 mb-4 font-mono text-sm">NIM: {student.nim}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-50 text-slate-600 text-sm border border-slate-100">
                <Book className="w-4 h-4 text-slate-400" />
                {student.major}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-50 text-slate-600 text-sm border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400" />
                Batch {student.batch}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-50 text-slate-600 text-sm border border-slate-100">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-slate-900">{student.gpa}</span>
                <span className="text-xs text-slate-500 font-medium">GPA</span>
              </div>
            </div>
          </div>

          {onEdit && (
            <button 
                onClick={onEdit}
                className="shrink-0 flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-200 mt-4 md:mt-2"
            >
                <Edit2 className="w-4 h-4" />
                Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <StatsCards stats={stats} />

      {/* Attendance Progress & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <RecordTable records={student.records} />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
              {/* Study Progress */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Study Progress</h3>
                    <p className="text-xs text-slate-500">Credits completed</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 text-right font-medium">{student.totalCredits} / {student.targetCredits} SKS</p>
              </div>

              {/* Attendance Rate */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Attendance</h3>
                      <p className="text-xs text-slate-500">This Semester</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-bold ${getAttendanceColor(student.attendanceStatus).split(' ')[0]}`}>{student.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${getAttendanceColor(student.attendanceStatus).split(' ')[1]}`} style={{ width: `${student.pct}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-xs text-slate-500 font-medium">{student.h} Present, {student.a} Absent</p>
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${student.attendanceStatus === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {student.attendanceStatus}
                   </span>
                </div>
              </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
              {/* Good Standing */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <ShieldCheck className="w-5 h-5" />
                         </div>
                         <h3 className="font-bold text-lg text-slate-900">Good Standing</h3>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100">
                        Verified
                    </span>
                </div>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {student.goodStandingNote || `${student.name.split(' ')[0]} has maintained excellent academic integrity and has no disciplinary records.`}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-50">
                    <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1 group">
                        View Conduct Report <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
              </div>

               {/* Tuition Status */}
               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${student.tuitionStatus === 'Paid' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                            <CreditCard className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-lg text-slate-900">Tuition (SPP)</h3>
                            <p className="text-xs text-slate-500">Sem. Ganjil 2023/2024</p>
                         </div>
                    </div>
                     {student.tuitionStatus === 'Paid' ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                        </span>
                        ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] uppercase font-bold border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> UNPAID
                        </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Invoice Due/Paid</span>
                      <span className={`text-xs font-bold ${student.tuitionStatus === 'Unpaid' ? 'text-red-600' : 'text-slate-700'}`}>
                          {student.tuitionDate}
                      </span>
                  </div>

                   {/* ELEGANT FINANCIAL CONTEXT - The new feature */}
                   <div className="mt-4 bg-white border border-slate-100 rounded-lg p-3 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 z-0"></div>
                       <div className="relative z-10 flex justify-between items-center">
                           <div className="flex items-center gap-2">
                               <Landmark className="w-4 h-4 text-slate-400" />
                               <div className="flex flex-col">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Financial Category</span>
                                   <span className="text-xs font-bold text-slate-700">Category {student.economicTier || 3} {student.isScholarship ? '• Scholarship' : ''}</span>
                               </div>
                           </div>
                           
                           {/* Conditional Elegant Indicator for Low Income / Unpaid */}
                           {student.tuitionStatus !== 'Paid' && (student.economicTier === 1 || student.economicTier === 2) && (
                               <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md shadow-sm">
                                   <HelpingHand className="w-3.5 h-3.5" />
                                   <span className="text-[10px] font-bold">Priority Support</span>
                               </div>
                           )}

                           {/* Scholarship Badge if Paid */}
                           {student.tuitionStatus === 'Paid' && student.isScholarship && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md shadow-sm">
                                    <Award className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold">Grantee</span>
                                </div>
                           )}
                       </div>
                   </div>

                   <div className="mt-4 flex gap-3">
                       <button className="flex-1 py-2 text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <FileText className="w-3 h-3" /> Invoice
                       </button>
                       <button 
                           onClick={() => setShowTuitionHistory(true)}
                           className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <History className="w-3 h-3" /> History
                       </button>
                   </div>
              </div>
          </div>
      </div>

    </div>
  );
};