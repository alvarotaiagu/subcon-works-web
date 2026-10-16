import { Boton } from "@/components/ui/Boton";
import { plantillas } from "@/content/plantillas";
import { site } from "@/content/site";

/**
 * El correo para pedir la plantilla de un sector que no se ve (D-026). Abre el programa
 * de correo con el asunto y un hueco para el sector ya escritos: la web no guarda nada,
 * así que no hay formulario ni datos personales de por medio.
 */
export const correoSector = `mailto:${site.email}?subject=${encodeURIComponent(
  "Plantilla para mi sector",
)}&body=${encodeURIComponent("Hola. Mi negocio es de este sector:\n\nY está en:\n")}`;

/**
 * «¿Tu sector no está?» (D-026), bajo las destacadas de la portada. Capacidad, no
 * promesa de algo hecho: si hay una en el catálogo que se acerca, se enseña; si no, se
 * prepara una para su sector.
 */
export function PideTuSector({ vistas }: { vistas: number }) {
  return (
    <div className="pide-sector">
      <h3 className="pide-sector-titulo">¿Tu sector no está?</h3>
      <p className="pide-sector-texto">
        Aquí hay {vistas} de las {plantillas.length} que tenemos publicadas. Escríbenos con tu sector y te
        enseñamos la que más se acerca a lo tuyo, o te preparamos una para él.
      </p>
      <Boton href={correoSector} variante="secundario" className="pide-sector-boton">
        Pedir la de mi sector
      </Boton>
    </div>
  );
}
