import { ExperienceData } from "@/types/experience";

type Props = {
  experienceData: ExperienceData;
};

export default function ExperienceSection({ experienceData }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-16 py-20 overflow-hidden">
      
      {/* Timeline Section */}
      <div className="w-full">
        <h2 className="text-sm uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-12 text-center">
          {experienceData.sectionTitle}
        </h2>
        
        <div className="relative border-l border-slate-700 ml-4 md:ml-1/2">
          {experienceData.experiences.map((exp, index) => (
            <div key={index} className="mb-12 last:mb-0 relative pl-8 md:pl-0 md:-ml-[17px] md:flex md:items-center">
              
              {/* Dot */}
              <div className="absolute left-[-5px] md:relative md:w-8 md:h-8 md:shrink-0 rounded-full bg-slate-950 border border-cyan-400 z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Content Panel */}
              <div className="md:w-1/2 md:px-8 mt-2 md:mt-0">
                 <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-colors avoid-zone">
                    <span className="text-cyan-400/80 text-sm font-mono">{exp.period}</span>
                    <h3 className="text-xl font-bold text-white mt-2 mb-3">{exp.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                 </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Core Stack Carousel */}
      <div className="w-full mt-8">
         <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-6 text-center">
          {experienceData.techStackTitle}
        </h2>
        
        <div className="relative flex overflow-hidden group avoid-zone p-2">
          {/* Fading Edges */}
          <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          {/* Marquee Wrapper */}
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap will-change-transform">
             {/* Repeat array to create seamless loop */}
             {[...experienceData.techStack, ...experienceData.techStack, ...experienceData.techStack].map((tech, idx) => (
                <div 
                  key={idx} 
                  className="mx-4 px-6 py-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-300 backdrop-blur shrink-0"
                >
                  {tech}
                </div>
             ))}
          </div>
        </div>
      </div>

    </div>
  );
}
