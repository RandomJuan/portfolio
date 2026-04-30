'use client';
import { useState, useEffect, useRef } from "react";
import { NavBarData } from "@/types/navbar";
import { useTheme } from "@/components/ThemeProvider/ThemeContext";

type Props = {
  navBarData: NavBarData;
};

export default function NavBarSection({ navBarData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAutoHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 500);
  };

  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsOpen(true);
          triggerAutoHide();
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const prev = activeIndexRef.current;
        const nextIndex = (prev + 1) % navBarData.items.length;
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        
        const href = navBarData.items[nextIndex].href;
        const el = document.getElementById(href.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'instant' });
          window.history.replaceState(null, '', href);
        } else {
          window.location.hash = href;
        }
        triggerAutoHide();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = activeIndexRef.current;
        const prevIndex = (prev - 1 + navBarData.items.length) % navBarData.items.length;
        activeIndexRef.current = prevIndex;
        setActiveIndex(prevIndex);

        const href = navBarData.items[prevIndex].href;
        const el = document.getElementById(href.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'instant' });
          window.history.replaceState(null, '', href);
        } else {
          window.location.hash = href;
        }
        triggerAutoHide();
      } else if (e.key === 'Enter' || e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen, navBarData.items]);

  return (
    <nav 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-[900] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-24px)]'}
      `}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(true)}
    >
      <div 
        className={`flex flex-col justify-center py-10 pl-10 pr-6 min-h-[300px]
          backdrop-blur-xl shadow-2xl transition-colors duration-500
          ${theme.mode === 'dark' ? 'bg-slate-900/90 border-slate-700/50' : 'bg-white/90 border-slate-200/50'}
        `}
        style={{
          clipPath: 'polygon(24px 0%, 100% 0%, 100% 100%, 24px 100%, 0% 50%)',
          borderLeft: `2px solid ${theme.accentHex}`,
        }}
      >
        <ul className="flex flex-col gap-8">
          {navBarData.items.map((item, i) => (
            <li key={item.label} className="relative">
              <a 
                href={item.href}
                className={`flex items-center gap-4 text-base font-semibold transition-all duration-300
                  ${activeIndex === i ? (theme.mode === 'dark' ? 'text-white translate-x-2' : 'text-slate-900 translate-x-2') : (theme.mode === 'dark' ? 'text-slate-400' : 'text-slate-500')}
                  hover:translate-x-2 cursor-pointer
                `}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setIsOpen(false)}
              >
                <span 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} 
                  style={{ backgroundColor: theme.accentHex, boxShadow: `0 0 10px ${theme.accentHex}` }} 
                />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
