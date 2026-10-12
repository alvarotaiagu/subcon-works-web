import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Servicios } from "@/components/sections/Servicios";
import { Plantillas } from "@/components/sections/Plantillas";
import { DiagnosticoRapido } from "@/components/sections/DiagnosticoRapido";
import { Auditoria } from "@/components/sections/Auditoria";
import { Proceso } from "@/components/sections/Proceso";
import { Equipo } from "@/components/sections/Equipo";
import { Compromisos } from "@/components/sections/Compromisos";
import { Cifras } from "@/components/sections/Cifras";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Servicios />
      <Plantillas />
      <Proceso />
      <Equipo />
      <Compromisos className="container-max pb-[var(--space-section)]" />
      <DiagnosticoRapido />
      <Auditoria />
      <Cifras />
      <CtaFinal />
    </>
  );
}
