import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Shield } from 'lucide-react';

interface AnimatedNavLinkProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const AnimatedNavLink: React.FC<AnimatedNavLinkProps> = ({ label, onClick, isActive }) => {
  const NAV_HEIGHT = '24px';

  return (
    <div 
      onClick={onClick} 
      className="group relative cursor-pointer outline-none select-none"
      style={{ height: NAV_HEIGHT, overflow: 'hidden' }}
    >
      <div className="flex flex-col transition-all duration-500 ease-in-out transform group-hover:-translate-y-1/2">
        <span 
          className="flex items-center justify-center text-[13px] font-medium tracking-tight transition-colors leading-none"
          style={{ height: NAV_HEIGHT, color: isActive ? '#fff' : '#a3a3a3' }}
        >
          {label}
        </span>
        <span 
          className="flex items-center justify-center text-[13px] font-medium tracking-tight text-white leading-none"
          style={{ height: NAV_HEIGHT }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

interface NavbarProps {
  onScrollToSection: (id: string) => void;
  onNavigateToPage: (page: 'home' | 'about') => void;
  onAuthOpen: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  currentPage: 'home' | 'about';
  user: any;
  isAdmin?: boolean;
}

export function Navbar({ 
  onScrollToSection, 
  onNavigateToPage, 
  onAuthOpen,
  onLogout,
  currentPage, 
  user,
  isAdmin 
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }
    if (isOpen) {
      setHeaderShapeClass('rounded-2xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }
    return () => {
      if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    };
  }, [isOpen]);

  const logoElement = (
    <div 
      className="flex items-center gap-3 cursor-pointer group pr-2"
      onClick={() => onNavigateToPage('home')}
    >
      <div className="relative w-5 h-5 flex items-center justify-center group-hover:rotate-90 transition-transform duration-700 ease-in-out">
        <span className="absolute w-1.5 h-1.5 rounded-full bg-purple-500 top-0 left-1/2 transform -translate-x-1/2"></span>
        <span className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 left-0 top-1/2 transform -translate-y-1/2"></span>
        <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 right-0 top-1/2 transform -translate-y-1/2"></span>
        <span className="absolute w-1.5 h-1.5 rounded-full bg-amber-500 bottom-0 left-1/2 transform -translate-x-1/2"></span>
      </div>
      <div className="flex flex-col sm:flex-row items-baseline leading-none gap-0 sm:gap-1.5 select-none">
        <div className="flex items-baseline">
          <span className="text-sm font-bold tracking-tighter text-white">Devscosmic</span>
          <span className="ml-1 text-sm font-black tracking-tighter bg-gradient-to-br from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">A.I</span>
        </div>
      </div>
    </div>
  );

  const navLinksData = [
    { label: 'Agents', action: () => onScrollToSection('agents') },
    { label: 'Projects', action: () => onScrollToSection('projects') },
    { label: 'Workflow', action: () => onScrollToSection('workflow') },
    { label: 'Courses', action: () => onScrollToSection('courses') },
    { label: 'Plans', action: () => onScrollToSection('plans') },
    { label: 'Portfolio', action: () => window.location.href = '/portfolio.html' },
    { label: 'About', action: () => onNavigateToPage('about'), isActive: currentPage === 'about' },
  ];

  return (
    <header className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[200]
                       flex flex-col items-center
                       px-5 py-2.5 backdrop-blur-xl
                       ${headerShapeClass}
                       border border-white/5 bg-black/40
                       w-[calc(100%-2.5rem)] sm:w-auto
                       shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                       transition-all duration-500 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-10">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden lg:flex items-center space-x-6">
          {navLinksData.map((link, idx) => (
            <AnimatedNavLink 
              key={idx} 
              label={link.label} 
              onClick={() => {
                link.action();
                setIsOpen(false);
              }}
              isActive={link.isActive}
            />
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] font-bold text-white leading-none">{user.name}</span>
                {isAdmin && <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest mt-0.5">Admin</span>}
              </div>
              <button 
                onClick={onLogout}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center hover:border-red-500/50 hover:bg-red-500/10 transition-all text-neutral-400 hover:text-red-400"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onAuthOpen('login')}
                className="px-5 py-2 text-xs font-semibold border border-neutral-800 bg-neutral-900/40 text-neutral-400 rounded-full hover:border-neutral-600 hover:text-white transition-all duration-300"
              >
                LogIn
              </button>
              <button 
                onClick={() => onAuthOpen('signup')}
                className="px-5 py-2 text-xs font-bold text-black bg-white rounded-full hover:bg-neutral-200 transition-all duration-300 active:scale-95"
              >
                Signup
              </button>
            </>
          )}
        </div>

        <button 
          className="lg:hidden flex items-center justify-center w-8 h-8 text-neutral-400 hover:text-white transition-colors focus:outline-none" 
          onClick={toggleMenu} 
        >
          {isOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`lg:hidden flex flex-col items-center w-full transition-all ease-in-out duration-500 overflow-hidden
                       ${isOpen ? 'max-h-[500px] opacity-100 pt-6 pb-2' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-6 text-sm w-full">
          {navLinksData.map((link, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                link.action();
                setIsOpen(false);
              }}
              className={`transition-colors w-full text-center font-medium ${link.isActive ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              {link.label}
            </button>
          ))}
          {!user ? (
            <div className="flex flex-col items-center space-y-3 w-full px-4">
              <button onClick={() => { onAuthOpen('login'); setIsOpen(false); }} className="w-full py-3 text-xs font-semibold text-neutral-400 border border-neutral-800 rounded-full">LogIn</button>
              <button onClick={() => { onAuthOpen('signup'); setIsOpen(false); }} className="w-full py-3 text-xs font-bold text-black bg-white rounded-full">Signup</button>
            </div>
          ) : (
            <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full py-3 text-xs font-bold text-red-500 border border-red-500/20 rounded-full">Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}