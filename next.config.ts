import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Publicado como project site de GitHub Pages: alvarotaiagu.github.io/subcon-works-web/
// El basePath solo se activa en el build de CI (GITHUB_ACTIONS=true) para no romper `next dev`.
const repoName = "subcon-works-web";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? `/${repoName}` : "",
  assetPrefix: isGithubActions ? `/${repoName}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? `/${repoName}` : "",
    // Asistente virtual (ver src/lib/chatbot.ts). Se define siempre, vacía si no existe,
    // para que el compilador la sustituya y quite las ramas del asistente del build de Pages.
    NEXT_PUBLIC_CHATBOT_URL: process.env.NEXT_PUBLIC_CHATBOT_URL ?? "",
    // Lista de recursos por correo (ver src/lib/recursos.ts). Igual que el asistente:
    // vacía en Pages hasta que haya dominio propio, y la sección no se pinta.
    NEXT_PUBLIC_RECURSOS_ENDPOINT: process.env.NEXT_PUBLIC_RECURSOS_ENDPOINT ?? "",
  },
};

export default nextConfig;
