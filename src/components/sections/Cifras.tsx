import { cifras } from "@/content/cifras";
import { CifraGauge } from "@/components/ui/CifraGauge";

export function Cifras() {
  return (
    <section className="container-max py-[var(--space-section)]">
      <div className="grid gap-10 border-t border-line pt-16 sm:grid-cols-2 lg:grid-cols-4">
        {cifras.map((cifra) => (
          <div key={cifra.etiqueta} className="flex flex-col items-start gap-5">
            <CifraGauge valor={cifra.valor} sufijo={cifra.sufijo} />
            <p className="text-sm text-text-muted">{cifra.etiqueta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
