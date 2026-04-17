import { presentationCardData } from "@/lib/presentationCardData";
import { aboutData } from "@/lib/aboutData";
import { experienceData } from "@/lib/experienceData";
import { contactData } from "@/lib/contactData";
import { navBarData } from "@/lib/navbarData";

import StarsBackground from "@/components/StarsBackground";
import NavBarSection from "@/components/NavBarSection/NavBarSection";
import PresentationCard from "@/components/PresentationCardSection/PresentationCard";
import AboutSection from "@/components/AboutSection/AboutSection";
import ExperienceSection from "@/components/ExperienceSection/ExperienceSection";
import ContactSection from "@/components/ContactSection/ContactSection";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen w-full overflow-hidden scroll-smooth selection:bg-cyan-900 selection:text-white">
      <NavBarSection navBarData={navBarData} />
      <StarsBackground />
      
      <section id="home" className="min-h-screen w-full relative z-10 flex flex-col items-center justify-center">
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
    </main>
  );
}
