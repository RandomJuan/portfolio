'use client';

import { usePortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import { presentationCardData } from "@/lib/presentationData";
import { aboutData } from "@/lib/aboutData";
import { experienceData } from "@/lib/experienceData";
import { contactData } from "@/lib/contactData";
import { navBarData } from "@/lib/navbarData";

import Fireflies from "@/components/Fireflies/Fireflies";
import Navigation from "@/components/Navigation/Navigation";
import PresentationCard from "@/components/PresentationSection/PresentationSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import ExperienceSection from "@/components/ExperienceSection/ExperienceSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeContext";
import styles from "./page.module.css";

function PortfolioCarousel() {
  const sectionsList = ["home", "about", "experience", "contact"];
  
  // Call modular custom navigation hook following Single Responsibility Principle (SOLID)
  const { activeIndex, navigateTo } = usePortfolioNavigation(sectionsList);

  return (
    <main className={styles.mainContainer}>
      {/* Normal Continuous Scrolling Content */}
      <div className={styles.contentWrapper}>
        <section id="home" className={styles.sectionHome}>
          <PresentationCard presentationCard={presentationCardData} />
        </section>

        <section id="about" className={styles.sectionAbout}>
          <AboutSection aboutData={aboutData} />
        </section>

        <section id="experience" className={styles.sectionExperience}>
          <ExperienceSection experienceData={experienceData} />
        </section>

        <section id="contact" className={styles.sectionContact}>
          <ContactSection contactData={contactData} />
        </section>
      </div>

      {/* Simple standard Navigation */}
      <Navigation 
        navBarData={navBarData} 
        activeIndex={activeIndex}
        onNavigate={navigateTo}
      />

      {/* Global ecosystem elements */}
      <Fireflies isGlobal />
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <PortfolioCarousel />
    </ThemeProvider>
  );
}
