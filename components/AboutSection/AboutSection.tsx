import { AboutData } from "@/types/about";

type Props = {
  aboutData: AboutData;
};

export default function AboutSection({ aboutData }: Props) {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 py-20">

      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-slate-800 backdrop-blur-sm avoid-zone">
          <img className="absolute inset-0 w-full h-full object-cover" src={aboutData.srcPhoto} alt="About photo" />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left avoid-zone">
        <h2 className="text-sm uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-2">
          {aboutData.sectionTitle}
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
          {aboutData.mainTitle}
        </h3>
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
          {aboutData.description}
        </p>
        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
          {aboutData.highlights.map((highlight, index) => (
            <div key={index} className="px-5 py-2 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur text-sm text-slate-300">
              {highlight}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
