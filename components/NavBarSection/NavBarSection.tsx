'use client';

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { NavBarData } from "@/types/navbar";
import { useTheme } from "@/components/ThemeProvider/ThemeContext";
import { presentationCardData } from "@/lib/presentationData";
import { aboutData } from "@/lib/aboutData";
import { experienceData } from "@/lib/experienceData";
import { contactData } from "@/lib/contactData";

import PresentationCard from "@/components/PresentationSection/PresentationSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import ExperienceSection from "@/components/ExperienceSection/ExperienceSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import Fireflies from "@/components/Fireflies/Fireflies";
import MobileNavBar from "@/components/NavBarSection/MobileNavBar";
import { useScrollSync } from "@/hooks/useScrollSync";
import { useViewportMetrics } from "@/hooks/useViewportMetrics";
import styles from "./NavBarSection.module.css";

type Props = {
  navBarData: NavBarData;
  activeIndex: number;
  rotationAngle: number; // Real-time synchronized spool rotation angle
  onNavigate: (index: number) => void;
};

export default function NavBarSection({ navBarData, activeIndex, rotationAngle, onNavigate }: Props) {
  const { theme, setThemeById, themes } = useTheme();
  const { scaleFactor, aspectRatio, isMobile } = useViewportMetrics();
  const [mounted, setMounted] = useState<boolean>(false);

  const [orbOpen, setOrbOpen] = useState<boolean>(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  
  // Timeout references to manage the interactive global autohide features
  const themeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set mounted flag to safely render portals only on the client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close the popup panel if clicking outside both the orb structure, mobile navbar container, and the portal theme list
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const isInsideOrb = orbRef.current && orbRef.current.contains(e.target as Node);
      const isInsidePortal = portalRef.current && portalRef.current.contains(e.target as Node);
      const isInsideMobileNav = e.target instanceof Element && e.target.closest('.mobile-nav-container');

      if (!isInsideOrb && !isInsidePortal && !isInsideMobileNav) {
        setOrbOpen(false);
      }
    };
    document.addEventListener('mousedown', clickHandler);
    return () => document.removeEventListener('mousedown', clickHandler);
  }, []);

  // Synchronize a mutable ref to track the active theme ID dynamically without re-instantiating the keyboard listener
  const activeThemeIdRef = useRef(theme.id);
  useEffect(() => {
    activeThemeIdRef.current = theme.id;
  }, [theme.id]);

  // Keyboard theme switcher: Press "a" or "d" globally to cycle themes, show feedback capsule, and autohide after 600ms of inactivity
  useEffect(() => {
    const handleThemeKeys = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
         activeEl.tagName === "TEXTAREA" ||
         activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "a" || key === "d") {
        const currentIndex = themes.findIndex(t => t.id === activeThemeIdRef.current);
        if (currentIndex === -1) return;

        e.preventDefault();
        let nextIndex = currentIndex;
        if (key === "a") {
          nextIndex = (currentIndex - 1 + themes.length) % themes.length;
        } else if (key === "d") {
          nextIndex = (currentIndex + 1) % themes.length;
        }

        // Show the horizontal capsule feedback line instantly on key cycling
        setOrbOpen(true);

        // Reset the autohide timer on every key cycle to keep themes visible while actively scrolling
        if (themeTimeoutRef.current) {
          clearTimeout(themeTimeoutRef.current);
        }

        setThemeById(themes[nextIndex].id);

        // Auto-hide the theme selection capsule after 600ms of typing inactivity
        themeTimeoutRef.current = setTimeout(() => {
          setOrbOpen(false);
        }, 600);
      }
    };

    window.addEventListener("keydown", handleThemeKeys);
    return () => {
      window.removeEventListener("keydown", handleThemeKeys);
      if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
    };
  }, [themes, setThemeById]);

  // Modular hook to handle hardware-accelerated real-time scroll synchronization
  useScrollSync(["home", "about", "experience", "contact"]);

  // Render a live scaled-down panoramic replica of the ACTUAL page component itself!
  const renderCardPreview = (index: number) => {
    return (
      <div 
        className={`${styles.previewViewportContainer} preview-viewport-container`}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scaleFactor})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
      >
        {/* Dynamic theme-specific firefly ecosystem drifting inside the acetate film strip in real-time */}
        <Fireflies isGlobal={false} />
        
        {/* Render the actual live page component dynamically centered & fit inside the card frame */}
        <div className={`${styles.previewContentWrap} ${index === 2 ? styles.previewContentWrapExperience : styles.previewContentWrapCenter}`}>
          <div 
            data-preview-index={index}
            className={`preview-scroll-container ${styles.previewScrollContainer} ${index === 2 ? styles.previewScrollContainerExperience : styles.previewScrollContainerCenter}`}
          >
            {index === 0 && <PresentationCard presentationCard={presentationCardData} />}
            {index === 1 && <AboutSection aboutData={aboutData} />}
            {index === 2 && <ExperienceSection experienceData={experienceData} />}
            {index === 3 && <ContactSection contactData={contactData} />}
          </div>
        </div>
      </div>
    );
  };

  // Preset cinematic coordinates for each section index to ensure zero lag and silky smooth hardware-accelerated CSS transitions.
  // Elevating overall vertical offsets to leave extremely spacious safety clearance margins at the bottom of the screen.
  const sectionSways = [
    { translateY: 0, rotateZ: 0, rotateX: 0 }, // Index 0: Home (centered)
    { translateY: 0, rotateZ: 0, rotateX: 0 }, // Index 1: About
    { translateY: 0, rotateZ: 0, rotateX: 0 }, // Index 2: Experience
    { translateY: 0, rotateZ: 0, rotateX: 0 }, // Index 3: Contact
  ];

  const currentSway = sectionSways[activeIndex] || sectionSways[0];

  // Dynamic aspect ratio scaling formulas to morph cards into mobile screens when viewed on phone viewports!
  const cardW = isMobile ? 66 : 100;
  const cardH = isMobile ? Math.round(66 * aspectRatio) : Math.round(100 * aspectRatio);
  const innerW = cardW - 12;
  const innerH = isMobile ? Math.round(54 * aspectRatio) : (cardH - 8);
  const translateZ = isMobile ? 70 : 70;

  return (
    <>
      <nav className={styles.navContainer}>
      <style>{`
        .reel-viewport {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1000px;
          transform-style: preserve-3d;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .reel-container {
          position: relative;
          width: var(--card-w);
          height: var(--card-h);
          transform-style: preserve-3d;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reel-card {
          position: absolute;
          width: var(--card-w);
          height: var(--card-h);
          left: 0;
          top: 0;
          transform-style: preserve-3d;
          backface-visibility: visible;
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      filter 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s,
                      box-shadow 0.3s;
          border-radius: 6px;
          background: rgba(15, 23, 42, 0.15);
          backdrop-filter: blur(10px) saturate(1.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 
                      0 0 1px 1px rgba(255, 255, 255, 0.01) inset;
        }
        
        /* Vibrant active state highlight glow and borders */
        .reel-card.active-glow {
          border-color: var(--accent-hex-40);
          box-shadow: 0 10px 25px var(--accent-hex-20),
                      0 0 1px 1px var(--accent-hex-15) inset;
        }
        .reel-card.active-glow .slide-marker-num,
        .reel-card.active-glow .slide-marker-name {
          color: var(--accent-hex);
          opacity: 0.9;
          text-shadow: 0 0 4px var(--accent-hex-30);
        }

        /* Highly interactive hover styles to make cards look extremely vivid & highlighted */
        .reel-card:hover {
          opacity: 0.95 !important;
          border-color: var(--accent-hex-35);
          box-shadow: 0 10px 24px var(--accent-hex-15);
          filter: none !important;
        }

        /* Softer sprocket decoration */
        .slide-sprockets-left, .slide-sprockets-right {
          position: absolute;
          top: 6px;
          bottom: 6px;
          width: 4px;
          background-image: repeating-linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(255, 255, 255, 0.03) 3px,
            rgba(0, 0, 0, 0.2) 3px,
            rgba(0, 0, 0, 0.2) 7px
          );
          opacity: 0.6;
        }
        .slide-sprockets-left { left: 3px; }
        .slide-sprockets-right { right: 3px; }
        
        .slide-inner-frame {
          position: absolute;
          left: 6px;
          right: 6px;
          top: 4px;
          bottom: 4px;
          border-radius: 3px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slide-marker-num {
          position: absolute;
          top: 0.5px;
          left: 8px;
          font-size: 3.2px;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.25);
          transition: color 0.4s, opacity 0.4s;
        }
        .slide-marker-name {
          position: absolute;
          bottom: 0.5px;
          right: 8px;
          font-size: 3px;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.25);
          transition: color 0.4s, opacity 0.4s;
        }
        
        /* Force scrollspy animatables inside preview slides to render completely visible instantly 
           (Removed to allow animations to play in navbar preview) */

        /* Celestial Astral Orb Animation and Styles */
        @keyframes floatOrb {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -3px, 0) scale(1.08); }
        }
        .astral-orb {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          animation: floatOrb 3.5s ease-in-out infinite;
          cursor: pointer;
          transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
          pointer-events: auto;
          
          /* Always visible clean rim border, not glaring but distinct */
          border: 1.5px solid rgba(255, 255, 255, 0.25);
        }
        .astral-orb:hover {
          box-shadow: 0 0 24px var(--accent-hex-60),
                      0 0 8px var(--accent-hex-35);
          border-color: rgba(255, 255, 255, 0.6);
        }
        .astral-orb:active {
          transform: scale(0.92);
        }
        @media (max-width: 767px) {
          .astral-orb {
            width: 26px;
            height: 26px;
          }
        }

        /* 
          Vibrant aesthetic CSS overrides targeting ONLY scaled viewport preview contents (.slide-inner-frame)
          This collapses massive section padding ("the purple highlight") and makes layouts extremely compact.
        */
        .slide-inner-frame .preview-viewport-container {
          display: block !important;
          width: 100vw !important;
          height: 100vh !important;
        }

        /* Stripping padding from the root containers of all pages and sections inside the card spool previews */
        .slide-inner-frame .preview-viewport-container [id="about"],
        .slide-inner-frame .preview-viewport-container [id="experience"],
        .slide-inner-frame .preview-viewport-container [id="contact"] {
          min-height: 0 !important;
          height: auto !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }

        .slide-inner-frame .preview-viewport-container .py-20,
        .slide-inner-frame .preview-viewport-container .py-24,
        .slide-inner-frame .preview-viewport-container .pt-24,
        .slide-inner-frame .preview-viewport-container .pb-44,
        .slide-inner-frame .preview-viewport-container .pb-36,
        .slide-inner-frame .preview-viewport-container .pt-6 {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }

        /* Subtly contract margins, gaps and sizes so all section cards are fully readable and fit perfectly */
        .slide-inner-frame .preview-viewport-container .gap-12 { gap: 8px !important; }
        .slide-inner-frame .preview-viewport-container .gap-16 { gap: 10px !important; }
        .slide-inner-frame .preview-viewport-container .gap-24 { gap: 12px !important; }
        .slide-inner-frame .preview-viewport-container .mt-4 { margin-top: 4px !important; }
        .slide-inner-frame .preview-viewport-container .mt-8 { margin-top: 4px !important; }
        .slide-inner-frame .preview-viewport-container .mt-16 { margin-top: 6px !important; }
        .slide-inner-frame .preview-viewport-container .mb-8 { margin-bottom: 4px !important; }
        .slide-inner-frame .preview-viewport-container .p-8 { padding: 8px !important; }

        .slide-inner-frame .preview-viewport-container .avoid-zone {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }

        /* Ensure images inside previews are scaled properly without clipping */
        .slide-inner-frame .preview-viewport-container img {
          max-height: 100% !important;
          object-fit: contain !important;
        }

        /* Hardware-accelerated dynamic scrolling preview container */
        .preview-scroll-container {
          will-change: transform;
        }
      `}</style>

      {/* Symmetrical Navigation Group */}
      <div className={styles.navigationGroup}>
        {/* Subtle Left Arrow Indicator */}
        <button 
          onClick={() => {
            const nextIdx = (activeIndex - 1 + navBarData.items.length) % navBarData.items.length;
            onNavigate(nextIdx);
          }}
          className={styles.arrowIndicator}
          aria-label="Previous Section"
          style={{
            color: theme.accentHex,
            boxShadow: `0 0 8px rgba(0, 0, 0, 0.3)`
          }}
        >
          <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div 
          className="reel-viewport flex-1 h-full flex items-center justify-center"
          style={{
            '--accent-hex': theme.accentHex,
            '--accent-hex-04': `${theme.accentHex}0a`,
            '--accent-hex-10': `${theme.accentHex}1a`,
            '--accent-hex-15': `${theme.accentHex}26`,
            '--accent-hex-20': `${theme.accentHex}33`,
            '--accent-hex-35': `${theme.accentHex}59`,
            '--accent-hex-40': `${theme.accentHex}66`,
            // 100% responsive custom properties dynamically calculated matching screen sizes and aspect ratios!
            '--card-w': `${cardW}px`,
            '--card-h': `${cardH}px`,
            '--inner-w': `${innerW}px`,
            '--inner-h': `${innerH}px`,
            '--translate-z': `${translateZ}px`,
            '--title-scale': isMobile ? '0.85' : '0.9',
            '--title-top': isMobile ? '-18px' : '-20px',
          } as React.CSSProperties}
        >
          {/* 3D Rotating Film Spool Reel with dynamic, real-time mechanical torque and sways */}
          <div 
            className="reel-container"
            style={{
              transform: `rotateX(${currentSway.rotateX}deg) rotateY(${rotationAngle}deg) rotateZ(${currentSway.rotateZ}deg)`
            }}
          >
            {navBarData.items.map((item, i) => {
              const isActive = activeIndex === i;
              
              // Cards are arranged in a 3D circle. Uses responsive --translate-z variables.
              const cardRotationAngle = i * 90;

              return (
                <div
                  key={item.label}
                  onClick={() => onNavigate(i)}
                  style={{
                    transform: `rotateY(${cardRotationAngle}deg) translateZ(var(--translate-z))`,
                  }}
                  className={`reel-card pointer-events-auto cursor-pointer flex flex-col justify-between 
                    ${isActive 
                      ? 'opacity-100 filter-none scale-[1.08] z-30 active-glow' 
                      : 'opacity-45 hover:opacity-65 filter blur-[0.3px] brightness-[0.8] grayscale-[20%] z-10'
                    }
                  `}
                >
                  {/* Dynamic, 3D integrated section title floating directly above each card slide */}
                  <div 
                    className={styles.cardTitleContainer}
                    style={{
                      top: 'var(--title-top)',
                      transform: 'translate3d(-50%, 0, 0) scale(var(--title-scale))',
                      display: isActive ? 'flex' : 'none'
                    }}
                  >
                    <span 
                      className={styles.cardTitleText}
                      style={{ 
                        color: theme.accentHex,
                        opacity: 0.95,
                        textShadow: `0 0 6px ${theme.accentHex}40`
                      }}
                    >
                      {item.label}
                    </span>
                    <div 
                      className={styles.cardTitleUnderline}
                      style={{ 
                        backgroundColor: theme.accentHex,
                        boxShadow: `0 0 4px ${theme.accentHex}` 
                      }}
                    />
                  </div>
                  <div className="slide-marker-num">F.0{i + 1}</div>
                  <div className="slide-sprockets-left" />
                  <div className="slide-sprockets-right" />

                  {/* Live replica of the menu section (100% exact, undistorted aspect ratio fit on any screen) */}
                  <div className="slide-inner-frame">
                    {renderCardPreview(i)}
                  </div>

                  <div className="slide-marker-name">{item.label.toUpperCase()}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle Right Arrow Indicator */}
        <button 
          onClick={() => {
            const nextIdx = (activeIndex + 1) % navBarData.items.length;
            onNavigate(nextIdx);
          }}
          className={styles.arrowIndicator}
          aria-label="Next Section"
          style={{
            color: theme.accentHex,
            boxShadow: `0 0 8px rgba(0, 0, 0, 0.3)`
          }}
        >
          <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Symmetrical Theme controls absolute-positioned on the right side of the container */}
      <div className={styles.themeControls}>
        {/* Visual Glowing Divider to separate navigation links from the settings orb */}
        <div 
          className={styles.glowingDivider}
          style={{
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.01) 100%)`,
            boxShadow: `0 0 8px rgba(255,255,255,0.05)`
          }}
        />

        {/* Astral Orb Theme Switcher: Positioned naturally at the right of the desktop capsule navbar */}
        <div 
          ref={orbRef} 
          className={styles.orbContainer}
        >
          {/* Glowing Astral Orb Button: styled dynamically to show the currently selected theme directly inside it */}
          <button 
            onClick={() => setOrbOpen(!orbOpen)}
            className="astral-orb"
            aria-label="Toggle Cosmic Theme"
            title="Toggle Cosmic Theme"
            style={{
              background: theme.bgGradient,
              boxShadow: `0 0 16px ${theme.accentHex}44`
            }}
          >
            {/* Subtle dark inner rim for perfect readability against light background gradients */}
            <div className={styles.orbInnerRim} />

            {/* Subtle light inner specular rim for volumetric depth */}
            <div className={styles.orbSpecularRim} />

            {/* Active selection inner highlight border */}
            <div className={styles.orbHighlightRim} />

            {/* Subtle firefly dots inside the selector orb */}
            <div className={styles.orbFireflies}>
              <div
                className={styles.fireflyPrimary}
                style={{ backgroundColor: `rgb(${theme.firefly.primary})`, boxShadow: `0 0 4px rgb(${theme.firefly.primary})` }}
              />
              <div
                className={styles.fireflySecondary}
                style={{ backgroundColor: `rgb(${theme.firefly.secondary})`, boxShadow: `0 0 4px rgb(${theme.firefly.secondary})` }}
              />
            </div>
          </button>

          {/* 
            Celestial Glassmorphic Theme Row Portal:
            Rendered via React Portal directly into document.body to break out of the transformed 3D parent container.
          */}
          {mounted && createPortal(
            <div
              ref={portalRef}
              aria-hidden={!orbOpen}
              className={`
                ${styles.portalContainer}
                ${orbOpen ? styles.portalOpen : styles.portalClosed}
                ${theme.mode === 'dark' ? styles.portalDark : styles.portalLight}
              `}
              style={{ 
                boxShadow: `0 10px 30px ${theme.accentHex}20, 0 10px 40px rgba(0,0,0,0.5)`,
                borderColor: `${theme.accentHex}40`,
                bottom: isMobile ? '80px' : 'auto',
                top: isMobile ? 'auto' : '110px',
                right: isMobile ? 'auto' : '24px',
                left: isMobile ? '50%' : 'auto',
                transform: isMobile ? 'translateX(-50%)' : 'none'
              }}
            >
              {themes.map((t) => {
                const isSelected = theme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeById(t.id);
                      setOrbOpen(false);
                    }}
                    title={t.id}
                    className={`
                      ${styles.themeOption}
                      ${isSelected ? styles.themeOptionSelected : styles.themeOptionHover}
                    `}
                    style={{
                      background: t.bgGradient,
                      border: isSelected ? `1.5px solid ${t.accentHex}` : '1.5px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: isSelected ? `0 0 12px ${t.accentHex}aa` : 'none'
                    }}
                  >
                    {/* Subtle dark inner rim for perfect readability against light background gradients */}
                    <div className={styles.orbInnerRim} />

                    {/* Subtle light inner specular rim for volumetric depth */}
                    <div className={styles.orbSpecularRim} />

                    {/* Active selection inner highlight border */}
                    {isSelected && (
                      <div className={styles.orbHighlightRim} />
                    )}

                    {/* Subtle firefly dots inside each theme circle */}
                    <div className={styles.orbFireflies}>
                      <div
                        className={styles.fireflyPrimary}
                        style={{ backgroundColor: `rgb(${t.firefly.primary})`, boxShadow: `0 0 4px rgb(${t.firefly.primary})` }}
                      />
                      <div
                        className={styles.fireflySecondary}
                        style={{ backgroundColor: `rgb(${t.firefly.secondary})`, boxShadow: `0 0 4px rgb(${t.firefly.secondary})` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>,
            document.body
          )}
        </div>
      </div>
    </nav>
    <MobileNavBar 
      navBarData={navBarData}
      activeIndex={activeIndex}
      onNavigate={onNavigate}
      orbOpen={orbOpen}
      setOrbOpen={setOrbOpen}
    />
    </>
  );
}
