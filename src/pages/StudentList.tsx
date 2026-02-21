import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, MoreHorizontal, Eye, Filter, Trash2, Edit, AlertTriangle, ArrowUpAZ, ArrowDownAZ, ArrowUpDown, RefreshCcw, Check, X, SlidersHorizontal } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentListProps {
  students: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onAddStudent: () => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent, onAddStudent, onDeleteStudent }) => {
  // Basic Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('All Majors');
  const [selectedBatch, setSelectedBatch] = useState('All Batch');
  
  // Advanced Filter & Sort State
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'nim' | 'gpa'; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  // Dropdown & Modal States
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Row Actions Dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
      
      // Filter Panel
      if (
        showFilterPanel && 
        filterPanelRef.current && 
        !filterPanelRef.current.contains(event.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterPanel]);

  // --- FILTERING & SORTING LOGIC ---
  const processedStudents = useMemo(() => {
    // 1. Filtering
    let result = students.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nim.includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesMajor = selectedMajor === 'All Majors' || student.major === selectedMajor;
        const matchesBatch = selectedBatch === 'All Batch' || student.batch === selectedBatch;
        const matchesGender = selectedGender === 'All' || student.gender === selectedGender;
        const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;

        return matchesSearch && matchesMajor && matchesBatch && matchesGender && matchesStatus;
    });

    // 2. Sorting
    result.sort((a, b) => {
        let valA: any = a[sortConfig.key];
        let valB: any = b[sortConfig.key];

        // String comparison case insensitive
        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return result;
  }, [students, searchTerm, selectedMajor, selectedBatch, selectedGender, selectedStatus, sortConfig]);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); // Prevent row click
      setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  const handleDeleteClick = (e: React.MouseEvent, student: StudentProfile) => {
      e.stopPropagation();
      setStudentToDelete(student);
      setActiveDropdownId(null);
      setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
      if (studentToDelete) {
          onDeleteStudent(studentToDelete.id);
          setShowDeleteConfirm(false);
          setShowDeleteSuccess(true);
      }
  };

  const handleEditClick = (e: React.MouseEvent, student: StudentProfile) => {
      e.stopPropagation();
      onSelectStudent(student); 
      setActiveDropdownId(null);
  };

  const resetFilters = () => {
      setSelectedMajor('All Majors');
      setSelectedBatch('All Batch');
      setSelectedGender('All');
      setSelectedStatus('All');
      setSearchTerm('');
      setSortConfig({ key: 'name', direction: 'asc' });
  };

  const isFilterActive = selectedGender !== 'All' || selectedStatus !== 'All' || sortConfig.key !== 'name' || sortConfig.direction !== 'asc';

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative pb-20">
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="flex items-center gap-3 text-red-600 mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Delete Student?</h3>
                </div>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-900">{studentToDelete.name}</span>? 
                  This action cannot be undone and will remove all academic records.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
            </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <Trash2 className="w-8 h-8" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Deleted Successfully</h2>
                <p className="text-slate-500 mb-6 text-sm">
                    The student record for <span className="font-bold text-slate-900">{studentToDelete?.name}</span> has been permanently removed from the system.
                </p>
                
                <button 
                    onClick={() => { setShowDeleteSuccess(false); setStudentToDelete(null); }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                    Close
                </button>
            </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students Data</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage all student records and profiles.</p>
        </div>
        <button 
          onClick={onAddStudent}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add New Student
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 relative z-20">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search by Name, NIM, or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2">
           <select 
             value={selectedMajor}
             onChange={(e) => setSelectedMajor(e.target.value)}
             className="hidden sm:block px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white focus:outline-none focus:border-primary cursor-pointer"
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
           <select 
             value={selectedBatch}
             onChange={(e) => setSelectedBatch(e.target.value)}
             className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white focus:outline-none focus:border-primary cursor-pointer"
           >
             <option>All Batch</option>
             <option>2020</option>
             <option>2021</option>
             <option>2022</option>
             <option>2023</option>
             <option>2024</option>
           </select>
           
           {/* Enhanced Filter Button */}
           <div className="relative">
                <button 
                    ref={filterButtonRef}
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                        isFilterActive || showFilterPanel 
                        ? 'border-primary bg-blue-50 text-primary font-semibold' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {isFilterActive ? <SlidersHorizontal className="w-4 h-4 shrink-0" /> : <Filter className="w-4 h-4 shrink-0" />}
                    <span className="hidden md:inline">Filter & Sort</span>
                    {isFilterActive && (
                        <span className="flex h-2 w-2 rounded-full bg-primary ml-1"></span>
                    )}
                </button>

                {/* Advanced Filter Popover */}
                {showFilterPanel && (
                    <div 
                        ref={filterPanelRef}
                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 ring-1 ring-slate-900/5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 text-sm">Filter & Sort Options</h3>
                            <button onClick={() => setShowFilterPanel(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-5">
                            {/* Sort Options - Grid Layout */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sort Order</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => setSortConfig({ key: 'name', direction: 'asc' })}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'bg-blue-50 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <ArrowDownAZ className="w-4 h-4" /> Name A-Z
                                    </button>
                                    <button 
                                        onClick={() => setSortConfig({ key: 'name', direction: 'desc' })}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'bg-blue-50 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <ArrowUpAZ className="w-4 h-4" /> Name Z-A
                                    </button>
                                    <button 
                                        onClick={() => setSortConfig({ key: 'nim', direction: 'asc' })}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${sortConfig.key === 'nim' && sortConfig.direction === 'asc' ? 'bg-blue-50 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <ArrowUpDown className="w-4 h-4" /> Oldest NIM
                                    </button>
                                    <button 
                                        onClick={() => setSortConfig({ key: 'nim', direction: 'desc' })}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${sortConfig.key === 'nim' && sortConfig.direction === 'desc' ? 'bg-blue-50 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <ArrowUpDown className="w-4 h-4" /> Newest NIM
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            {/* Gender Filter - Segmented Control */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</h4>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {['All', 'Male', 'Female'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setSelectedGender(g)}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all shadow-sm ${selectedGender === g ? 'bg-white text-primary shadow' : 'bg-transparent text-slate-500 hover:text-slate-700 shadow-none'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter - Styled Select */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Student Status</h4>
                                <div className="relative">
                                    <select 
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full appearance-none px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-shadow cursor-pointer"
                                        style={{ color: '#475569' }} // Explicitly setting Slate-600 hex color to prevent black default
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ArrowUpDown className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            {/* Actions */}
                            <button 
                                onClick={resetFilters}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg transition-colors border border-dashed border-slate-300 hover:border-slate-400"
                            >
                                <RefreshCcw className="w-3.5 h-3.5" /> Reset All Filters
                            </button>
                        </div>
                    </div>
                )}
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        <div className="overflow-visible">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">NIM</th>
                <th className="px-6 py-4">Major</th>
                <th className="px-6 py-4 text-center">Batch</th>
                <th className="px-6 py-4 text-center">Gender</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedStudents.length > 0 ? (
                processedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group relative">
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-3 cursor-pointer group-hover:text-primary transition-colors"
                        onClick={() => onSelectStudent(student)}
                      >
                        <img 
                          src={student.avatarUrl} 
                          alt={student.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-primary">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600 font-medium">{student.nim}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{student.major}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        {student.batch}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${student.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                           {student.gender === 'Male' ? 'M' : 'F'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                        student.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : student.status === 'Inactive' 
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onSelectStudent(student)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown Trigger */}
                        <div className="relative">
                            <button 
                                onClick={(e) => toggleDropdown(e, student.id)}
                                className={`p-2 rounded-lg transition-all ${activeDropdownId === student.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdownId === student.id && (
                                <div 
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden ring-1 ring-black/5"
                                >
                                    <div className="py-1">
                                        <button 
                                            onClick={(e) => handleEditClick(e, student)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                                        >
                                            <Edit className="w-4 h-4 text-slate-400" />
                                            Edit Profile
                                        </button>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button 
                                            onClick={(e) => handleDeleteClick(e, student)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Student
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-3 bg-slate-50 rounded-full">
                            <Filter className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-600">No students found.</p>
                        <p className="text-xs">Try adjusting your search or filters.</p>
                        <button onClick={resetFilters} className="text-xs text-primary font-bold hover:underline mt-1">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">1-{processedStudents.length}</span> of <span className="font-semibold text-slate-700">{students.length}</span> students</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-600 shadow-sm">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-600 hover:bg-slate-50">3</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="px-3 py-1 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};