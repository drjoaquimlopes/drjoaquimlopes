# Dr. Joaquim Lopes

Site institucional e blog do Dr. Joaquim Lopes, desenvolvido com Next.js, React,
TypeScript e Tailwind CSS.

## Requisitos

- Node.js 22
- npm 10 ou superior

## Desenvolvimento

```bash
npm ci
npm run dev
```

O projeto fica disponível em `http://localhost:3000`.

## Validação

```bash
npm run check
```

Esse comando executa ESLint, checagem de tipos e o build de produção.

## Deploy na Vercel

Importe o repositório na Vercel como um projeto Next.js. Não há variáveis de
ambiente obrigatórias. O comando de build é `npm run build` e a versão de Node.js
deve ser 22.x.
