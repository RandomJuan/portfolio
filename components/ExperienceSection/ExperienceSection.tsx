"use client";

/**
 * Experience Section
 * ------------------
 * Displays a chronological timeline of work experiences and a grid of technologies.
 * 
 * Responsibilities:
 * - Renders an alternating left/right timeline of past roles.
 * - Displays a grid of technical skills.
 * - Uses the `useExperienceAnimations` hook to handle scroll-based IntersectionObserver logic, triggering animations as items enter the viewport.
 */

import { useRef } from "react";
import { ExperienceData } from "@/types/experience";
import { useExperienceAnimations } from "./hooks/useExperienceAnimations";
import styles from "./ExperienceSection.module.css";

type Props = {
  experienceData: ExperienceData;
};

export default function ExperienceSection({ experienceData }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useExperienceAnimations(sectionRef);

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
          <div className={styles.separator} aria-hidden="true" />
          <h3 className={styles.mainTitle}>
            My Journey
          </h3>
        </div>

        {/* Timeline Section */}
        <div className={`${styles.timelineWrapper} timeline-wrapper-progress-marker`}>
          <div className={styles.centerLine}>
            <div className={styles.progressLine} aria-hidden="true" />
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
                    style={{ transitionDelay: '0ms' }}
                    className={styles.dot}
                  >
                    <div className={styles.dotInner} aria-hidden="true" />
                  </div>

                  {/* Content Card */}
                  <div
                    data-animate={cardDirection}
                    style={{ transitionDelay: '150ms' }}
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
                data-animate="wave"
                style={{ transitionDelay: `${idx * 25}ms` }}
                className={styles.techBadge}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
