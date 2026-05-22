"use client";

import { useEffect, useRef } from "react";
import { ExperienceData } from "@/types/experience";
import Fireflies from "../Fireflies/Fireflies";
import styles from "./ExperienceSection.module.css";

type Props = {
  experienceData: ExperienceData;
};

export default function ExperienceSection({ experienceData }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animatables = section.querySelectorAll<HTMLElement>("[data-animate]");

    const rootContainer = section.closest('.preview-viewport-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("exp-visible");
          } else if (rootContainer) {
            // Only remove the class when in the navbar so it replays continuously while scrolling
            (entry.target as HTMLElement).classList.remove("exp-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: rootContainer ? "0px" : "50px", root: rootContainer || null }
    );

    animatables.forEach((el) => observer.observe(el));
    
    // Scroll progress line logic
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
      timelineWrapper.style.setProperty('--scroll-progress', `${progress}`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={sectionRef}
        className={`${styles.container} avoid-zone`}
      >
        {/* Title Header */}
        <div
          data-animate="from-bottom"
          className={styles.titleWrapper}
        >
          <h2 className={styles.sectionLabel}>
            {experienceData.sectionTitle}
          </h2>
          <div className={styles.separator} />
          <h3 className={styles.mainTitle}>
            My Journey
          </h3>
        </div>

        {/* Timeline Section */}
        <div className={styles.timelineWrapper}>
          <div className={styles.centerLine}>
            <div className={styles.progressLine} />
          </div>

          <div className={styles.cardsWrapper}>
            {experienceData.experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              // Cards on the right side (isEven=true) come from the right; left cards from left
              const cardDirection = isEven ? "from-right" : "from-left";
              // Stagger delay increases per item
              const delay = `${index * 120}ms`;

              return (
                <div
                  key={index}
                  className={`${styles.timelineItem} ${isEven ? styles.timelineItemReverse : ""}`}
                >
                  {/* Timeline Center Dot */}
                  <div
                    data-animate="dot"
                    style={{ transitionDelay: delay }}
                    className={styles.dot}
                  >
                    <div className={styles.dotInner} />
                  </div>

                  {/* Content Card */}
                  <div
                    data-animate={cardDirection}
                    style={{ transitionDelay: `${index * 120 + 80}ms` }}
                    className={`${styles.cardContainer} ${isEven ? styles.cardContainerRight : styles.cardContainerLeft}`}
                  >
                    <div className={`${styles.cardBody} group`}>
                      <div className={styles.periodWrapper}>
                        <span className={styles.periodBadge}>
                          {exp.period}
                        </span>
                      </div>
                      <h3 className={`${styles.expTitle} group-hover:opacity-100`}>
                        {exp.title}
                      </h3>
                      <p className={styles.expDesc}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack Row */}
        <div className={styles.techRow}>
          <p className={styles.techTitle}>
            {experienceData.techStackTitle}
          </p>

          <div className={styles.techWrap}>
            {experienceData.techStack.map((tech, idx) => (
              <div
                key={idx}
                data-animate="from-bottom"
                style={{ transitionDelay: `${idx * 50}ms` }}
                className={styles.techBadge}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <Fireflies/> */}
    </>
  );
}
