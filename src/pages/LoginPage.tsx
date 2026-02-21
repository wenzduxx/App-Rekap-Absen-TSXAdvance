import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, XCircle, User, Lock, Eye, EyeOff, Globe, Building2, ShieldCheck, ExternalLink, School } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !password) {
        setError("Harap isi Username dan Password.");
        return;
    }

    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
        if (username === 'admin123' && password === 'admin123') {
            setIsLoading(false);
            setIsSuccess(true);
            
            // Redirect delay
            setTimeout(() => {
                onLoginSuccess();
            }, 2000);
        } else {
            setIsLoading(false);
            // Specific Error Logic
            if (username !== 'admin123') {
                setError("Username tidak ditemukan atau salah.");
            } else {
                setError("Password yang Anda masukkan salah.");
            }
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-display text-[#0d121b] dark:text-white antialiased transition-colors duration-200 flex flex-col relative overflow-hidden">
        
        {/* Success Modal Overlay */}
        {isSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-300 border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-sm">
                        <CheckCircle className="w-10 h-10 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Login Berhasil!</h2>
                    <p className="text-slate-500 mb-6">
                        Selamat datang kembali, Admin. Mengalihkan ke dashboard...
                    </p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_forwards]" style={{width: '0%'}}></div>
                        <style>{`
                            @keyframes loading {
                                0% { width: 0%; }
                                100% { width: 100%; }
                            }
                        `}</style>
                    </div>
                </div>
            </div>
        )}

        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#135bec 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
        </div>

        {/* Header */}
        <header className="relative z-10 flex w-full items-center justify-between border-b border-[#e7ebf3] dark:border-[#2a3447] px-6 py-4 lg:px-10 bg-white/60 dark:bg-[#101622]/60 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg bg-[#135bec]/10 p-2 text-[#135bec]">
                    <School className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-tight">Sistem Absensi Mahasiswa</h2>
            </div>
            <div className="flex items-center gap-6">
                <a className="text-sm font-medium hover:text-[#135bec] transition-colors hidden sm:block" href="#">Bantuan</a>
                <button className="flex items-center gap-2 rounded-lg border border-[#e7ebf3] dark:border-[#2a3447] bg-white dark:bg-[#1a2333] px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#253045] transition-colors">
                    <Globe className="w-5 h-5" />
                    <span>ID</span>
                </button>
            </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex flex-grow flex-col items-center justify-center p-6 lg:p-10">
            <div className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-8 lg:gap-20 items-center justify-center">
                
                {/* Login Form Section */}
                <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-[#1a2333] lg:bg-transparent lg:dark:bg-transparent p-6 sm:p-8 lg:p-0 rounded-2xl shadow-xl lg:shadow-none border border-[#e7ebf3] dark:border-[#2a3447] lg:border-none">
                    <div className="flex flex-col gap-2 mb-8 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-bold text-[#135bec]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Admin Portal
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#0d121b] dark:text-white">
                            Selamat Datang Kembali
                        </h1>
                        <p className="text-sm text-[#4c669a] dark:text-slate-400">
                            Silakan masuk menggunakan kredensial admin Anda untuk mengelola sistem.
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2">
                            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-red-800 font-medium">
                                {error}
                            </div>
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-bold text-[#0d121b] dark:text-white mb-2" htmlFor="username">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#4c669a] group-focus-within:text-[#135bec] transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input 
                                    className={`w-full rounded-lg border bg-white dark:bg-[#1a2333]/50 pl-10 pr-4 py-3 text-sm placeholder:text-gray-400 outline-none transition-all shadow-sm ${error && error.includes('Username') ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#e7ebf3] dark:border-[#2a3447] focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec]'}`}
                                    id="username" 
                                    placeholder="Masukkan Username" 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading || isSuccess}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#0d121b] dark:text-white mb-2" htmlFor="password">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#4c669a] group-focus-within:text-[#135bec] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input 
                                    className={`w-full rounded-lg border bg-white dark:bg-[#1a2333]/50 pl-10 pr-10 py-3 text-sm placeholder:text-gray-400 outline-none transition-all shadow-sm ${error && error.includes('Password') ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#e7ebf3] dark:border-[#2a3447] focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec]'}`}
                                    id="password" 
                                    placeholder="Masukkan Password" 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading || isSuccess}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4c669a] hover:text-[#0d121b] dark:hover:text-white transition-colors cursor-pointer"
                                    disabled={isLoading || isSuccess}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a2333] text-[#135bec] focus:ring-[#135bec] h-4 w-4 transition-colors" type="checkbox" />
                                <span className="text-sm font-medium text-[#4c669a] group-hover:text-[#0d121b] dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors">Ingat saya</span>
                            </label>
                            <a className="text-sm font-bold text-[#135bec] hover:text-blue-700 transition-colors" href="#">Lupa Password?</a>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading || isSuccess}
                            className={`group relative flex w-full items-center justify-center overflow-hidden rounded-lg py-3.5 text-sm font-bold text-white shadow-lg transition-all ${isLoading ? 'bg-blue-400 cursor-wait' : 'bg-[#135bec] hover:bg-blue-700 hover:shadow-blue-600/30 shadow-blue-500/25'}`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Masuk sebagai Admin
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#e7ebf3] dark:border-[#2a3447]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#f6f6f8] dark:bg-[#101622] px-2 text-[#4c669a] dark:text-slate-500 font-medium lg:bg-transparent lg:backdrop-blur-sm lg:px-4">Atau</span>
                        </div>
                    </div>
                    
                    <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e7ebf3] dark:border-[#2a3447] bg-white dark:bg-[#1a2333] py-3 text-sm font-bold text-[#0d121b] dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-[#253045] hover:border-blue-200 dark:hover:border-blue-800">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span>Single Sign-On (SSO)</span>
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-[#4c669a] dark:text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span>Secure SSL Encryption</span>
                        <span className="mx-1">•</span>
                        <span>Official University Portal</span>
                    </div>
                </div>

                {/* Right Column: Image */}
                <div className="w-full max-w-[580px] relative hidden lg:block">
                    <div className="absolute -top-10 -right-10 w-full h-full bg-[#135bec]/5 rounded-3xl -z-10 transform rotate-6 border border-[#135bec]/5"></div>
                    <div className="absolute -bottom-10 -left-10 w-full h-full bg-blue-200/20 dark:bg-blue-900/10 rounded-3xl -z-10 transform -rotate-3 border border-blue-200/20"></div>
                    <div className="relative w-full aspect-[4/3.2] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-[#e7ebf3] dark:border-[#2a3447] group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d121b]/90 via-[#0d121b]/30 to-transparent z-10 flex flex-col justify-end p-8 text-white">
                            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-white/20 backdrop-blur-md rounded-md p-1">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/90 bg-[#135bec]/80 px-2 py-1 rounded backdrop-blur-sm">Akses Terbatas</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Pusat Administrasi Akademik</h3>
                                <p className="text-white/80 text-sm leading-relaxed max-w-[90%]">Kelola data kehadiran, jadwal perkuliahan, dan laporan akademik dalam satu platform terintegrasi yang aman.</p>
                            </div>
                        </div>
                        <div 
                            className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-700 group-hover:scale-105" 
                            style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBcao5XxR18yY_z3ck4dM9y1H71RcfvjMjz9eAgT6HGjWTWRygmKGwAifhDgfB64pQagaKFZHujkdMHN5oHbuCJxfGTt3vq0nYopMQ25R8ffDY3fQR-GuOpUbLLlZ5yNcz52wvBeG1J0QtDuOffqqLnooO2fvbLs8cNWGYb1gp0S-Ac-6LWTVQAAhHRNrYa9dlOjTFV7hUadcJc3FtrqxaG0Z62jBxtfN8FFt3ZEMViW6G_JzQF_jz9gZ9H_kTcnB_4uKKenSjYQEF')"}}
                        >
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full py-6 px-6 lg:px-10">
            <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e7ebf3] dark:border-[#2a3447]">
                <p className="text-sm text-[#4c669a] dark:text-slate-500">
                    © 2024 Universitas. Hak Cipta Dilindungi.
                </p>
                <div className="flex gap-6">
                    <a className="text-sm font-medium text-[#4c669a] hover:text-[#135bec] dark:text-slate-400 dark:hover:text-[#135bec] transition-colors" href="#">Kebijakan Privasi</a>
                    <a className="text-sm font-medium text-[#4c669a] hover:text-[#135bec] dark:text-slate-400 dark:hover:text-[#135bec] transition-colors" href="#">Syarat Penggunaan</a>
                    <a className="text-sm font-medium text-[#4c669a] hover:text-[#135bec] dark:text-slate-400 dark:hover:text-[#135bec] transition-colors flex items-center gap-1" href="#">
                        Hubungi IT Support
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </footer>
    </div>
  );
};