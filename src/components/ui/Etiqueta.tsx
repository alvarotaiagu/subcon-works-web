import { cn } from "@/lib/utils";

export function Etiqueta({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono-label inline-flex items-center rounded-full border border-line px-3 py-1 text-[10px]",
        className
      )}
    >
      {children}
    </span>
  );
}
