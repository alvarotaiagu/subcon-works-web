import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Servicios } from "@/components/sections/Servicios";
import { Trabajos } from "@/components/sections/Trabajos";
import { Plantillas } from "@/components/sections/Plantillas";
import { Proceso } from "@/components/sections/Proceso";
import { Cifras } from "@/components/sections/Cifras";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Servicios />
      <Trabajos />
      <Plantillas />
      <Proceso />
      <Cifras />
      <CtaFinal />
    </>
  );
}
