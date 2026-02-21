import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { StudentList } from './pages/StudentList';
import { StudentDetail } from './pages/StudentDetail';
import { EditStudentProfile } from './pages/EditStudentProfile';
import { AddStudent } from './pages/AddStudent';
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { Statistics } from './pages/Statistics';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentProfile } from './types';
import { mockStudents } from './data';
import { Menu, LogOut, ArrowLeft, AlertTriangle } from 'lucide-react';

type AuthMode = 'guest' | 'login' | 'admin' | 'viewer';

const App: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('guest');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Lifted state for students
  const [students, setStudents] = useState<StudentProfile[]>(mockStudents);
  
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Attendance Navigation State
  const [attendanceInitState, setAttendanceInitState] = useState<{
    tab: 'input' | 'history';
    viewMode: 'issues' | 'all';
  } | null>(null);

  const handleLoginAdminClick = () => {
    setAuthMode('login');
  };

  const handleAdminLoginSuccess = () => {
    setAuthMode('admin');
    setActivePage('Dashboard');
  };

  const handleEnterDashboard = () => {
    setAuthMode('viewer');
    setSelectedStudent(null);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    setAuthMode('guest');
    setSelectedStudent(null);
    setIsEditingStudent(false);
    setIsAddingStudent(false);
    setActivePage('Dashboard');
  };

  const handleSelectStudent = (student: StudentProfile) => {
    setSelectedStudent(student);
    setIsEditingStudent(false);
    setIsAddingStudent(false);
  };

  const handleSelectStudentFromDashboardAdmin = (student: StudentProfile) => {
    setSelectedStudent(student);
    setIsEditingStudent(false);
    setIsAddingStudent(false);
    setActivePage('Students');
  };

  // Handler for Dashboard Attendance Clicks
  const handleNavigateToAttendanceHistory = (viewMode: 'issues' | 'all') => {
    setAttendanceInitState({ tab: 'history', viewMode });
    setActivePage('Attendance');
  };

  const handleBackToStudentList = () => {
    setSelectedStudent(null);
    setIsEditingStudent(false);
    setIsAddingStudent(false);
  };

  const handleEditStudent = () => {
    setIsEditingStudent(true);
  };

  const handleCancelEdit = () => {
    setIsEditingStudent(false);
  };

  const handleSaveStudent = (updatedStudent: StudentProfile) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setSelectedStudent(updatedStudent);
    setIsEditingStudent(false);
  };

  // Add Student Handlers
  const handleAddNewClick = () => {
    setSelectedStudent(null);
    setIsAddingStudent(true);
  };

  const handleSaveNewStudent = (newStudent: StudentProfile) => {
    setStudents(prev => [newStudent, ...prev]);
    setIsAddingStudent(false);
    // Optionally auto-select the new student
    // setSelectedStudent(newStudent); 
  };

  const handleCancelAdd = () => {
    setIsAddingStudent(false);
  };

  // Delete Student Handler
  const handleDeleteStudent = (id: string) => {
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selectedStudent?.id === id) {
          setSelectedStudent(null);
      }
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    
    // Reset attendance init state if navigating manually via sidebar
    if (page === 'Attendance') {
        setAttendanceInitState(null); 
    }

    if (page !== 'Students') {
       setSelectedStudent(null);
       setIsEditingStudent(false);
       setIsAddingStudent(false);
    }
  };

  const renderContent = () => {
    if (activePage === 'Dashboard') {
        // Pass students to dashboard so counts update
        return (
            <Dashboard 
                onSelectStudent={handleSelectStudentFromDashboardAdmin} 
                students={students} 
                onNavigateToHistory={handleNavigateToAttendanceHistory}
            />
        );
    }

    if (activePage === 'Attendance') {
        return (
            <Attendance 
                initialTab={attendanceInitState?.tab}
                initialViewMode={attendanceInitState?.viewMode}
            />
        );
    }

    if (activePage === 'Statistik') {
        return <Statistics />;
    }

    if (activePage === 'Students') {
      if (isAddingStudent) {
        return (
            <AddStudent 
                onSave={handleSaveNewStudent}
                onCancel={handleCancelAdd}
            />
        );
      }

      if (selectedStudent) {
        if (isEditingStudent) {
          return (
            <EditStudentProfile 
              student={selectedStudent} 
              onSave={handleSaveStudent} 
              onCancel={handleCancelEdit} 
            />
          );
        }
        return (
            <StudentDetail 
                student={selectedStudent} 
                onBack={handleBackToStudentList} 
                onEdit={handleEditStudent}
            />
        );
      }
      return (
        <StudentList 
            students={students} 
            onSelectStudent={handleSelectStudent} 
            onAddStudent={handleAddNewClick} 
            onDeleteStudent={handleDeleteStudent}
        />
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <h2 className="text-2xl font-bold text-slate-300">{activePage} Page</h2>
        <p>This module is under construction.</p>
      </div>
    );
  };

  if (authMode === 'guest') {
    return <LandingPage onLoginAdmin={handleLoginAdminClick} onEnterDashboard={handleEnterDashboard} />;
  }

  if (authMode === 'login') {
    return <LoginPage onLoginSuccess={handleAdminLoginSuccess} />;
  }

  // Viewer Mode
  if (authMode === 'viewer') {
    return (
      <div className="min-h-screen bg-[#f6f6f8] font-sans text-slate-900 flex flex-col relative">
         <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-2 text-[#135bec]">
                <span className="material-symbols-outlined text-xl">school</span>
                <span className="font-bold text-lg">Sistem Absensi</span>
            </div>
            <button 
                onClick={handleLogoutClick}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </button>
         </div>
         
         <div className="flex-1 p-6 lg:px-10 lg:py-8 max-w-[1400px] mx-auto w-full">
            {selectedStudent ? (
              <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
            ) : (
              <Dashboard 
                onSelectStudent={setSelectedStudent} 
                students={students} 
                onNavigateToHistory={(viewMode) => {
                    // Viewer mode currently doesn't have Attendance page, so maybe alert or do nothing
                    // Or ideally, we could implement a read-only attendance view for viewers later.
                    console.log("Navigation requested to:", viewMode);
                }}
              />
            )}
         </div>

         {/* Logout Confirmation Modal - Viewer */}
         {showLogoutConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-red-600 mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Confirm Logout</h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Are you sure you want to exit the viewer mode and return to the home page?
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutConfirm}
                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-200"
                  >
                    Yes, Exit
                  </button>
                </div>
              </div>
            </div>
         )}
      </div>
    );
  }

  // Admin Mode
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogoutClick} />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-30 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b">
           <h2 className="font-bold text-lg">Menu</h2>
        </div>
        <div className="p-4 space-y-2">
            <button onClick={() => {handleNavigate('Dashboard'); setSidebarOpen(false);}} className="block w-full text-left px-4 py-2 hover:bg-slate-50 rounded">Dashboard</button>
            <button onClick={() => {handleNavigate('Students'); setSidebarOpen(false);}} className="block w-full text-left px-4 py-2 hover:bg-slate-50 rounded">Students</button>
            <button onClick={() => {handleNavigate('Attendance'); setSidebarOpen(false);}} className="block w-full text-left px-4 py-2 hover:bg-slate-50 rounded">Attendance</button>
            <div className="border-t pt-2 mt-2">
                <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded">Logout</button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-800">UniAdmin</span>
          <div className="w-8 h-8 bg-slate-200 rounded-full" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           {renderContent()}
        </div>

        {/* Logout Confirmation Modal - Admin */}
        {showLogoutConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-red-600 mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Confirm Logout</h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Are you sure you want to logout? You will be returned to the landing page.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutConfirm}
                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-200"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
         )}
      </main>
    </div>
  );
};

export default App;