import Image from "next/image";
import type { Shot } from "@/lib/projects";

/**
 * A product capture filling its positioned parent. Until the file exists the
 * frame shows a labelled placeholder, so pages build and review end to end.
 */
export function Capture({ shot, sizes, priority = false }: { shot: Shot; sizes: string; priority?: boolean }) {
  if (shot.src) {
    return <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />;
  }

  return (
    <div role="img" aria-label={shot.alt} className="absolute inset-0 flex flex-col gap-3 bg-bg-card p-4 md:p-6">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
        Capture pending · {shot.alt}
      </span>
      <div aria-hidden="true" className="grid flex-1 grid-cols-6 grid-rows-4 gap-2">
        <div className="col-span-2 row-span-4 bg-ink-rule" />
        <div className="col-span-4 bg-ink-rule" />
        <div className="col-span-2 row-span-3 bg-ink-rule" />
        <div className="col-span-2 row-span-3 bg-accent opacity-25" />
      </div>
    </div>
  );
}
