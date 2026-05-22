import { useEffect } from "react";

/**
 * Synchronizes the scroll position of the main page sections with their miniature preview counterparts.
 * Uses passive event listeners and requestAnimationFrame for 60fps performance without React re-renders.
 */
export function useScrollSync(sections: string[]) {
  useEffect(() => {
    const syncScroll = () => {
      sections.forEach((id, idx) => {
        const sectionEl = document.getElementById(id);
        if (!sectionEl) return;
        
        const rect = sectionEl.getBoundingClientRect();
        // Calculate how much of the section has scrolled up past the top of the viewport
        const scrollTop = rect.top < 0 ? -rect.top : 0;
        
        // Directly select corresponding preview DOM elements bypassing React's render lifecycle
        const previewEls = document.querySelectorAll(`.preview-scroll-container[data-preview-index="${idx}"]`);
        previewEls.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.transform = `translateY(${-scrollTop}px)`;
          }
        });
      });
    };

    let frameId: number;
    const throttledScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncScroll);
    };

    // Use passive listener to avoid blocking browser main thread scrolling
    window.addEventListener("scroll", throttledScroll, { passive: true });
    
    // Initial execution to align elements immediately on mount
    syncScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      cancelAnimationFrame(frameId);
    };
  }, [sections]);
}
