import { WorkImage } from "@/components/ui/WorkImage";

export function BrowserMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg-raised">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-text-faint/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-text-faint/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-text-faint/40" />
      </div>
      <div className="relative aspect-[3/2]">
        <WorkImage src={src} alt={alt} fill sizes="(min-width: 768px) 480px, 90vw" className="object-cover" />
      </div>
    </div>
  );
}
