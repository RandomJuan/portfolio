import { ContactData } from "@/types/contact";

type Props = {
  contactData: ContactData;
};

export default function ContactSection({ contactData }: Props) {
  return (
    <div className="w-full flex justify-center items-end pb-8 relative overflow-hidden h-[90vh]">
      
      {/* Decorative center glowing blob */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl px-6 flex flex-col items-center gap-8 relative z-10 avoid-zone">
        
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {contactData.title}
          </h2>
          <p className="text-slate-400 text-lg">
            {contactData.description}
          </p>
        </div>

        <a 
          href={`mailto:${contactData.buttonEmail}`}
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
        >
          {contactData.buttonText}
        </a>

        {/* Footer Content */}
        <footer className="w-full pt-16 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-800/50 mt-12">
          <p className="text-slate-500 text-sm">
            {contactData.copyright}
          </p>

          <div className="flex gap-6">
            {contactData.socials.map((social, index) => (
             <a key={index} href={social.url} className="text-slate-400 hover:text-cyan-400 transition-colors">
               {social.name}
             </a>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}
