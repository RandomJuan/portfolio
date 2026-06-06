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
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });

  const updateBarDimensions = () => {
    const container = containerRef.current;
    if (!container || spanRefs.current.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    const firstSpan = spanRefs.current[0];
    if (!firstSpan) return;

    const startLeft = firstSpan.getBoundingClientRect().left - containerRect.left;

    // Build the keyframes
    const keyframes: { scrollY: number; currentX: number }[] = [];
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    // 1. Initial keyframe: Top of the page
    const firstRight = firstSpan.getBoundingClientRect().right - containerRect.left;
    keyframes.push({ scrollY: 0, currentX: firstRight });

    // 2. Middle keyframes: Boundaries between sections
    for (let i = 1; i < navBarData.items.length; i++) {
      const prevSpan = spanRefs.current[i - 1];
      const currentSpan = spanRefs.current[i];
      const el = document.getElementById(navBarData.items[i].href.substring(1));

      if (prevSpan && currentSpan && el) {
        const prevRight = prevSpan.getBoundingClientRect().right - containerRect.left;
        const currentLeft = currentSpan.getBoundingClientRect().left - containerRect.left;
        // The midpoint of the gap between the two words
        const gapMidpoint = (prevRight + currentLeft) / 2;

        const elTop = window.scrollY + el.getBoundingClientRect().top;
        // The boundary transition happens when the top of the section reaches the middle of the screen
        const transitionScroll = elTop - window.innerHeight / 2;

        keyframes.push({ scrollY: Math.max(0, transitionScroll), currentX: gapMidpoint });
      }
    }

    // 3. Final keyframe: Bottom of the page
    const lastSpan = spanRefs.current[navBarData.items.length - 1];
    if (lastSpan) {
      const lastRight = lastSpan.getBoundingClientRect().right - containerRect.left;
      keyframes.push({ scrollY: maxScroll, currentX: lastRight });
    }

    // Ensure monotonicity (strictly increasing scroll positions)
    for (let i = keyframes.length - 2; i >= 0; i--) {
      if (keyframes[i].scrollY > keyframes[i+1].scrollY) {
        keyframes[i].scrollY = keyframes[i+1].scrollY;
      }
    }

    const currentScroll = window.scrollY;
    let targetX = keyframes[0].currentX;

    if (currentScroll <= keyframes[0].scrollY) {
      targetX = keyframes[0].currentX;
    } else if (currentScroll >= keyframes[keyframes.length - 1].scrollY) {
      targetX = keyframes[keyframes.length - 1].currentX;
    } else {
      // Find which segment we are in and linearly interpolate
      for (let i = 0; i < keyframes.length - 1; i++) {
        const k1 = keyframes[i];
        const k2 = keyframes[i + 1];
        if (currentScroll >= k1.scrollY && currentScroll <= k2.scrollY) {
          const progress = (currentScroll - k1.scrollY) / (k2.scrollY - k1.scrollY);
          targetX = k1.currentX + progress * (k2.currentX - k1.currentX);
          break;
        }
      }
    }

    setBarStyle({
      left: startLeft,
      width: targetX - startLeft
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", updateBarDimensions, { passive: true });
    updateBarDimensions();
    return () => window.removeEventListener("scroll", updateBarDimensions);
  }, [activeIndex, navBarData]);

  useEffect(() => {
    window.addEventListener("resize", updateBarDimensions);
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
        
        <div className={styles.divider} />
        
        <ThemeSwitcher />
      </nav>
    </div>
  );
}
