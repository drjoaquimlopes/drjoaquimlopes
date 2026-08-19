/**
 * Dados institucionais do Dr. Joaquim Lopes: fonte única de verdade,
 * consumida por metadata, JSON-LD, nav, footer e páginas.
 */

export const site = {
  name: "Dr. Joaquim Lopes",
  role: "Ortopedista e Traumatologista",
  specialtyShort: "Especialista em Cirurgia do Joelho",
  url: "https://www.drjoaquimlopes.com.br",
  locale: "pt_BR",
  crm: "CRM-SP 171205",
  rqe: "RQE 113362",
  crmRqe: "CRM-SP 171205 / RQE 113362",
  email: "atendimento@drjoaquimlopes.com.br",
  phoneDisplay: "(11) 92553-8077",
  phoneE164: "+55-11-92553-8077",
  whatsappNumber: "5511925538077",
  whatsappMessage: "Olá, gostaria de agendar uma consulta.",
  social: {
    instagram: "https://instagram.com/drjoaquimlopes",
    facebook:
      "https://www.facebook.com/people/Dr-Joaquim-Lopes/61555823398320/",
  },
  hours: {
    label: "Segunda a Sexta · 08h às 18h",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  qualifications: [
    "Residência em Ortopedia e Traumatologia - HMCC",
    "Título de Especialista em Ortopedia e Traumatologia - SBOT",
    "Residência em Cirurgia do Joelho - Santa Casa de São Paulo",
    "Título de Especialista em Cirurgia do Joelho - SBCJ",
    "Fellow Avançado em Medicina Esportiva - Myongji Hospital, Seul, Coreia do Sul",
  ],
} as const;

export function whatsappUrl(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Links principais de navegação (nav + footer). */
export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/joelho", label: "Saúde do Joelho" },
  { href: "/especialidade", label: "Especialidade" },
  { href: "/blog", label: "Blog" },
] as const;
