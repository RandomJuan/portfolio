import { ExperienceData } from "@/types/experience";

type Props = {
  experienceData: ExperienceData;
};

export default function ExperienceSection({ experienceData }: Props) {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-16 py-24 avoid-zone">
      
      {/* Title Header */}
      <div className="w-full flex flex-col items-center text-center">
        <h2 className="text-sm uppercase tracking-[0.4em] text-cyan-400 font-semibold mb-3">
          {experienceData.sectionTitle}
        </h2>
        <div className="w-16 h-[1px] bg-cyan-900/50 mb-4" />
        <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          My Journey
        </h3>
      </div>
      
      {/* Timeline Section */}
      <div className="w-full relative mt-8">
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-cyan-900 via-cyan-800/30 to-transparent -translate-x-1/2 rounded" />
        
        <div className="flex flex-col gap-12 md:gap-24">
          {experienceData.experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Center Dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#020617] border-2 border-cyan-400 z-10 shadow-[0_0_15px_rgba(34,211,238,0.5)] items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'}`}>
                   <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-3xl hover:border-cyan-900/50 hover:bg-slate-900/60 transition-all duration-300 group shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 rounded-full border border-cyan-900/50 bg-cyan-950/30 text-cyan-400 text-xs font-mono tracking-wider">
                          {exp.period}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors">{exp.title}</h3>
                      <p className="text-slate-400 text-base leading-relaxed">{exp.description}</p>
                   </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modern Stack Row */}
      <div className="w-full mt-16 flex flex-col items-center">
         <p className="text-xs uppercase tracking-widest text-slate-600 font-mono mb-8">
          {experienceData.techStackTitle}
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto px-4">
           {experienceData.techStack.map((tech, idx) => (
              <div 
                key={idx} 
                className="px-6 py-2.5 rounded-xl bg-slate-900/30 border border-slate-800 text-slate-300 backdrop-blur-sm text-sm font-medium hover:border-cyan-800/50 hover:text-cyan-400 transition-all shadow-sm flex items-center justify-center cursor-default"
              >
                {tech}
              </div>
           ))}
        </div>
      </div>

    </div>
  );
}
