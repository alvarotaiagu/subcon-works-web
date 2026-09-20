import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Servicios } from "@/components/sections/Servicios";
import { Plantillas } from "@/components/sections/Plantillas";
import { Auditoria } from "@/components/sections/Auditoria";
import { Proceso } from "@/components/sections/Proceso";
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
      <Auditoria />
      <Cifras />
      <CtaFinal />
    </>
  );
}
