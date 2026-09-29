export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative mt-16 overflow-hidden border-y border-brand-800 bg-brand-700 py-5 text-white md:mt-20" aria-hidden>
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-xl tracking-wide md:text-2xl">
            {i % 3 === 1 ? <span className="font-script text-[1.4em] text-gold-400">{t}</span> : t}
            <svg viewBox="0 0 12 12" className="size-3 text-gold-500">
              <path d="M6 0l6 6-6 6-6-6z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
