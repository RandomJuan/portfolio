import { presentationCardData } from "@/lib/presentationData";
import { aboutData } from "@/lib/aboutData";
import { experienceData } from "@/lib/experienceData";
import { contactData } from "@/lib/contactData";
import { navBarData } from "@/lib/navbarData";

import Fireflies from "@/components/Fireflies/Fireflies";
import NavBarSection from "@/components/NavBarSection/NavBarSection";
import PresentationCard from "@/components/PresentationSection/PresentationSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import ExperienceSection from "@/components/ExperienceSection/ExperienceSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";

export default function Home() {
  return (
    <ThemeProvider>
      <main>
        <NavBarSection navBarData={navBarData} />

        {/* Theme Switcher — fixed top-right, above everything */}
        <ThemeSwitcher />

        <section id="home" className="relative z-10 w-full min-h-screen">
          <PresentationCard presentationCard={presentationCardData} />
        </section>

        <section id="about" className="min-h-screen w-full relative z-10 flex flex-col items-center justify-center px-6 md:px-12 lg:px-24">
          <AboutSection aboutData={aboutData} />
        </section>

        <section id="experience" className="min-h-screen w-full relative z-10 flex flex-col items-center justify-center px-6 md:px-12 lg:px-24">
          <ExperienceSection experienceData={experienceData} />
        </section>
        <section id="contact" className="min-h-screen w-full relative z-10 flex flex-col justify-end">
          <ContactSection contactData={contactData} />
        </section>

        {/* Global SPA mode triggers organically when explicitly defining 'isGlobal' natively */}
        <Fireflies isGlobal />
      </main>
    </ThemeProvider>
  );
}
