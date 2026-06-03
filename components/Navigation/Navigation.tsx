import { useEffect, useRef, useState } from "react";
import { NavBarData } from "@/types/navbar";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import styles from "./Navigation.module.css";

type Props = {
  navBarData: NavBarData;
  activeIndex: number;
  onNavigate: (index: number) => void;
};

export default function Navigation({ navBarData, activeIndex, onNavigate }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstSpanRef = useRef<HTMLSpanElement | null>(null);
  const lastSpanRef = useRef<HTMLSpanElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateBarDimensions = () => {
    const container = containerRef.current;
    const first = firstSpanRef.current;
    const last = lastSpanRef.current;
    if (!container || !first || !last) return;

    const containerRect = container.getBoundingClientRect();
    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();

    const startLeft = firstRect.left - containerRect.left;
    const startWidth = firstRect.width;
    const maxRight = lastRect.right - containerRect.left;
    const maxSpanWidth = maxRight - startLeft;

    const currentWidth = startWidth + scrollProgress * (maxSpanWidth - startWidth);
    setBarStyle({ left: startLeft, width: currentWidth });
  };

  useEffect(() => {
    updateBarDimensions();
  }, [scrollProgress]);

  useEffect(() => {
    window.addEventListener("resize", updateBarDimensions);
    updateBarDimensions();
    const t = setTimeout(updateBarDimensions, 100);
    return () => {
      window.removeEventListener("resize", updateBarDimensions);
      clearTimeout(t);
    };
  }, [navBarData]);

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navContainer}>
        <div ref={containerRef} className={styles.linksContainer}>
          {navBarData.items.map((item, index) => {
            const isActive = activeIndex === index;
            const isFirst = index === 0;
            const isLast = index === navBarData.items.length - 1;

            return (
              <button
                key={item.href}
                onClick={() => onNavigate(index)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <span 
                  ref={(el) => {
                    if (isFirst) firstSpanRef.current = el;
                    if (isLast) lastSpanRef.current = el;
                  }}
                  className={styles.label}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
          
          <div 
            className={styles.scrollProgressBar}
            style={{
              left: `${barStyle.left}px`,
              width: `${barStyle.width}px`,
            }}
          />
        </div>
        
        <div className={styles.divider} />
        
        <ThemeSwitcher />
      </nav>
    </div>
  );
}
