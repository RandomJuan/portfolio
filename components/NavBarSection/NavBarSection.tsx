import { NavBarData } from "@/types/navbar";

type Props = {
  navBarData: NavBarData;
};

export default function NavBarSection({ navBarData }: Props) {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-lg bg-slate-900/60 border border-slate-800 rounded-full shadow-[0_0_20px_rgba(30,58,138,0.3)]">
      <ul className="flex items-center px-6 py-3 gap-2 md:gap-8">
        {navBarData.items.map((item) => (
          <li key={item.label}>
            <a 
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
