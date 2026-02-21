import React, { useState, useEffect, useRef } from 'react';
import { User, CheckCircle, Save, ChevronDown, Search, Calendar, History, FileText, Filter, AlertCircle, XCircle, Clock, Paperclip, Eye, X, Image as ImageIcon, UploadCloud, Check, Database, Edit, AlertTriangle, ArrowLeft, RefreshCw, Trash2, Eraser } from 'lucide-react';
import { mockStudents } from '../data';
import { StudentProfile } from '../types';

interface AttendanceStudent {
  id: string;
  name: string;
  nim: string;
  gender: 'L' | 'P';
  initials: string;
  color: string;
  status: 'H' | 'I' | 'S' | 'A' | null;
  note: string;
  proof: string | null; // Base64 string or URL
  proofType: 'image' | 'pdf' | null;
  proofName: string | null;
  batch: string;
  major: string;
}

// Interface for the History feature
interface AttendanceLog {
  id: string;
  date: string;
  studentName: string;
  nim: string;
  status: 'H' | 'I' | 'S' | 'A';
  note: string; 
  proof?: string | null;
  proofType?: 'image' | 'pdf' | null;
  avatarColor: string;
  initials: string;
  batch: string;
}

// Initial Mock Data
const initialHistoryData: AttendanceLog[] = [
    // Today / Recent
    { 
        id: '1', 
        date: '2023-10-24', 
        studentName: 'Rudi Ardiansyah', 
        nim: '10293852', 
        status: 'S', 
        note: 'Demam tinggi, surat dokter terlampir', 
        proof: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1000', // Mock Doctor Letter
        proofType: 'image',
        avatarColor: 'orange', 
        initials: 'RA', 
        batch: '2023' 
    },
    { id: '2', date: '2023-10-24', studentName: 'Ahmad Kurniawan', nim: '10293811', status: 'A', note: 'Tanpa keterangan', avatarColor: 'red', initials: 'AK', batch: '2023' },
    { id: '3', date: '2023-10-24', studentName: 'Siti Aminah', nim: '10293845', status: 'H', note: '', avatarColor: 'purple', initials: 'SA', batch: '2023' },
    { id: '4', date: '2023-10-24', studentName: 'Budi Santoso', nim: '10293844', status: 'H', note: '', avatarColor: 'blue', initials: 'BS', batch: '2023' },
    { id: '5', date: '2023-10-24', studentName: 'Dewi Wulandari', nim: '10293860', status: 'H', note: '', avatarColor: 'teal', initials: 'DW', batch: '2023' },
    
    // Yesterday
    { 
        id: '6', 
        date: '2023-10-23', 
        studentName: 'Siti Aminah', 
        nim: '10293845', 
        status: 'I', 
        note: 'Acara keluarga (Pernikahan Kakak)', 
        proof: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000', // Mock Invitation
        proofType: 'image',
        avatarColor: 'purple', 
        initials: 'SA', 
        batch: '2023' 
    },
    { id: '7', date: '2023-10-23', studentName: 'James Rodriguez', nim: '202200567', status: 'A', note: 'Bolos jam ke-2', avatarColor: 'red', initials: 'JR', batch: '2022' },
    { id: '8', date: '2023-10-23', studentName: 'Rudi Ardiansyah', nim: '10293852', status: 'H', note: '', avatarColor: 'orange', initials: 'RA', batch: '2023' },
    { id: '9', date: '2023-10-23', studentName: 'Budi Santoso', nim: '10293844', status: 'H', note: '', avatarColor: 'blue', initials: 'BS', batch: '2023' },
    
    // Older
    { id: '10', date: '2023-10-22', studentName: 'Budi Santoso', nim: '10293844', status: 'I', note: 'Mewakili kampus lomba coding', avatarColor: 'blue', initials: 'BS', batch: '2023' },
    { id: '11', date: '2023-10-22', studentName: 'Ahmad Kurniawan', nim: '10293811', status: 'A', note: '', avatarColor: 'red', initials: 'AK', batch: '2023' },
    { id: '12', date: '2023-10-22', studentName: 'Siti Aminah', nim: '10293845', status: 'H', note: '', avatarColor: 'purple', initials: 'SA', batch: '2023' },
    { id: '13', date: '2023-10-22', studentName: 'Rudi Ardiansyah', nim: '10293852', status: 'H', note: '', avatarColor: 'orange', initials: 'RA', batch: '2023' },
];

interface AttendanceProps {
  initialTab?: 'input' | 'history';
  initialViewMode?: 'issues' | 'all';
}

export const Attendance: React.FC<AttendanceProps> = ({ initialTab, initialViewMode }) => {
  const [activeTab, setActiveTab] = useState<'input' | 'history'>('input');
  
  // Input State
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBatch, setSelectedBatch] = useState('All Batch');
  const [selectedMajor, setSelectedMajor] = useState('All Majors');

  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditDateModal, setShowEditDateModal] = useState(false);
  const [editDateInput, setEditDateInput] = useState('');
  
  // History & Deletion State
  const [historyData, setHistoryData] = useState<AttendanceLog[]>(initialHistoryData);
  const [historySearch, setHistorySearch] = useState('');
  const [historyViewMode, setHistoryViewMode] = useState<'issues' | 'all'>('issues'); 
  const [historyBatchFilter, setHistoryBatchFilter] = useState('All');
  const [historyDateFilter, setHistoryDateFilter] = useState(''); // New: Filter for Bulk Delete

  // Delete Modals
  const [deleteConfirmType, setDeleteConfirmType] = useState<'single' | 'bulk' | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AttendanceLog | null>(null); // For single delete

  // Modal State for Viewing Proof
  const [previewProof, setPreviewProof] = useState<{url: string, type: string, title: string} | null>(null);

  // Success Save State
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveStats, setSaveStats] = useState({ total: 0, h: 0, i: 0, s: 0, a: 0 });

  // Handle Initial Props
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialViewMode) setHistoryViewMode(initialViewMode);
  }, [initialTab, initialViewMode]);

  // Initialize data from mockStudents when component mounts
  useEffect(() => {
    resetStudentData();
  }, []);

  const resetStudentData = () => {
    const formattedStudents: AttendanceStudent[] = mockStudents.map((s: StudentProfile) => ({
        id: s.id,
        name: s.name,
        nim: s.nim,
        gender: s.gender === 'Male' ? 'L' : 'P',
        initials: s.initials,
        color: s.color,
        status: null, // Default to null for new input
        note: '',
        proof: null,
        proofType: null,
        proofName: null,
        batch: s.batch,
        major: s.major
    }));
    setStudents(formattedStudents);
  };

  const handleStatusChange = (id: string, status: 'H' | 'I' | 'S' | 'A') => {
    setStudents(students.map(s => {
        if (s.id === id) {
            const shouldResetProof = (status === 'H'); 
            return { 
                ...s, 
                status,
                proof: shouldResetProof ? null : s.proof,
                proofName: shouldResetProof ? null : s.proofName,
                note: shouldResetProof ? '' : s.note
            };
        }
        return s;
    }));
  };

  const handleNoteChange = (id: string, note: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, note } : s));
  };

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudents(students.map(s => s.id === id ? { 
            ...s, 
            proof: reader.result as string, 
            proofType: file.type.includes('image') ? 'image' : 'pdf',
            proofName: file.name
        } : s));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProof = (id: string) => {
      setStudents(students.map(s => s.id === id ? { ...s, proof: null, proofType: null, proofName: null } : s));
  };

  const handleBulkSet = () => {
    const visibleIds = new Set(filteredStudents.map(s => s.id));
    setStudents(students.map(s => 
      visibleIds.has(s.id) && s.status === null ? { ...s, status: 'H' } : s
    ));
  };

  const handleSaveAttendance = () => {
      // Calculate statistics for the modal based on CURRENT students state
      const stats = students.reduce((acc, curr) => {
          if (curr.status) {
              acc.total++;
              if (curr.status === 'H') acc.h++;
              if (curr.status === 'I') acc.i++;
              if (curr.status === 'S') acc.s++;
              if (curr.status === 'A') acc.a++;
          }
          return acc;
      }, { total: 0, h: 0, i: 0, s: 0, a: 0 });

      if (stats.total === 0) {
          alert("No attendance data to save. Please mark student attendance first.");
          return;
      }

      setSaveStats(stats);
      setShowSaveSuccess(true);
  };

  // --- EDIT MODE LOGIC ---
  const handleOpenEditModal = () => {
      setShowEditDateModal(true);
      setEditDateInput(new Date().toISOString().split('T')[0]);
  };

  const handleLoadAttendanceForEdit = () => {
      setShowEditDateModal(false);
      setIsEditMode(true);
      setSelectedDate(editDateInput);
      setActiveTab('input'); // Force switch to input view

      // SIMULATE FETCHING DATA FROM DB FOR SELECTED DATE
      const mockFetchedData = students.map(s => {
          const rand = Math.random();
          let status: 'H' | 'I' | 'S' | 'A' = 'H';
          if (rand > 0.85) status = 'I';
          else if (rand > 0.90) status = 'S';
          else if (rand > 0.95) status = 'A';
          
          return {
              ...s,
              status: status,
              note: status === 'I' || status === 'S' ? 'Pre-existing note from DB' : ''
          };
      });
      setStudents(mockFetchedData);
  };

  const handleCancelEditMode = () => {
      setIsEditMode(false);
      resetStudentData(); // Reset to empty for fresh input
      setSelectedDate(new Date().toISOString().split('T')[0]); // Reset date to today
  };

  // --- DELETE LOGIC ---
  const initiateSingleDelete = (log: AttendanceLog) => {
      setItemToDelete(log);
      setDeleteConfirmType('single');
  };

  const initiateBulkDelete = () => {
      if (!historyDateFilter) return;
      setDeleteConfirmType('bulk');
  };

  const confirmDelete = () => {
      if (deleteConfirmType === 'single' && itemToDelete) {
          setHistoryData(prev => prev.filter(item => item.id !== itemToDelete.id));
      } else if (deleteConfirmType === 'bulk' && historyDateFilter) {
          setHistoryData(prev => prev.filter(item => item.date !== historyDateFilter));
      }
      setDeleteConfirmType(null);
      setItemToDelete(null);
  };

  // ----------------------

  // Filter Logic for Input View
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.nim.includes(searchTerm);
    const matchesBatch = selectedBatch === 'All Batch' || student.batch === selectedBatch;
    const matchesMajor = selectedMajor === 'All Majors' || student.major === selectedMajor;
    return matchesSearch && matchesBatch && matchesMajor;
  });

  // Filter Logic for History View
  const filteredHistory = historyData.filter(log => {
      const matchesSearch = log.studentName.toLowerCase().includes(historySearch.toLowerCase()) || log.nim.includes(historySearch);
      const matchesBatch = historyBatchFilter === 'All' || log.batch === historyBatchFilter;
      const matchesDate = !historyDateFilter || log.date === historyDateFilter; // Date filter logic

      let matchesView = true;
      if (historyViewMode === 'issues') {
          matchesView = log.status !== 'H';
      }

      return matchesSearch && matchesBatch && matchesView && matchesDate;
  });

  // Calculate Stats
  const historyStats = historyData.reduce((acc, curr) => {
      acc.total++;
      if (curr.status === 'H') acc.h++;
      if (curr.status === 'I') acc.i++;
      if (curr.status === 'S') acc.s++;
      if (curr.status === 'A') acc.a++;
      return acc;
  }, { total: 0, h: 0, i: 0, s: 0, a: 0 });


  const getAvatarColor = (color: string) => {
      const colors: any = {
          blue: 'bg-blue-100 text-blue-600',
          purple: 'bg-purple-100 text-purple-600',
          orange: 'bg-orange-100 text-orange-600',
          teal: 'bg-teal-100 text-teal-600',
          red: 'bg-red-100 text-red-600',
          indigo: 'bg-indigo-100 text-indigo-600',
          green: 'bg-emerald-100 text-emerald-600'
      };
      return colors[color] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'H': return <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Hadir</span>;
          case 'I': return <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Izin</span>;
          case 'S': return <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Sakit</span>;
          case 'A': return <span className="px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Alpha</span>;
          default: return null;
      }
  };

  // Helper component for the styled radio button
  const RadioOption = ({ studentId, value, label, currentStatus, colorClass, bgClass, borderClass, activeBgClass }: any) => (
    <div className="relative">
      <input
        type="radio"
        name={`att_${studentId}`}
        id={`${value.toLowerCase()}_${studentId}`}
        className="peer sr-only"
        checked={currentStatus === value}
        onChange={() => handleStatusChange(studentId, value)}
      />
      <label
        htmlFor={`${value.toLowerCase()}_${studentId}`}
        className={`w-8 h-8 rounded-full border ${borderClass} ${colorClass} hover:${bgClass} flex items-center justify-center text-xs font-bold cursor-pointer transition-all peer-checked:scale-110 peer-checked:font-bold peer-checked:text-white peer-checked:border-transparent ${currentStatus === value ? activeBgClass : ''}`}
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="w-full space-y-6 pb-20 relative">
       
       {/* DELETE CONFIRMATION MODAL */}
       {deleteConfirmType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <div className="p-2 bg-red-100 rounded-full">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">Confirm Deletion</h3>
                    </div>
                    
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                        {deleteConfirmType === 'single' 
                            ? <span>Are you sure you want to delete the attendance record for <span className="font-bold text-slate-900">{itemToDelete?.studentName}</span>?</span>
                            : <span>Are you sure you want to delete <span className="font-bold text-red-600 underline">ALL RECORDS</span> for <span className="font-bold text-slate-900">{historyDateFilter}</span>? This action cannot be undone.</span>
                        }
                    </p>
                    
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => { setDeleteConfirmType(null); setItemToDelete(null); }}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-200 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
       )}

       {/* Date Selection Modal for Editing */}
       {showEditDateModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
               <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                           <Edit className="w-6 h-6" />
                       </div>
                       <h3 className="font-bold text-lg text-slate-900">Edit Past Attendance</h3>
                   </div>
                   <p className="text-sm text-slate-500 mb-4">Select the date you want to correct. Current data will be loaded for modification.</p>
                   
                   <div className="space-y-4">
                       <div>
                           <label className="block text-xs font-medium text-slate-700 mb-1.5">Select Date</label>
                           <input 
                                type="date" 
                                value={editDateInput}
                                onChange={(e) => setEditDateInput(e.target.value)}
                                className="w-full rounded-lg h-10 border border-slate-300 bg-white text-slate-900 text-sm px-3 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                           />
                       </div>
                   </div>

                   <div className="flex gap-2 mt-6">
                       <button 
                            onClick={() => setShowEditDateModal(false)}
                            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                       >
                           Cancel
                       </button>
                       <button 
                            onClick={handleLoadAttendanceForEdit}
                            className="flex-1 py-2.5 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-sm shadow-amber-200"
                       >
                           Load Data
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* Proof Preview Modal */}
       {previewProof && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreviewProof(null)}>
               <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                   <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2">
                           <FileText className="w-4 h-4 text-slate-500" />
                           Evidence Preview
                       </h3>
                       <button onClick={() => setPreviewProof(null)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                           <X className="w-5 h-5 text-slate-500" />
                       </button>
                   </div>
                   <div className="p-4 bg-slate-100 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
                       {previewProof.type === 'image' ? (
                           <img src={previewProof.url} alt="Proof" className="max-w-full rounded-lg shadow-sm" />
                       ) : (
                           <div className="flex flex-col items-center gap-4 text-slate-500">
                               <FileText className="w-16 h-16 text-slate-300" />
                               <p>PDF Document Preview not available in this demo.</p>
                               <a href={previewProof.url} download className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Download File</a>
                           </div>
                       )}
                   </div>
                   <div className="p-4 border-t bg-white">
                       <p className="text-sm text-slate-600 font-medium">Associated with: <span className="font-bold">{previewProof.title}</span></p>
                   </div>
               </div>
           </div>
       )}

       {/* Success Save Modal */}
       {showSaveSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isEditMode ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                         {isEditMode ? <RefreshCw className="w-8 h-8" /> : <Check className="w-8 h-8" strokeWidth={3} />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{isEditMode ? 'Corrections Saved!' : 'Attendance Saved!'}</h2>
                    <p className="text-slate-500 mb-6">
                        {isEditMode 
                            ? <span>Adjustments for <span className="font-semibold text-slate-900">{selectedDate}</span> have been updated.</span> 
                            : <span>Data for <span className="font-semibold text-slate-900">{selectedDate}</span> has been successfully recorded.</span>
                        }
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle className="w-4 h-4" /></div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Present</p>
                                <p className="text-lg font-bold text-slate-900">{saveStats.h}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Clock className="w-4 h-4" /></div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Permit</p>
                                <p className="text-lg font-bold text-slate-900">{saveStats.i}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><AlertCircle className="w-4 h-4" /></div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Sick</p>
                                <p className="text-lg font-bold text-slate-900">{saveStats.s}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600"><XCircle className="w-4 h-4" /></div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Alpha</p>
                                <p className="text-lg font-bold text-slate-900">{saveStats.a}</p>
                            </div>
                        </div>
                    </div>

                    {/* Database Connection Status Simulator */}
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-6 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <Database className="w-3 h-3" />
                        <span>Database Connection: <span className="text-emerald-600 font-bold">Stable & Synced</span></span>
                    </div>

                    <button 
                        onClick={() => { setShowSaveSuccess(false); if(isEditMode) handleCancelEditMode(); }}
                        className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-primary hover:bg-blue-600 shadow-blue-200'}`}
                    >
                        {isEditMode ? 'Return to Input Mode' : 'Continue Work'}
                    </button>
                </div>
            </div>
       )}

       {/* Header */}
       <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold leading-tight text-slate-900">Attendance Manager</h2>
          <p className="text-slate-500 text-sm">Manage daily attendance and view historical records.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
             <User className="text-slate-500 w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">Faculty of Engineering</p>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher & Edit Action */}
      <div className="flex justify-between items-center">
          {!isEditMode ? (
              <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex shadow-sm">
                <button 
                    onClick={() => setActiveTab('input')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'input' ? 'bg-[#135bec] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <CheckCircle className="w-4 h-4" />
                    Daily Input
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-[#135bec] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <History className="w-4 h-4" />
                    History Log
                </button>
              </div>
          ) : (
              <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-sm font-semibold">Mode: </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      EDITING HISTORY
                  </span>
              </div>
          )}

          {!isEditMode && (
              <button 
                onClick={handleOpenEditModal}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 rounded-lg text-sm font-bold transition-all shadow-sm group"
              >
                  <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Edit Past Attendance
              </button>
          )}
      </div>

      {/* EDIT MODE BANNER */}
      {isEditMode && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                      <h3 className="font-bold text-amber-900 text-sm">You are editing attendance records for <span className="underline decoration-amber-400/50 decoration-2">{selectedDate}</span></h3>
                      <p className="text-xs text-amber-700/80">Changes made here will overwrite previous data. Make sure to double-check before saving.</p>
                  </div>
              </div>
              <button 
                onClick={handleCancelEditMode}
                className="px-4 py-2 bg-white border border-amber-200 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2"
              >
                  <ArrowLeft className="w-3 h-3" />
                  Cancel Editing
              </button>
          </div>
      )}

      {/* --- INPUT VIEW (Used for both New Input and Editing) --- */}
      {activeTab === 'input' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filters */}
            <div className={`flex flex-col xl:flex-row gap-4 items-end xl:items-center justify-between bg-white p-4 rounded-xl border shadow-sm ${isEditMode ? 'border-amber-200 shadow-amber-50' : 'border-slate-200'}`}>
                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-1 flex-wrap">
                    <div className="w-full md:w-56">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Search Student</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Name or NIM..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg h-10 border border-slate-200 bg-[#f6f6f8] text-slate-900 text-sm pl-9 pr-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    {/* Date Filter (Disabled in Edit Mode) */}
                    <div className="w-full md:w-40">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="w-4 h-4 text-slate-500" />
                            </div>
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                disabled={isEditMode}
                                className={`w-full rounded-lg h-10 border border-slate-200 bg-[#f6f6f8] text-slate-900 text-sm pl-10 pr-3 outline-none transition-all ${isEditMode ? 'cursor-not-allowed opacity-70' : 'focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer'}`}
                            />
                        </div>
                    </div>

                    {/* Major Filter */}
                    <div className="w-full md:w-48">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Major</label>
                        <div className="relative">
                            <select 
                                value={selectedMajor}
                                onChange={(e) => setSelectedMajor(e.target.value)}
                                className="w-full appearance-none rounded-lg h-10 border border-slate-200 bg-[#f6f6f8] text-slate-900 text-sm px-3 pr-8 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
                            >
                                <option>All Majors</option>
                                <option>Computer Science</option>
                                <option>Information Systems</option>
                                <option>Software Engineering</option>
                                <option>Data Science</option>
                                <option>Accounting</option>
                                <option>Management</option>
                                <option>Psychology</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Batch Filter */}
                    <div className="w-full md:w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Batch</label>
                        <div className="relative">
                            <select 
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="w-full appearance-none rounded-lg h-10 border border-slate-200 bg-[#f6f6f8] text-slate-900 text-sm px-3 pr-8 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
                            >
                                <option>All Batch</option>
                                <option>2020</option>
                                <option>2021</option>
                                <option>2022</option>
                                <option>2023</option>
                                <option>2024</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl border ${isEditMode ? 'bg-amber-50 border-amber-200' : 'bg-blue-50/50 border-blue-100'}`}>
                <div className="text-sm text-slate-600">
                    Showing <span className="font-bold text-slate-900">{filteredStudents.length}</span> students for {isEditMode ? 'editing' : 'input'}
                </div>
                <div className="flex gap-3">
                <button 
                    onClick={handleBulkSet}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Set All Present
                </button>
                <button 
                    onClick={handleSaveAttendance}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ${isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-[#135bec] hover:bg-blue-600 shadow-blue-200'}`}
                >
                    {isEditMode ? <RefreshCw className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isEditMode ? 'Update Corrections' : 'Save Attendance'}
                </button>
                </div>
            </div>

            {/* Table List */}
            <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isEditMode ? 'border-amber-200' : 'border-slate-200'}`}>
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f6f6f8]">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Student Info</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 text-center">Batch/Major</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 text-center">Attendance Status</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Notes & Evidence</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full ${getAvatarColor(student.color)} flex items-center justify-center font-bold text-sm shrink-0`}>
                                {student.initials}
                                </div>
                                <div>
                                <div className="text-sm font-bold text-slate-900">{student.name}</div>
                                <div className="text-xs text-slate-500 font-mono">{student.nim}</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-slate-700">{student.batch}</span>
                                <span className="text-[10px] text-slate-500">{student.major}</span>
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">
                                <RadioOption studentId={student.id} value="H" label="H" currentStatus={student.status} colorClass="text-emerald-600 border-emerald-200" bgClass="bg-emerald-50" activeBgClass="bg-emerald-500 border-emerald-500" borderClass="border-slate-200" />
                                <RadioOption studentId={student.id} value="I" label="I" currentStatus={student.status} colorClass="text-amber-600 border-amber-200" bgClass="bg-amber-50" activeBgClass="bg-amber-500 border-amber-500" borderClass="border-slate-200" />
                                <RadioOption studentId={student.id} value="S" label="S" currentStatus={student.status} colorClass="text-blue-600 border-blue-200" bgClass="bg-blue-50" activeBgClass="bg-blue-500 border-blue-500" borderClass="border-slate-200" />
                                <RadioOption studentId={student.id} value="A" label="A" currentStatus={student.status} colorClass="text-red-600 border-red-200" bgClass="bg-red-50" activeBgClass="bg-red-500 border-red-500" borderClass="border-slate-200" />
                            </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Add note..." 
                                        value={student.note}
                                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                        className="w-full text-sm border-b border-transparent hover:border-slate-200 focus:border-[#135bec] focus:outline-none bg-transparent py-1 transition-colors text-slate-600 placeholder:text-slate-300"
                                    />
                                    
                                    {/* Upload Evidence Button - Only for I or S */}
                                    {(student.status === 'I' || student.status === 'S') && (
                                        <div className="relative shrink-0">
                                            <input 
                                                type="file" 
                                                id={`proof-${student.id}`} 
                                                className="hidden" 
                                                accept="image/*,application/pdf"
                                                onChange={(e) => handleFileUpload(student.id, e)}
                                            />
                                            {student.proof ? (
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => setPreviewProof({url: student.proof!, type: student.proofType || 'image', title: student.name})}
                                                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                        title={student.proofName || "View Proof"}
                                                    >
                                                        {student.proofType === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    </button>
                                                    <button 
                                                        onClick={() => removeProof(student.id)}
                                                        className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                                        title="Remove"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label 
                                                    htmlFor={`proof-${student.id}`} 
                                                    className="p-1.5 cursor-pointer text-slate-400 hover:text-primary hover:bg-slate-100 rounded-md transition-colors flex items-center justify-center animate-in fade-in"
                                                    title="Upload Evidence (Required)"
                                                >
                                                    <Paperclip className="w-4 h-4" />
                                                </label>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {(student.status === 'I' || student.status === 'S') && !student.proof && (
                                    <span className="text-[10px] text-red-400 italic mt-1 block">* Proof required</span>
                                )}
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">
                            No students found matching current filters.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
      )}

      {/* --- HISTORY VIEW --- */}
      {activeTab === 'history' && !isEditMode && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Summary Cards */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Total Entries</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{historyStats.total}</h3>
                        </div>
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><FileText className="w-4 h-4" /></div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-emerald-600 font-medium">Present (H)</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{historyStats.h}</h3>
                        </div>
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-amber-600 font-medium">Issues (I/S)</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{historyStats.i + historyStats.s}</h3>
                        </div>
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertCircle className="w-4 h-4" /></div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-red-600 font-medium">Absent (A)</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{historyStats.a}</h3>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg text-red-600"><XCircle className="w-4 h-4" /></div>
                    </div>
                </div>
             </div>

             {/* History Toolbar & View Switcher */}
             <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 
                 {/* Left: View Mode & Bulk Delete */}
                 <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button 
                            onClick={() => setHistoryViewMode('issues')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${historyViewMode === 'issues' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Absence Only
                        </button>
                        <button 
                            onClick={() => setHistoryViewMode('all')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${historyViewMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Full Log
                        </button>
                    </div>

                    {/* Bulk Delete Button (Only active if date filtered) */}
                    <button 
                        onClick={initiateBulkDelete}
                        disabled={!historyDateFilter}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            historyDateFilter 
                            ? 'bg-white border-red-200 text-red-600 hover:bg-red-50 cursor-pointer shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                        title={historyDateFilter ? "Delete all logs for selected date" : "Select a date to enable bulk delete"}
                    >
                        <Eraser className="w-3.5 h-3.5" />
                        Clear Daily Log
                    </button>
                 </div>

                 {/* Right: Search & Filters */}
                 <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                     {/* Date Filter for Deletion/Viewing */}
                     <div className="relative sm:w-36">
                        <input 
                            type="date"
                            value={historyDateFilter}
                            onChange={(e) => setHistoryDateFilter(e.target.value)}
                            className="w-full rounded-lg h-9 border border-slate-200 bg-[#f6f6f8] text-slate-900 text-xs px-2 outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                     </div>

                     <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-slate-400" />
                        </div>
                        <input 
                            type="text"
                            placeholder="Search student or NIM..."
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            className="w-full rounded-lg h-9 border border-slate-200 bg-[#f6f6f8] text-slate-900 text-sm pl-9 pr-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                        />
                     </div>
                     <div className="relative sm:w-40">
                         <select 
                            value={historyBatchFilter}
                            onChange={(e) => setHistoryBatchFilter(e.target.value)}
                            className="w-full appearance-none rounded-lg h-9 border border-slate-200 bg-[#f6f6f8] text-slate-900 text-sm px-3 pr-8 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
                         >
                             <option value="All">All Batches</option>
                             <option value="2020">2020</option>
                             <option value="2021">2021</option>
                             <option value="2022">2022</option>
                             <option value="2023">2023</option>
                             <option value="2024">2024</option>
                         </select>
                         <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <Filter className="text-slate-400 w-4 h-4" />
                         </div>
                     </div>
                 </div>
             </div>

             {/* History Table */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f6f6f8]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Student Info</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Note & Proof</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((log) => (
                                    <tr key={log.id} className={`transition-colors ${log.status === 'H' ? 'hover:bg-slate-50' : 'bg-red-50/10 hover:bg-red-50/30'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium">{log.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-9 w-9 rounded-full ${getAvatarColor(log.avatarColor)} flex items-center justify-center font-bold text-xs shrink-0`}>
                                                    {log.initials}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{log.studentName}</div>
                                                    <div className="text-xs text-slate-500 font-mono">{log.nim} • {log.batch}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(log.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-between gap-4">
                                                {log.note ? (
                                                    <div className="flex items-start gap-2 max-w-xs">
                                                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                                        <span className="text-sm text-slate-700 italic truncate" title={log.note}>"{log.note}"</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">-</span>
                                                )}

                                                {/* History Evidence Button */}
                                                {log.proof && (
                                                    <button 
                                                        onClick={() => setPreviewProof({url: log.proof!, type: log.proofType || 'image', title: log.studentName})}
                                                        className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary rounded shadow-sm text-xs font-semibold transition-all"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        Proof
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => initiateSingleDelete(log)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                title="Delete Record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                                        <div className="p-3 bg-slate-100 rounded-full">
                                            <History className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <span>No records found for this view.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                    <span>
                        Showing <strong>{historyViewMode === 'issues' ? 'Absence & Issues' : 'All Logs'}</strong>
                    </span>
                    <span>Total {filteredHistory.length} entries displayed</span>
                </div>
             </div>
          </div>
      )}

    </div>
  );
};