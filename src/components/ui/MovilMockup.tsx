import { WorkImage } from "@/components/ui/WorkImage";

/**
 * Marco de móvil para capturas verticales (390 × 844 a 2×). Como
 * BrowserMockup, pasa por WorkImage para que la imagen lleve el basePath.
 */
export function MovilMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-[2.25rem] border border-conducto bg-estrato p-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="relative aspect-[390/844] overflow-hidden rounded-[1.75rem]">
        <WorkImage
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 280px, 60vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
