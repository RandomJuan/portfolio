import { useEffect } from "react";
import styles from "../ExperienceSection.module.css";

export function useExperienceAnimations(sectionRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Title and tech stack are animated via viewport intersection
    const nonTimelineAnimatables = section.querySelectorAll<HTMLElement>(`.${styles.titleWrapper}, .${styles.techWrap} > [data-animate]`);
    const rootContainer = section.closest('.preview-viewport-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("exp-visible");
          } else {
            // Reset and remove class if scrolled back up (element is below viewport bottom)
            if (entry.boundingClientRect.top > window.innerHeight || rootContainer) {
              (entry.target as HTMLElement).classList.remove("exp-visible");
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: rootContainer ? "0px" : "50px", root: rootContainer || null }
    );

    nonTimelineAnimatables.forEach((el) => observer.observe(el));

    // Scroll progress line & kinetic item reveal logic
    const timelineWrapper = section.querySelector(`.${styles.timelineWrapper}`) as HTMLElement;

    const handleScroll = () => {
      if (!timelineWrapper) return;
      const rect = timelineWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much the timeline has entered the viewport
      // It starts when the top of timelineWrapper is at 50% of the screen
      // It ends when the bottom of timelineWrapper is at 50% of the screen
      const start = rect.top - windowHeight / 2;

      let progress = 0;
      if (start < 0) {
        progress = Math.min(1, Math.max(0, -start / rect.height));
      }

      // Update CSS variable for the height of the progress line
      timelineWrapper.style.setProperty('--scroll-progress', `${Math.max(0.001, progress)}`);

      // Reveal timeline elements progressively as the scroll line reaches them, resetting on scroll-up
      const items = timelineWrapper.querySelectorAll(`.${styles.timelineItem}`);
      items.forEach((itemEl) => {
        const itemRect = itemEl.getBoundingClientRect();
        // Dot triggers when it reaches the 50% center mark of the viewport
        if (itemRect.top <= windowHeight / 2 + 30) {
          itemEl.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.add("exp-visible");
          });
        } else {
          itemEl.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.remove("exp-visible");
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRef]);
}
