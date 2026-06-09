import { useState, useEffect, RefObject } from "react";
import { NavBarData } from "@/types/navbar";

export function useNavigationProgress(
  containerRef: RefObject<HTMLDivElement | null>,
  spanRefs: RefObject<(HTMLSpanElement | null)[]>,
  navBarData: NavBarData,
  activeIndex: number
) {
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateBarDimensions = () => {
      const container = containerRef.current;
      if (!container || spanRefs.current?.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const firstSpan = spanRefs.current?.[0];
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
        const prevSpan = spanRefs.current?.[i - 1];
        const currentSpan = spanRefs.current?.[i];
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
      const lastSpan = spanRefs.current?.[navBarData.items.length - 1];
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

    window.addEventListener("scroll", updateBarDimensions, { passive: true });
    window.addEventListener("resize", updateBarDimensions);
    const t = setTimeout(updateBarDimensions, 100);

    return () => {
      window.removeEventListener("scroll", updateBarDimensions);
      window.removeEventListener("resize", updateBarDimensions);
      clearTimeout(t);
    };
  }, [activeIndex, navBarData, containerRef, spanRefs]);

  return barStyle;
}
