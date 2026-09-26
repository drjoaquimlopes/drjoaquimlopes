/**
 * Locais de atendimento do Dr. Joaquim Lopes.
 * Fonte única para a seção "Locais", o footer, o pré-agendamento e o JSON-LD.
 */

export type Location = {
  /** id usado no @id do schema (https://.../#<schemaId>) */
  schemaId: string;
  name: string;
  payment: "private" | "insurance";
  coverageUrl?: string;
  /** endereço em uma linha para exibição (pode ser omitido) */
  addressLines?: string[];
  neighborhood?: string;
  city: string;
  region: string;
  postalCode?: string;
  street?: string;
  geo?: { latitude: number; longitude: number };
  /** unidade principal (matriz) */
  primary?: boolean;
};

export const locations: Location[] = [
  {
    schemaId: "clinica",
    name: "Clínica Derplus",
    payment: "private",
    street: "R. Arminda, 93 - Conj 102",
    neighborhood: "Vila Nova Conceição",
    city: "São Paulo",
    region: "SP",
    postalCode: "04545-100",
    addressLines: [
      "R. Arminda, 93 - Conj 102, Vila Nova Conceição",
      "São Paulo - SP, CEP 04545-100",
    ],
    primary: true,
  },
  {
    schemaId: "instituto-vita",
    name: "Instituto Vita - Ortopedia e Fisioterapia",
    payment: "insurance",
    coverageUrl: "https://vita.org.br/convenios",
    street: "Rua Mato Grosso, 306",
    neighborhood: "Higienópolis",
    city: "São Paulo",
    region: "SP",
    postalCode: "01239-040",
    addressLines: [
      "Rua Mato Grosso, 306, Higienópolis",
      "São Paulo - SP, CEP 01239-040",
    ],
  },
  {
    schemaId: "hospital-9-de-julho",
    name: "Hospital 9 de Julho - Ambulatório",
    payment: "insurance",
    coverageUrl: "https://www.h9j.com.br/convenios/",
    street: "Rua Peixoto Gomide, 545",
    neighborhood: "Jardim Paulista",
    city: "São Paulo",
    region: "SP",
    postalCode: "01409-001",
    addressLines: [
      "Rua Peixoto Gomide, 545, Jardim Paulista",
      "São Paulo - SP, CEP 01409-001",
    ],
  },
  {
    schemaId: "hospital-sao-luiz-itaim",
    name: "Hospital São Luiz Itaim, Rede D'Or - Ambulatório",
    payment: "insurance",
    coverageUrl: "https://www.rededorsaoluiz.com.br/hospital/sao-luiz-itaim/marcar-consulta",
    street: "Rua Dr. Alceu de Campos Rodrigues, 95",
    neighborhood: "Itaim Bibi",
    city: "São Paulo",
    region: "SP",
    postalCode: "04544-000",
    addressLines: [
      "Rua Dr. Alceu de Campos Rodrigues, 95, Itaim Bibi",
      "São Paulo - SP, CEP 04544-000",
    ],
  },
  {
    schemaId: "hospital-sao-luiz-osasco",
    name: "Hospital São Luiz, Rede D'Or - Ambulatório",
    payment: "insurance",
    coverageUrl: "https://www.rededorsaoluiz.com.br/hospital/sao-luiz-osasco",
    city: "Osasco",
    region: "SP",
  },
];

/** Curto para linhas de contato (footer / pré-agendamento). */
export function locationOneLine(loc: Location): string {
  if (loc.street) {
    return `${loc.name} - ${loc.street}, ${loc.neighborhood}, ${loc.city} - ${loc.region}`;
  }
  return `${loc.name} - ${loc.city} - ${loc.region}`;
}
