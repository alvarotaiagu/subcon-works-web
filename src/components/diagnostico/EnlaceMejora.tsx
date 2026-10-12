import Link from "next/link";
import { cn } from "@/lib/utils";
import { Glifo } from "@/components/ui/Glifo";

/**
 * «Más sobre esto →» de una mejora, en el resultado del diagnóstico y en «Lo
 * que haríamos» de una página de sector. Las rutas (`/…`) van por `Link`, que
 * pone el basePath; las anclas de la misma página (`#asistente`,
 * `#plantillas-sector`) son un `<a>` normal, como el «#plantillas» del Hero.
 */
export function EnlaceMejora({ href, className }: { href: string; className?: string }) {
  const clases = cn("link-underline text-sm text-hueso", className);
  const texto = (
    <>
      Más sobre esto <Glifo nombre="derecha" />
    </>
  );
  if (href.startsWith("#")) {
    return (
      <a href={href} className={clases} data-cursor-hover>
        {texto}
      </a>
    );
  }
  return (
    <Link href={href} className={clases} data-cursor-hover>
      {texto}
    </Link>
  );
}
