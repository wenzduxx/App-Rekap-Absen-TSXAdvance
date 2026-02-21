import React, { useState, useRef } from 'react';
import { StudentProfile, StudentRecord, RecordType } from '../types';
import { Camera, Save, ArrowLeft, ChevronRight, UserPlus, Award, GraduationCap, DollarSign, AlertCircle, BookOpen, Plus, Minus, Trash2, Calendar, Check, AlertTriangle, X } from 'lucide-react';

interface AddStudentProps {
  onSave: (student: StudentProfile) => void;
  onCancel: () => void;
}

export const AddStudent: React.FC<AddStudentProps> = ({ onSave, onCancel }) => {
  // Initial empty state
  const [formData, setFormData] = useState<StudentProfile>({
    id: `ST-${Date.now()}`,
    name: '',
    nim: '',
    batch: new Date().getFullYear().toString(),
    major: 'Computer Science',
    email: '',
    phone: '',
    gender: 'Male',
    status: 'Active',
    avatarUrl: 'https://ui-avatars.com/api/?name=New+Student&background=cbd5e1&color=64748b',
    gpa: 0.00,
    totalCredits: 0,
    targetCredits: 144,
    achievementCount: 0,
    disciplinePoints: 100,
    tuitionStatus: 'Pending',
    tuitionDate: '',
    economicTier: 3,
    isScholarship: false,
    goodStandingNote: '',
    initials: 'NS',
    color: 'blue',
    h: 0, i: 0, s: 0, a: 0, pct: 100,
    attendanceStatus: 'Excellent',
    records: []
  });

  const [newRecord, setNewRecord] = useState<Partial<StudentRecord>>({
      category: RecordType.ACADEMIC,
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      gradeOrResult: '',
      verifiedBy: ''
  });
  const [showAddRecord, setShowAddRecord] = useState(false);
  
  // Modals State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
        const updated = {
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        };

        // Auto-update Avatar & Initials when name changes
        if (name === 'name') {
            updated.initials = value.split(' ').map((n:string) => n[0]).join('').substring(0, 2).toUpperCase();
            updated.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(value)}&background=dbeafe&color=2563eb`;
        }

        return updated;
    });
  };

  const adjustNumber = (name: keyof StudentProfile, amount: number) => {
    setFormData(prev => {
        const val = prev[name] as number;
        return { ...prev, [name]: Math.max(0, val + amount) };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Record Management
  const handleAddRecord = () => {
      if (!newRecord.title || !newRecord.date) return;
      
      const recordToAdd: StudentRecord = {
          id: Date.now().toString(),
          date: newRecord.date || '',
          title: newRecord.title || '',
          category: newRecord.category as RecordType,
          description: newRecord.description || '',
          gradeOrResult: newRecord.gradeOrResult || '',
          verifiedBy: newRecord.verifiedBy || 'Admin'
      };

      setFormData(prev => ({
          ...prev,
          records: [recordToAdd, ...prev.records]
      }));
      
      setNewRecord({
        category: RecordType.ACADEMIC,
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        gradeOrResult: '',
        verifiedBy: ''
      });
      setShowAddRecord(false);
  };

  const handleDeleteRecord = (id: string) => {
      setFormData(prev => ({
          ...prev,
          records: prev.records.filter(r => r.id !== id)
      }));
  };

  const validateForm = () => {
      const missing: string[] = [];
      if (!formData.name.trim()) missing.push('Full Name');
      if (!formData.nim.trim()) missing.push('Student ID (NIM)');
      if (!formData.email.trim()) missing.push('Email Address');
      if (!formData.phone.trim()) missing.push('Phone Number');
      
      return missing;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run Validation
    const missing = validateForm();
    if (missing.length > 0) {
        setMissingFields(missing);
        setShowValidationModal(true);
        return;
    }

    // Instead of saving immediately, show success modal first
    setShowSuccessModal(true);
  };

  const handleFinalizeSave = () => {
      onSave(formData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 relative">
      
      {/* Validation Error Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100 relative">
                <button 
                    onClick={() => setShowValidationModal(false)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                    <AlertTriangle className="w-8 h-8" strokeWidth={3} />
                </div>
                
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Missing Information</h2>
                    <p className="text-slate-500 text-sm">
                        Please fill in the following required fields to create the student profile:
                    </p>
                </div>

                <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
                    <ul className="space-y-2">
                        {missingFields.map((field, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm font-semibold text-red-700">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {field}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <button 
                    onClick={() => setShowValidationModal(false)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
                >
                    OK, I'll Fix It
                </button>
            </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <Check className="w-8 h-8" strokeWidth={3} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Student Registered!</h2>
                <p className="text-slate-500 mb-6 text-sm">
                    <span className="font-bold text-slate-900">{formData.name}</span> has been successfully added to the database with NIM <span className="font-mono bg-slate-100 px-1 rounded">{formData.nim}</span>.
                </p>
                
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={handleFinalizeSave}
                        className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                        Back to Student List
                    </button>
                    <button 
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full py-3 bg-white text-slate-500 hover:bg-slate-50 font-semibold rounded-xl transition-all"
                    >
                        Keep Editing
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <div className="flex items-center gap-4 sticky top-0 bg-[#F8FAFC] z-20 py-4 -mt-4 border-b border-slate-200">
        <button 
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">Add New Student</h1>
            <nav className="flex items-center text-xs text-slate-500 font-medium">
            <span className="text-slate-500">Students</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-primary">New Registration</span>
            </nav>
        </div>
        <div className="flex gap-2">
            <button 
                type="button" 
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
            >
                <UserPlus className="w-4 h-4" />
                Create Profile
            </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: IDENTITY */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Camera className="w-5 h-5" /></div>
                <div>
                    <h3 className="font-bold text-slate-900">Identity & Contact</h3>
                    <p className="text-xs text-slate-500">Basic information and profile photo.</p>
                </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-8">
                 {/* Photo */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-inner relative overflow-hidden group cursor-pointer" onClick={triggerFileInput}>
                        <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white w-8 h-8" />
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button type="button" onClick={triggerFileInput} className="text-xs font-semibold text-primary hover:underline">Upload Photo</button>
                </div>
                
                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Student ID (NIM) <span className="text-red-500">*</span></label>
                        <input required type="text" name="nim" value={formData.nim} onChange={handleChange} placeholder="e.g. 202400123" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. student@univ.ac.id" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Phone <span className="text-red-500">*</span></label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+62 812..." className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Major</label>
                        <select name="major" value={formData.major} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                             <option value="Computer Science">Computer Science</option>
                            <option value="Information Systems">Information Systems</option>
                            <option value="Software Engineering">Software Engineering</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Accounting">Accounting</option>
                            <option value="Management">Management</option>
                            <option value="Psychology">Psychology</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Batch</label>
                        <select name="batch" value={formData.batch} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                             <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 2: ACADEMIC STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Award className="w-5 h-5" /></div>
                    <div>
                        <h3 className="font-bold text-slate-900">Academic Stats</h3>
                        <p className="text-xs text-slate-500">Initial academic records (optional).</p>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">GPA (IPK)</label>
                        <input type="number" step="0.01" min="0" max="4.00" name="gpa" value={formData.gpa} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Discipline Points</label>
                        <input type="number" name="disciplinePoints" value={formData.disciplinePoints} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                     <div className="space-y-1">
                         <label className="text-xs font-semibold text-slate-700">Status</label>
                         <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><GraduationCap className="w-5 h-5" /></div>
                    <div>
                        <h3 className="font-bold text-slate-900">Study Progress</h3>
                        <p className="text-xs text-slate-500">Credits targets.</p>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Credits Completed</label>
                            <div className="relative">
                                <button 
                                    type="button" 
                                    onClick={() => adjustNumber('totalCredits', -1)} 
                                    className="absolute left-1 top-1 bottom-1 w-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <input 
                                    type="number" 
                                    name="totalCredits" 
                                    value={formData.totalCredits} 
                                    onChange={handleChange} 
                                    className="w-full px-10 py-2 text-center rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => adjustNumber('totalCredits', 1)} 
                                    className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Target Credits</label>
                            <div className="relative">
                                <button 
                                    type="button" 
                                    onClick={() => adjustNumber('targetCredits', -1)} 
                                    className="absolute left-1 top-1 bottom-1 w-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <input 
                                    type="number" 
                                    name="targetCredits" 
                                    value={formData.targetCredits} 
                                    onChange={handleChange} 
                                    className="w-full px-10 py-2 text-center rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => adjustNumber('targetCredits', 1)} 
                                    className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>

        {/* SECTION 3: TUITION & FINANCIAL */}
        <div className="grid grid-cols-1 gap-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><DollarSign className="w-5 h-5" /></div>
                    <div>
                        <h3 className="font-bold text-slate-900">Financial Profile</h3>
                        <p className="text-xs text-slate-500">Tuition and economic status.</p>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Payment Status</label>
                        <select name="tuitionStatus" value={formData.tuitionStatus} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Date Info (Due/Paid)</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            <input type="date" name="tuitionDate" value={formData.tuitionDate} onChange={handleChange} className="w-full px-3 py-2 pl-10 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Financial Category</label>
                        <select 
                            name="economicTier" 
                            value={formData.economicTier} 
                            onChange={(e) => setFormData(prev => ({...prev, economicTier: parseInt(e.target.value) as any}))} 
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        >
                            <option value="1">Category 1: Needs Support</option>
                            <option value="2">Category 2: Subsidized</option>
                            <option value="3">Category 3: Standard</option>
                            <option value="4">Category 4: Standard Plus</option>
                            <option value="5">Category 5: Full Fee/Wealthy</option>
                        </select>
                    </div>
                     <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="isScholarship" 
                                checked={formData.isScholarship} 
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" 
                            />
                            <span className="text-sm font-semibold text-slate-700">Scholarship Recipient</span>
                        </label>
                    </div>
                </div>
             </div>
        </div>

        {/* SECTION 4: RECORDS (Optional) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><BookOpen className="w-5 h-5" /></div>
                    <div>
                        <h3 className="font-bold text-slate-900">Records (Optional)</h3>
                        <p className="text-xs text-slate-500">Add initial records if any.</p>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={() => setShowAddRecord(!showAddRecord)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Record
                </button>
            </div>
            
            {showAddRecord && (
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Category</label>
                        <select 
                            value={newRecord.category} 
                            onChange={(e) => setNewRecord({...newRecord, category: e.target.value as RecordType})}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900"
                        >
                            {Object.values(RecordType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            <input type="date" value={newRecord.date} onChange={(e) => setNewRecord({...newRecord, date: e.target.value})} className="w-full px-3 py-2 pl-10 rounded-lg border border-slate-300 text-sm bg-white text-slate-900" />
                        </div>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-700">Title</label>
                        <input type="text" placeholder="e.g. Entrance Exam" value={newRecord.title} onChange={(e) => setNewRecord({...newRecord, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900" />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowAddRecord(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="button" onClick={handleAddRecord} className="px-3 py-1.5 text-xs font-semibold bg-primary text-white hover:bg-blue-600 rounded-lg">Add Record</button>
                    </div>
                </div>
            )}

            {/* List Preview */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {formData.records && formData.records.length > 0 ? (
                            formData.records.map((rec) => (
                                <tr key={rec.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{rec.date}</td>
                                    <td className="px-6 py-3"><span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600 border border-slate-200">{rec.category}</span></td>
                                    <td className="px-6 py-3 font-medium text-slate-900">{rec.title}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button 
                                            type="button" 
                                            onClick={() => handleDeleteRecord(rec.id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-6 text-center text-slate-400 italic">No records added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </form>
    </div>
  );
};