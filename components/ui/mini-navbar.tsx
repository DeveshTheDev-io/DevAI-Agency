
import React, { useState, useEffect, useRef } from 'react';

// Added interface for AnimatedNavLink props to improve type safety
interface AnimatedNavLinkProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

/**
 * AnimatedNavLink component that handles the sliding text effect.
 * It uses a fixed height and overflow:hidden to ensure only one label is visible.
 */
const AnimatedNavLink: React.FC<AnimatedNavLinkProps> = ({ label, onClick, isActive }) => {
  const defaultTextColor = isActive ? 'text-white' : 'text-neutral-400';
  const hoverTextColor = 'text-white';
  
  // Using explicit pixel height (24px) for perfect clipping
  const NAV_HEIGHT = '24px';

  return (
    <div 
      onClick={onClick} 
      className="group relative cursor-pointer outline-none select-none"
      style={{ height: NAV_HEIGHT, overflow: 'hidden' }}
    >
      <div 
        className="flex flex-col transition-all duration-500 ease-in-out transform group-hover:-translate-y-1/2"
      >
        {/* First State: Visible by default */}
        <span 
          className={`flex items-center justify-center text-[13px] font-medium tracking-tight transition-colors leading-none`}
          style={{ height: NAV_HEIGHT, color: isActive ? '#fff' : '#a3a3a3' }}
        >
          {label}
        </span>
        
        {/* Second State: Visible on hover */}
        <span 
          className={`flex items-center justify-center text-[13px] font-medium tracking-tight text-white leading-none`}
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
  currentPage: 'home' | 'about';
}

export function Navbar({ onScrollToSection, onNavigateToPage, currentPage }: NavbarProps) {
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
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <div 
      className="flex items-center gap-3 cursor-pointer group pr-2"
      onClick={() => onNavigateToPage('home')}
    >
      {/* High-end Logo Mark */}
      <div className="relative w-5 h-5 flex items-center justify-center group-hover:rotate-90 transition-transform duration-700 ease-in-out">
        <span className="absolute w-1.5 h-1.5 rounded-full bg-purple-500 top-0 left-1/2 transform -translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
        <span className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 left-0 top-1/2 transform -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
        <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 right-0 top-1/2 transform -translate-y-1/2 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
        <span className="absolute w-1.5 h-1.5 rounded-full bg-amber-500 bottom-0 left-1/2 transform -translate-x-1/2 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
      </div>
      
      {/* "Smart" Typography Design for DevA.I Agency */}
      <div className="flex flex-col sm:flex-row items-baseline leading-none gap-0 sm:gap-1.5 select-none">
        <div className="flex items-baseline">
          <span className="text-sm font-bold tracking-tighter text-white">Dev</span>
          <span className="text-sm font-black tracking-tighter bg-gradient-to-br from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">A.I</span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-500 uppercase opacity-60 group-hover:opacity-100 group-hover:text-neutral-300 transition-all duration-300">Agency</span>
      </div>
    </div>
  );

  const navLinksData: { label: string; action: () => void; isActive?: boolean }[] = [
    { label: 'Agents', action: () => onScrollToSection('agents') },
    { label: 'Projects', action: () => onScrollToSection('projects') },
    { label: 'About', action: () => onNavigateToPage('about'), isActive: currentPage === 'about' },
    { label: 'Plans', action: () => onScrollToSection('plans') },
    { label: 'Workflow', action: () => onScrollToSection('workflow') },
  ];

  const loginButtonElement = (
    <button className="px-5 py-2 sm:px-4 text-xs font-semibold border border-neutral-800 bg-neutral-900/40 text-neutral-400 rounded-full hover:border-neutral-600 hover:text-white transition-all duration-300 w-full sm:w-auto">
      LogIn
    </button>
  );

  const signupButtonElement = (
    <div className="relative group w-full sm:w-auto">
       <div className="absolute inset-0 -m-1 rounded-full
                     hidden sm:block
                     bg-purple-500/20
                     opacity-0 filter blur-md pointer-events-none
                     transition-all duration-500 ease-out
                     group-hover:opacity-100 group-hover:blur-xl group-hover:-m-2"></div>
       <button className="relative z-10 px-5 py-2 sm:px-4 text-xs font-bold text-black bg-white rounded-full hover:bg-neutral-200 transition-all duration-300 w-full sm:w-auto active:scale-95">
         Signup
       </button>
    </div>
  );

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
          {loginButtonElement}
          {signupButtonElement}
        </div>

        <button 
          className="lg:hidden flex items-center justify-center w-8 h-8 text-neutral-400 hover:text-white transition-colors focus:outline-none" 
          onClick={toggleMenu} 
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
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
        </nav>
        <div className="flex flex-col items-center space-y-3 mt-8 w-full px-4">
          {loginButtonElement}
          {signupButtonElement}
        </div>
      </div>
    </header>
  );
}
