import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import { FloatingActions } from "@/components/FloatingActions";
import { JsonLd } from "@/components/JsonLd";
import { organizationGraph } from "@/lib/jsonld";
import { site } from "@/lib/site";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "300 800",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ortopedista em São Paulo | Dr. Joaquim Lopes",
    template: "%s | Dr. Joaquim Lopes",
  },
  description:
    "Ortopedista em São Paulo especialista em joelho e medicina esportiva. Consultas com o Dr. Joaquim Lopes na Vila Olímpia, Higienópolis e Jardins.",
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  icons: { icon: "/assets/images/logo/flaticon.png" },
  openGraph: {
    type: "website",
    siteName: "Dr. Joaquim Lopes - Ortopedista",
    locale: site.locale,
    url: site.url,
    title: "Ortopedista em São Paulo | Dr. Joaquim Lopes",
    description:
      "Ortopedista especialista em joelho e medicina esportiva, com atendimento na Vila Olímpia, Higienópolis e Jardins, em São Paulo.",
    images: [
      {
        url: "/assets/images/dr/1.jpg",
        width: 1200,
        height: 800,
        alt: "Dr. Joaquim Lopes, ortopedista especialista em joelho",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ortopedista em São Paulo | Dr. Joaquim Lopes",
    description:
      "Ortopedista especialista em joelho e medicina esportiva, com atendimento em São Paulo.",
  },
  other: {
    "geo.region": "BR-SP",
    "geo.placename": "São Paulo",
    "geo.position": "-23.5928;-46.6847",
    ICBM: "-23.5928, -46.6847",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <a
          href="#conteudo-principal"
          className="fixed left-4 top-4 z-[2000] -translate-y-24 rounded-md bg-dark px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <JsonLd data={organizationGraph()} />
        <header>
          <Nav />
        </header>
        <main id="conteudo-principal">{children}</main>
        <Footer />
        <FloatingActions />
        <RevealObserver />
      </body>
    </html>
  );
}
