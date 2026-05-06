import { presentationCard } from "@/types/presentation"

type Props = {
  presentationCard: presentationCard
}

const PresentationCard = ({ presentationCard }: Props) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent">

      <div className="flex flex-col items-center text-center gap-4 max-w-xl px-6 relative z-10 avoid-zone">

        <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--nav-bg)] px-4 py-1 text-xs uppercase tracking-widest">
          {presentationCard.role}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          {presentationCard.name}
        </h1>

        <p className="text-base md:text-lg opacity-80">
          {presentationCard.description}
        </p>

      </div>
    </div>
  )
}

export default PresentationCard