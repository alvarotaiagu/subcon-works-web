import { cifras } from "@/content/cifras";
import { Contador } from "@/components/ui/Contador";

export function Cifras() {
  return (
    <section className="container-max py-[var(--space-section)]">
      <div className="grid gap-10 border-t border-line pt-16 sm:grid-cols-2 lg:grid-cols-4">
        {cifras.map((cifra) => (
          <div key={cifra.etiqueta}>
            <p className="text-5xl font-medium text-text-primary md:text-6xl">
              <Contador valor={cifra.valor} sufijo={cifra.sufijo} />
            </p>
            <p className="mt-3 text-sm text-text-muted">{cifra.etiqueta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
