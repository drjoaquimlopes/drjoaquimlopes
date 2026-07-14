import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const content = `# ${site.name}

> Site oficial do ${site.name}, ${site.role} e ${site.specialtyShort}.

## Páginas principais
- ${site.url}/sobre
- ${site.url}/especialidade
- ${site.url}/pre-agendamento
- ${site.url}/blog

## Conteúdo
- ${site.url}/sitemap.xml
- ${site.url}/rss.xml

## Contato
- ${site.email}
- ${site.phoneDisplay}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
