import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Shield, Globe, Zap, BarChart3, Users, PlayCircle, BookOpen, MapPin, Mail, Phone, Code2, Cpu, Network, Pi, Binary, Atom, Dna, Calculator, Microscope, Database, FileDigit, Target, GraduationCap } from 'lucide-react';

interface LandingPageProps {
  onLoginAdmin: () => void;
  onEnterDashboard: () => void;
}

// Background Images for the full screen section
const backgroundSlides = [
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop", // College Building
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1920&auto=format&fit=crop", // Library/Study
  "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=1920&auto=format&fit=crop", // Tech/Modern
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1920&auto=format&fit=crop"  // Students/Social
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginAdmin, onEnterDashboard }) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  // Typewriter State
  const [displayText, setDisplayText] = useState('');
  const fullText = "Intelligence";
  
  // Innovation Slider State
  const [innovationSlide, setInnovationSlide] = useState(0);

  // Mouse Position for Spotlight Effect
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background Slider Interval
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundSlides.length);
    }, 5000); // Change background every 5 seconds
    return () => clearInterval(bgInterval);
  }, []);

  // Innovation/Mission Slider Interval
  useEffect(() => {
    const slideInterval = setInterval(() => {
        setInnovationSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Toggle every 5 seconds
    return () => clearInterval(slideInterval);
  }, []);

  // Typewriter Effect Logic
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let currentIndex = 0;
    let isDeleting = false;
    
    const animateText = () => {
        if (!isDeleting && currentIndex <= fullText.length) {
            // Typing
            setDisplayText(fullText.substring(0, currentIndex));
            currentIndex++;
            timeout = setTimeout(animateText, 100); // Typing speed
        } else if (isDeleting && currentIndex >= 0) {
            // Deleting
            setDisplayText(fullText.substring(0, currentIndex));
            currentIndex--;
            timeout = setTimeout(animateText, 50); // Deleting speed
        } else if (!isDeleting && currentIndex > fullText.length) {
            // Finished typing, wait before deleting (approx 8s to read, making loop ~10s total)
            isDeleting = true;
            timeout = setTimeout(animateText, 8000); 
        } else if (isDeleting && currentIndex < 0) {
            // Finished deleting, wait before typing again
            isDeleting = false;
            currentIndex = 0;
            timeout = setTimeout(animateText, 500);
        }
    };

    animateText();

    return () => clearTimeout(timeout);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }
  };

  // Smooth Scroll Helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Content Data for Innovation Slider
  const innovationContent = [
    {
        title: "Inovasi Berkelanjutan",
        desc: "Kami terus berinovasi dengan mengintegrasikan teknologi terbaru seperti AI dan Blockchain untuk menjamin keamanan dan validitas data akademik mahasiswa.",
        icon: Zap,
        colorClass: "text-orange-500",
        bgClass: "bg-orange-500/10",
        borderClass: "border-orange-500/20",
        barGradient: "from-orange-500 to-orange-400",
        shadowClass: "shadow-[0_0_10px_rgba(249,115,22,0.5)]"
    },
    {
        title: "Misi Berkelanjutan",
        desc: "Membangun ekosistem pendidikan yang inklusif, ramah lingkungan, dan berkelanjutan untuk mencetak pemimpin masa depan yang berwawasan global.",
        icon: Target,
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/20",
        barGradient: "from-blue-500 to-blue-400",
        shadowClass: "shadow-[0_0_10px_rgba(59,130,246,0.5)]"
    }
  ];

  const activeContent = innovationContent[innovationSlide];

  return (
    <div className="min-h-screen bg-slate-950 font-display text-white selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'py-3 bg-slate-950/80 backdrop-blur-xl border-slate-800 shadow-lg shadow-blue-900/5' : 'py-6 bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
            {/* Logo Section (Left) */}
            <div className="flex-1 flex justify-start">
                <div 
                    className="flex items-center gap-3 cursor-pointer group" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <GraduationCap className="w-6 h-6 relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-white">UniPortal<span className="text-cyan-400">.</span></h2>
                    </div>
                </div>
            </div>

            {/* Nav Menu (Center) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-full border border-slate-800/50 backdrop-blur-sm">
                {[
                    { label: 'Fitur', id: 'fitur' },
                    { label: 'Tentang', id: 'tentang' },
                    { label: 'Akademik', id: 'akademik' },
                    { label: 'Kontak', id: 'kontak' }
                ].map((item) => (
                    <button 
                        key={item.label} 
                        onClick={() => scrollToSection(item.id)}
                        className="px-5 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all relative group"
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Action Section (Right) */}
            <div className="flex-1 flex items-center justify-end gap-4">
                <button 
                    onClick={onLoginAdmin}
                    className="relative px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all overflow-hidden group border border-blue-500"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Login Admin <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </div>
        </div>
      </header>

      {/* --- HERO SECTION REVISED --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
        
        {/* Dynamic Background Image Slider */}
        <div className="absolute inset-0 z-0">
             {backgroundSlides.map((img, idx) => (
                <div 
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img 
                        src={img} 
                        alt="Background" 
                        className="w-full h-full object-cover blur-[4px] scale-105" // Added blur and slight scale
                    />
                     {/* Dark Overlay for Text Readability - Maintains the 'Dongker' vibe */}
                    <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/60"></div>
                </div>
             ))}
             
             {/* Optional Abstract overlay pattern on top of images */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] z-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800/80 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-fade-up backdrop-blur-md shadow-lg shadow-black/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
                The Future of Education
            </div>

            {/* Main Heading Restored with Glitch Effect */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-tight animate-fade-up [animation-delay:200ms] drop-shadow-2xl">
                Campus <span className="inline-flex items-center relative group">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-[length:300%_auto] animate-gradient-xy pb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                        Intelligence
                    </span>
                    <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-400 opacity-70 animate-glitch-1">
                        Intelligence
                    </span>
                    <span className="absolute top-0 left-0 -z-10 w-full h-full text-pink-500 opacity-70 animate-glitch-2">
                        Intelligence
                    </span>
                </span>
                <br /> System
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up [animation-delay:400ms] drop-shadow-md">
                Platform manajemen universitas berbasis AI yang mengintegrasikan akademik, administrasi, dan kemahasiswaan dalam satu ekosistem digital futuristik.
            </p>

            {/* Buttons Revised */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24 animate-fade-up [animation-delay:600ms]">
                <button 
                    onClick={onEnterDashboard}
                    className="group relative px-9 py-4 rounded-full text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.8)] ring-1 ring-white/20"
                >
                    {/* Moving Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-[length:300%_300%] animate-gradient-xy opacity-100"></div>
                    
                    {/* Gloss/Highlight Effects */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"></div>
                    
                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-2 drop-shadow-md tracking-wide">
                        Masuk Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
                
                <button className="flex items-center gap-2 px-8 py-4 bg-slate-900/60 border border-white/10 rounded-full text-white font-bold hover:bg-slate-800/80 hover:border-white/20 transition-all group backdrop-blur-md">
                    <PlayCircle className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Tonton Demo</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto animate-fade-up [animation-delay:800ms]">
                {[
                    { label: 'Mahasiswa', value: '15,000+', icon: Users },
                    { label: 'Fakultas', value: '12', icon: BookOpen },
                    { label: 'Uptime', value: '99.9%', icon: Zap },
                    { label: 'Partner', value: '50+', icon: Globe },
                ].map((stat, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl flex flex-col items-center justify-center hover:bg-slate-800/80 transition-colors group relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <stat.icon className="w-6 h-6 text-blue-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- MARQUEE SECTION --- */}
      <div className="bg-slate-950 border-y border-white/5 py-6 overflow-hidden relative z-20">
        <div className="flex animate-marquee gap-16 min-w-max items-center">
            {/* Repeated logos for seamless loop */}
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-16 items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                     <span className="text-xl font-bold text-white flex items-center gap-2"><Cpu className="w-6 h-6" /> TECH_CORP</span>
                     <span className="text-xl font-bold text-white flex items-center gap-2"><Globe className="w-6 h-6" /> GLOBAL_UNI</span>
                     <span className="text-xl font-bold text-white flex items-center gap-2"><Network className="w-6 h-6" /> NET_SYSTEMS</span>
                     <span className="text-xl font-bold text-white flex items-center gap-2"><Code2 className="w-6 h-6" /> DEV_LABS</span>
                     <span className="text-xl font-bold text-white flex items-center gap-2"><Shield className="w-6 h-6" /> SECURE_IT</span>
                     <span className="text-xl font-bold text-white flex items-center gap-2"><Zap className="w-6 h-6" /> POWER_EDU</span>
                </div>
            ))}
        </div>
      </div>

      {/* --- MAIN CONTENT WRAPPER WITH INTERACTIVE BACKGROUND --- */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full bg-slate-950 overflow-hidden"
      >
        
        {/* === DYNAMIC BACKGROUND ELEMENTS === */}
        
        {/* 1. Interactive Spotlight Grid */}
        <div 
            className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none"
            style={{
                background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`
            }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* 2. Moving Glowing Orbs (Ambient) */}
        <div className="absolute top-0 left-[-10%] w-[40rem] h-[40rem] bg-blue-600/20 rounded-full mix-blend-screen blur-[100px] animate-blob opacity-40 pointer-events-none"></div>
        <div className="absolute top-[30%] right-[-10%] w-[35rem] h-[35rem] bg-purple-600/20 rounded-full mix-blend-screen blur-[100px] animate-blob animation-delay-2000 opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-[20%] w-[45rem] h-[45rem] bg-cyan-600/20 rounded-full mix-blend-screen blur-[100px] animate-blob animation-delay-4000 opacity-40 pointer-events-none"></div>

        {/* 3. Floating Academic Symbols (Levitating Icons) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {[
                { Icon: Pi, top: '10%', left: '5%', delay: '0s', size: 32 },
                { Icon: Binary, top: '25%', right: '15%', delay: '2s', size: 40 },
                { Icon: Atom, bottom: '20%', left: '10%', delay: '5s', size: 48 },
                { Icon: Dna, top: '45%', right: '8%', delay: '1s', size: 36 },
                { Icon: Calculator, bottom: '35%', right: '25%', delay: '3s', size: 28 },
                { Icon: Microscope, top: '15%', left: '25%', delay: '4s', size: 32 },
                { Icon: Database, bottom: '10%', left: '40%', delay: '6s', size: 24 },
                { Icon: Code2, top: '60%', left: '50%', delay: '0s', size: 40 },
                { Icon: FileDigit, bottom: '5%', right: '5%', delay: '2s', size: 30 },
            ].map((item, idx) => (
                <div 
                    key={idx}
                    className="absolute text-blue-500/10 animate-float-slow"
                    style={{ 
                        top: item.top, 
                        left: item.left, 
                        right: item.right, 
                        bottom: item.bottom,
                        animationDelay: item.delay
                    }}
                >
                    <item.Icon size={item.size} strokeWidth={1.5} />
                </div>
            ))}
        </div>
        
        {/* 4. Shooting Stars (Occasional Meteors) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="shooting-star" style={{ top: '10%', right: '20%', animationDelay: '0s' }}></div>
            <div className="shooting-star" style={{ top: '30%', right: '0%', animationDelay: '5s' }}></div>
            <div className="shooting-star" style={{ top: '60%', right: '30%', animationDelay: '8s' }}></div>
            <div className="shooting-star" style={{ top: '5%', right: '50%', animationDelay: '12s' }}></div>
        </div>

        {/* 5. Floating Particles/Stardust */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse pointer-events-none"></div>

        {/* --- SECTIONS CONTENT --- */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 py-24 space-y-32">

            {/* --- SECTION: FITUR (Interactive Cards) --- */}
            <section id="fitur" className="scroll-mt-32">
                <div className="text-center mb-16">
                    <span className="text-cyan-400 font-bold tracking-[0.2em] text-sm uppercase mb-2 block">Core Features</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Engineered for Excellence</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Fitur canggih yang dirancang untuk meningkatkan efisiensi dan transparansi akademik.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Real-time Analytics", desc: "Visualisasi data akademik yang mendalam dengan grafik interaktif.", icon: <BarChart3 className="w-8 h-8 text-cyan-400" /> },
                        { title: "Smart Attendance", desc: "Pelacakan kehadiran otomatis berbasis geolocation dan biometrik.", icon: <MapPin className="w-8 h-8 text-purple-400" /> },
                        { title: "Secure Cloud", desc: "Infrastruktur cloud terenkripsi dengan standar keamanan militer.", icon: <Shield className="w-8 h-8 text-emerald-400" /> },
                        { title: "Global Access", desc: "Akses materi pembelajaran dari seluruh dunia tanpa batas.", icon: <Globe className="w-8 h-8 text-blue-400" /> },
                        { title: "AI Assistant", desc: "Asisten virtual 24/7 untuk menjawab pertanyaan mahasiswa.", icon: <Cpu className="w-8 h-8 text-pink-400" /> },
                        { title: "Digital Library", desc: "Jutaan referensi digital dalam genggaman tangan Anda.", icon: <BookOpen className="w-8 h-8 text-amber-400" /> },
                    ].map((feature, idx) => (
                        <div 
                            key={idx} 
                            className="group relative p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] group-hover:bg-cyan-500/30 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECTION: TENTANG (Bento Grid) --- */}
            <section id="tentang" className="scroll-mt-32">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-4 h-auto lg:h-[600px]">
                    
                    {/* 1. Visi Masa Depan - Top Left (2x1) */}
                    <div className="md:col-span-2 row-span-1 rounded-3xl bg-blue-600 p-8 flex flex-col justify-center relative overflow-hidden group shadow-lg shadow-blue-900/20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Visi Masa Depan</h2>
                            <p className="text-blue-100 font-medium">Menciptakan ekosistem pendidikan tanpa batas ruang dan waktu.</p>
                        </div>
                        <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-700 rotate-12" />
                    </div>

                    {/* 2. #1 Top University - Top Middle (1x1) */}
                    <div className="md:col-span-1 row-span-1 rounded-3xl bg-slate-950/50 backdrop-blur-md border border-slate-800 p-6 flex flex-col justify-center items-center hover:border-slate-700 transition-colors shadow-lg">
                        <span className="text-5xl font-black text-emerald-400 drop-shadow-lg shadow-emerald-500/20">#1</span>
                        <span className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Top University</span>
                    </div>

                    {/* 6. Kampus Global - Right Vertical (1x3) */}
                    <div className="md:col-span-1 row-span-3 rounded-3xl overflow-hidden relative group shadow-lg border border-slate-800/50">
                        <img 
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop" 
                            alt="Global Campus" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        {/* Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 z-10">
                            <h3 className="text-xl font-bold text-white mb-1">Kampus Global</h3>
                            <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                Koneksi internasional dengan 50+ universitas mitra.
                            </p>
                        </div>
                    </div>

                    {/* 3. Inovasi/Misi Berkelanjutan - Bottom Left (2x2) - SLIDER MODIFIED */}
                    <div className="md:col-span-2 row-span-2 rounded-3xl bg-slate-950/50 backdrop-blur-md border border-slate-800 p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                        {/* Background Blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        
                        {/* Content Container with Key for Re-mounting Animation if needed */}
                        <div className="relative z-10 transition-all duration-500">
                            <div key={innovationSlide} className="animate-fade-up">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-500 ${activeContent.bgClass} ${activeContent.colorClass} ${activeContent.borderClass} group-hover:scale-110 transform`}>
                                    <activeContent.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{activeContent.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-base min-h-[4.5rem]">
                                    {activeContent.desc}
                                </p>
                            </div>
                        </div>
                        
                        {/* Progress Bars Slider */}
                        <div className="relative z-10 flex gap-4 mt-8">
                            {/* Bar 1: Innovation (Orange) */}
                            <div className="h-1.5 flex-1 bg-slate-900 rounded-full overflow-hidden relative border border-white/5">
                                <div 
                                    key={`bar-0-${innovationSlide}`}
                                    className={`h-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 rounded-full ${innovationSlide === 0 ? 'animate-filling' : 'w-0'}`}
                                ></div>
                                {innovationSlide === 0 && (
                                    <div className="absolute inset-0 bg-orange-500/10 blur-sm animate-pulse"></div>
                                )}
                            </div>
                            
                            {/* Bar 2: Mission (Blue) */}
                            <div className="h-1.5 flex-1 bg-slate-900 rounded-full overflow-hidden relative border border-white/5">
                                <div 
                                    key={`bar-1-${innovationSlide}`}
                                    className={`h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full ${innovationSlide === 1 ? 'animate-filling' : 'w-0'}`}
                                ></div>
                                {innovationSlide === 1 && (
                                    <div className="absolute inset-0 bg-blue-500/10 blur-sm animate-pulse"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4. Lecture Hall Image - Middle (1x1) */}
                    <div className="md:col-span-1 row-span-1 rounded-3xl overflow-hidden relative group shadow-lg border border-slate-800/50">
                        <img 
                            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop" 
                            alt="Lecture Hall" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                        />
                        <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors"></div>
                    </div>

                    {/* 5. 500+ Research Papers - Bottom Middle (1x1) */}
                    <div className="md:col-span-1 row-span-1 rounded-3xl bg-slate-950/50 backdrop-blur-md border border-slate-800 p-6 flex flex-col justify-center items-center hover:border-slate-700 transition-colors shadow-lg">
                        <span className="text-5xl font-black text-blue-500 drop-shadow-lg shadow-blue-500/20">500+</span>
                        <span className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Research Papers</span>
                    </div>

                </div>
            </section>

            {/* --- SECTION: AKADEMIK (Holographic Cards) --- */}
            <section id="akademik" className="scroll-mt-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Fakultas & Program Studi</h2>
                        <p className="text-slate-400 mt-2">Pilihan program studi masa depan.</p>
                    </div>
                    <button className="px-6 py-3 border border-slate-700 hover:border-white/50 text-white rounded-xl transition-all">
                        Lihat Selengkapnya
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Computer Science", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop", color: "from-blue-500 to-cyan-500" },
                        { name: "Business Digital", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop", color: "from-purple-500 to-pink-500" },
                        { name: "Cyber Security", img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop", color: "from-emerald-500 to-teal-500" },
                        { name: "AI & Robotics", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop", color: "from-orange-500 to-red-500" },
                    ].map((fac, idx) => (
                        <div key={idx} className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer">
                            <img src={fac.img} alt={fac.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90"></div>
                            
                            {/* Glowing Line */}
                            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${fac.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-xl font-bold text-white mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{fac.name}</h3>
                                <div className="flex items-center gap-2 text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <span>Explore Program</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer id="kontak" className="relative z-10 bg-slate-900 border-t border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-sm">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">UniPortal.</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Membangun masa depan pendidikan melalui teknologi yang inovatif dan inklusif.
                    </p>
                    <div className="flex gap-4">
                        {[Globe, Mail, CheckCircle2].map((Icon, i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                <Icon className="w-5 h-5" />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Fitur Utama</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Untuk Mahasiswa</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Untuk Dosen</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Portal Orang Tua</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Sumber Daya</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Dokumentasi API</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Pusat Bantuan</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Status Server</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Komunitas</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Kontak</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                            <span>Cyber Campus Tower, Level 12, Jakarta Selatan</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                            <span>hello@uniportal.id</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                            <span>+62 21 555 0123</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm">© 2024 UniPortal System. Powered by FutureTech.</p>
                <div className="flex gap-6 text-sm text-slate-500">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Security</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};