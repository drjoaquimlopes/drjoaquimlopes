/**
 * Locais de atendimento do Dr. Joaquim Lopes.
 * Fonte única para a seção "Locais", o footer, o pré-agendamento e o JSON-LD.
 */

export type Location = {
  /** id usado no @id do schema (https://.../#<schemaId>) */
  schemaId: string;
  name: string;
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
    name: "CAORT - Clínica Avançada de Ortopedia e Traumatologia",
    street: "Rua Helena, 260",
    neighborhood: "Vila Olímpia",
    city: "São Paulo",
    region: "SP",
    postalCode: "04552-040",
    addressLines: ["Rua Helena, 260, Vila Olímpia", "São Paulo - SP, CEP 04552-040"],
    geo: { latitude: -23.5928, longitude: -46.6847 },
    primary: true,
  },
  {
    schemaId: "instituto-vita",
    name: "Instituto Vita - Ortopedia e Fisioterapia",
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
