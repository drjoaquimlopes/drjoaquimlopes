/**
 * Geração do schema.org JSON-LD a partir da fonte única de dados.
 * Mantém os mesmos @id do site antigo e adiciona o nó da unidade Itaim.
 */
import { site } from "./site";
import { locations, type Location } from "./locations";

const ORTHO_IMG = `${site.url}/assets/images/dr/home-1.jpg`;
const LOGO_IMG = `${site.url}/assets/images/logo/logo.png`;

function clinicNode(loc: Location) {
  const node: Record<string, unknown> = {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#${loc.schemaId}`,
    name: loc.name,
    url: site.url,
    image: LOGO_IMG,
    medicalSpecialty: "Orthopedic",
    telephone: site.phoneE164,
  };

  if (loc.street) {
    node.address = {
      "@type": "PostalAddress",
      streetAddress: loc.street,
      addressLocality: loc.city,
      addressRegion: loc.region,
      ...(loc.postalCode ? { postalCode: loc.postalCode } : {}),
      addressCountry: "BR",
      ...(loc.neighborhood ? { neighborhood: loc.neighborhood } : {}),
    };
  }

  if (loc.geo) {
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: loc.geo.latitude,
      longitude: loc.geo.longitude,
    };
  }

  if (loc.primary) {
    node.email = site.email;
    node.priceRange = "$$";
    node.openingHoursSpecification = [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ];
  } else {
    node.priceRange = "$$";
  }

  return node;
}

/** Grafo institucional (Physician + clínicas + website). Usado no layout raiz. */
export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Physician",
        "@id": `${site.url}/#medico`,
        name: site.name,
        url: site.url,
        image: ORTHO_IMG,
        description:
          "Ortopedista e Traumatologista especializado em Cirurgia do Joelho e Medicina Esportiva em São Paulo.",
        medicalSpecialty: ["Orthopedic", "SportsMedicine"],
        qualifications: site.qualifications,
        memberOf: [
          {
            "@type": "MedicalOrganization",
            name: "SBOT - Sociedade Brasileira de Ortopedia e Traumatologia",
          },
          {
            "@type": "MedicalOrganization",
            name: "SBCJ - Sociedade Brasileira de Cirurgia do Joelho",
          },
        ],
        worksFor: { "@id": `${site.url}/#clinica` },
        workLocation: locations.map((l) => ({ "@id": `${site.url}/#${l.schemaId}` })),
        telephone: site.phoneE164,
        email: site.email,
        sameAs: [site.social.instagram, site.social.facebook],
      },
      ...locations.map(clinicNode),
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Dr. Joaquim Lopes - Ortopedista em São Paulo",
        publisher: { "@id": `${site.url}/#medico` },
      },
    ],
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
