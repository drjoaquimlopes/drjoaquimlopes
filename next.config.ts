import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    // URLs antigas (.html) apontam para as rotas limpas equivalentes.
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/sobre.html", destination: "/sobre", permanent: true },
      { source: "/especialidade.html", destination: "/especialidade", permanent: true },
      { source: "/pre-agendamento.html", destination: "/pre-agendamento", permanent: true },
      // Recupera sinais e links das páginas antigas ainda presentes no índice.
      { source: "/especialidade/exames", destination: "/especialidade", permanent: true },
      { source: "/especialidade/procedimentos", destination: "/especialidade", permanent: true },
      { source: "/especialidade/cirurgias", destination: "/especialidade", permanent: true },
    ];
  },
};

export default nextConfig;
