'use client';

import { useState, useEffect, useRef } from "react";

export function usePortfolioNavigation(sectionsList: string[]) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  
  // Track scroll lock to prevent observer conflicts during smooth click navigations
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const navigateTo = (index: number) => {
    const id = sectionsList[index];
    const el = document.getElementById(id);
    if (el) {
      isScrollingRef.current = true;

      // Clear any pending scroll-lock release timers
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Calculate shortest-path rotation offset cleanly
      let diff = index - activeIndexRef.current;
      if (diff > 2) diff -= 4;
      if (diff < -2) diff += 4;
      setRotationAngle(prev => prev - diff * 90);
      setActiveIndex(index);
      
      // Update browser history hash safely
      window.history.replaceState(null, '', `#${id}`);

      // Native smooth scroll into focus
      el.scrollIntoView({ behavior: "smooth" });

      // Release navigation lock shortly after smooth scroll landing
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  // Keyboard navigation: Left/Right and Up/Down arrows to traverse sections with wrap-around
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Safely ignore keys if the user is typing in a form input or textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
         activeEl.tagName === "TEXTAREA" ||
         activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const nextIdx = (activeIndexRef.current - 1 + sectionsList.length) % sectionsList.length;
        navigateTo(nextIdx);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = (activeIndexRef.current + 1) % sectionsList.length;
        navigateTo(nextIdx);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsList]);

  // Sync initial hash on client-side mount safely to prevent hydration mismatches
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const idx = sectionsList.indexOf(hash);
      if (idx !== -1) {
        setActiveIndex(idx);
        setRotationAngle(-idx * 90);
        
        // Scroll to target hash immediately on client load
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "auto" });
        }, 120);
      }
    }
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Silky smooth requestAnimationFrame-throttled scroll listener.
  // Checks if the absolute viewport center lies within each section boundary to maintain perfect symmetry on both up and down scrolls.
  useEffect(() => {
    let frameId: number;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const viewportCenter = window.innerHeight / 2;
      let currentActiveIndex = activeIndexRef.current;

      for (let i = 0; i < sectionsList.length; i++) {
        const el = document.getElementById(sectionsList[i]);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // Check if the viewport center lies within the section boundary
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          currentActiveIndex = i;
          break;
        }
      }

      if (currentActiveIndex !== activeIndexRef.current) {
        const prevActive = activeIndexRef.current;
        setActiveIndex(currentActiveIndex);

        let diff = currentActiveIndex - prevActive;
        if (diff > 2) diff -= 4;
        if (diff < -2) diff += 4;
        setRotationAngle(prev => prev - diff * 90);

        // Update the browser URL hash dynamically to match the current scrolled section
        const id = sectionsList[currentActiveIndex];
        window.history.replaceState(null, '', `#${id}`);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount to align initial layout active state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsList]);

  return {
    activeIndex,
    rotationAngle,
    navigateTo,
  };
}
