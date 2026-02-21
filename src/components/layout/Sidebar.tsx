import React from 'react';
import { LayoutDashboard, GraduationCap, ListChecks, BarChart3, LogOut } from 'lucide-react';

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage = 'Students', onNavigate, onLogout }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: GraduationCap, label: 'Students' },
    { icon: ListChecks, label: 'Attendance' },
    { icon: BarChart3, label: 'Statistik' },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#F8FAFC] border-r border-slate-200 h-screen fixed left-0 top-0 z-10">
      <div className="px-8 pt-10 pb-8">
        <h1 className="font-black text-slate-900 text-xl tracking-tight">Univ Admin</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">Attendance System</p>
      </div>

      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate?.(item.label)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activePage === item.label
                ? 'bg-blue-100 text-blue-600'
                : 'text-slate-800 hover:bg-slate-100'
            }`}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${activePage === item.label ? 'text-blue-600' : 'text-slate-900'}`} strokeWidth={2.5} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-6 pb-10 mx-2">
        <div className="border-t border-slate-200 mb-6"></div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-2 text-sm font-bold text-slate-800 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={2.5} />
          Logout
        </button>
      </div>
    </aside>
  );
};