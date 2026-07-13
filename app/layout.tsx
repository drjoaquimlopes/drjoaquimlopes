import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
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
    default:
      "Dr. Joaquim Lopes | Ortopedista em São Paulo e Osasco - Cirurgia do Joelho",
    template: "%s | Dr. Joaquim Lopes",
  },
  description:
    "Dr. Joaquim Lopes, Ortopedista e Traumatologista especialista em Cirurgia do Joelho. Consultas na Vila Olímpia, Higienópolis, Jardim Paulista, Itaim Bibi e Osasco.",
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
    images: [{ url: "/assets/images/dr/home-1.jpg" }],
  },
  twitter: { card: "summary_large_image" },
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
        <JsonLd data={organizationGraph()} />
        <Nav />
        <main>{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
