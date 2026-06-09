/**
 * Navigation Bar
 * --------------
 * Sticky top navigation menu that tracks scroll progress and allows jumping between sections.
 * 
 * Responsibilities:
 * - Renders navigation links (Home, About, Experience, Contact).
 * - Tracks scroll position via the `useNavigationProgress` hook to smoothly animate an underline indicating the active section.
 * - Mounts the ThemeSwitcher component.
 */

import { useRef } from "react";
import { NavBarData } from "@/types/navbar";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import { useNavigationProgress } from "./hooks/useNavigationProgress";
import styles from "./Navigation.module.css";

type Props = {
  navBarData: NavBarData;
  activeIndex: number;
  onNavigate: (index: number) => void;
};

export default function Navigation({ navBarData, activeIndex, onNavigate }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barStyle = useNavigationProgress(containerRef, spanRefs, navBarData, activeIndex);

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navContainer}>
        <div ref={containerRef} className={styles.linksContainer}>
          {navBarData.items.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={item.href}
                onClick={() => onNavigate(index)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <span 
                  ref={(el) => {
                    spanRefs.current[index] = el;
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
        
        <div className={styles.divider} aria-hidden="true" />
        
        <ThemeSwitcher />
      </nav>
    </div>
  );
}
