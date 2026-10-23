import { createServer } from "node:http";
import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

// Administrative one-time setup. No authorization endpoint is deployed to the site.
const root = process.cwd();
const input = process.argv[2];
if (!input) throw new Error("Informe o caminho do JSON OAuth baixado do Google.");
const credentials = JSON.parse(await readFile(resolve(input), "utf8")).web;
if (!credentials?.client_id || !credentials.client_secret) throw new Error("O JSON deve ser de um cliente OAuth do tipo Aplicativo da Web.");
const redirect = "http://localhost:8765/callback";
if (!credentials.redirect_uris?.includes(redirect)) throw new Error(`Cadastre o retorno ${redirect} no cliente OAuth.`);
if (!credentials.client_id.startsWith("791039264795-")) throw new Error("O cliente não pertence ao projeto aprovado para este site.");
const scope = "https://www.googleapis.com/auth/business.manage";
const state = randomBytes(32).toString("base64url");
const verifier = randomBytes(48).toString("base64url");
const ticket = randomBytes(24).toString("base64url");
let consuming = false;

const authorization = new URL("https://accounts.google.com/o/oauth2/v2/auth");
for (const [key, value] of Object.entries({
  client_id: credentials.client_id, redirect_uri: redirect, response_type: "code",
  scope, state, access_type: "offline", prompt: "select_account consent",
  code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256",
})) authorization.searchParams.set(key, value);

const page = (title, description) => `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{font:17px/1.65 system-ui;background:#f3f6f8;color:#183d50;max-width:650px;margin:10vh auto;padding:24px}h1{font-size:28px}</style><h1>${title}</h1><p>${description}</p></html>`;
function reply(res, status, title, description) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'", "X-Content-Type-Options": "nosniff" });
  res.end(page(title, description));
}
async function json(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Falha na consulta ao Google (HTTP ${response.status}).`);
  return response.json();
}
async function discover(accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const locations = [];
  let pageToken;
  do {
    const endpoint = new URL("https://mybusinessaccountmanagement.googleapis.com/v1/accounts");
    if (pageToken) endpoint.searchParams.set("pageToken", pageToken);
    const data = await json(endpoint, { headers });
    for (const account of data.accounts || []) {
      let next;
      do {
        const endpoint = new URL(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations`);
        endpoint.searchParams.set("readMask", "name,title,websiteUri,storefrontAddress,metadata");
        endpoint.searchParams.set("pageSize", "100");
        if (next) endpoint.searchParams.set("pageToken", next);
        const data = await json(endpoint, { headers });
        for (const location of data.locations || []) {
          locations.push({ ...location, account: account.name, reviewsParent: `${account.name}/${location.name}` });
        }
        next = data.nextPageToken;
      } while (next);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return [...new Map(locations.map(location => [location.name, location])).values()];
}
async function saveEnvironment(values) {
  const path = resolve(root, ".env.local");
  let previous = "";
  try { previous = await readFile(path, "utf8"); } catch (error) { if (error.code !== "ENOENT") throw error; }
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${JSON.stringify(value)}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    previous = pattern.test(previous) ? previous.replace(pattern, () => line) : `${previous.trimEnd()}\n${line}\n`;
  }
  await writeFile(path, previous.trimStart(), { mode: 0o600 });
}

const server = createServer(async (req, res) => {
  if (req.headers.host !== "localhost:8765" || req.method !== "GET") return reply(res, 400, "Solicitação inválida", "Use o endereço de autorização fornecido neste chat.");
  const url = new URL(req.url, "http://localhost:8765");
  if (url.pathname === `/connect/${ticket}`) {
    res.writeHead(302, { Location: authorization.href, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" });
    return res.end();
  }
  if (url.pathname !== "/callback") return reply(res, 404, "Página não encontrada", "Use o endereço de autorização fornecido neste chat.");
  const received = Buffer.from(url.searchParams.get("state") || "");
  const expected = Buffer.from(state);
  if (received.length !== expected.length || !timingSafeEqual(received, expected) || consuming) return reply(res, 400, "Autorização inválida", "Inicie uma nova conexão pelo endereço fornecido neste chat.");
  if (url.searchParams.has("error") || !url.searchParams.get("code")) return reply(res, 400, "Conexão não autorizada", "A conta não concedeu a autorização. Você pode iniciar novamente.");
  consuming = true;
  try {
    const token = await json("https://oauth2.googleapis.com/token", {
      method: "POST", body: new URLSearchParams({ client_id: credentials.client_id, client_secret: credentials.client_secret,
        grant_type: "authorization_code", code: url.searchParams.get("code"), redirect_uri: redirect, code_verifier: verifier }),
    });
    if (!token.refresh_token || !token.access_token || !token.scope?.split(" ").includes(scope)) throw new Error("A autorização não forneceu a permissão e a renovação necessárias. Inicie uma nova conexão.");
    await saveEnvironment({ GBP_CLIENT_ID: credentials.client_id, GBP_CLIENT_SECRET: credentials.client_secret, GBP_REFRESH_TOKEN: token.refresh_token });
    const directory = resolve(root, ".google-business");
    await mkdir(directory, { recursive: true, mode: 0o700 });
    let locations;
    try {
      locations = await discover(token.access_token);
      await writeFile(resolve(directory, "locations.json"), JSON.stringify(locations, null, 2), { mode: 0o600 });
      if (locations.length === 1) await saveEnvironment({ GBP_LOCATION_NAME: locations[0].reviewsParent, GBP_MAPS_URL: locations[0].metadata?.mapsUri || "" });
    } catch {
      console.log("Autorização salva. A consulta dos perfis precisa ser repetida após conferir as APIs e suas permissões.");
    }
    console.log(JSON.stringify({ authorized: true, locations: locations?.map(location => ({ name: location.name, title: location.title, website: location.websiteUri, reviewsParent: location.reviewsParent })) || [], credentialsStored: ".env.local (ignorado pelo Git)" }));
    reply(res, 200, "Conta conectada", "A autorização foi salva com segurança neste computador. Você pode fechar esta aba e voltar ao chat para concluir a integração das avaliações.");
    clearTimeout(timeout); server.close();
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Não foi possível concluir a conexão.");
    reply(res, 500, "Não foi possível concluir", "Volte ao chat para conferirmos a configuração. Nenhuma credencial foi exibida nesta página.");
    clearTimeout(timeout); server.close();
  }
});
const timeout = setTimeout(() => { console.log("O prazo da autorização terminou. Execute novamente para gerar um novo endereço."); server.close(); }, 20 * 60 * 1000);
server.on("error", error => { clearTimeout(timeout); console.log(error.code === "EADDRINUSE" ? "A porta 8765 está ocupada." : "Não foi possível iniciar a autorização local."); process.exitCode = 1; });
server.listen(8765, "127.0.0.1", () => console.log(`Abra para conectar o perfil: http://localhost:8765/connect/${ticket}`));
