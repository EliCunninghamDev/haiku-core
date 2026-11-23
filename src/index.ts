import { HAIKUS, EXPECTED, formatHaiku, pickHaiku, verifyHaiku } from "./haiku";
import { verify as verifyEngine, engineName } from "./engine";

const PORT = Number(Bun.env.PORT ?? 3000);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/" || path === "/index.html") {
      return new Response(
        Bun.file(new URL("./public/index.html", import.meta.url)),
        { headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }

    if (path === "/healthz" || path === "/api/health") {
      return json({ ok: true, uptime: process.uptime(), engine: engineName() });
    }

    if (path === "/api/haiku") {
      const haiku = pickHaiku(url.searchParams.get("seed") ?? Date.now());
      return json({ ...haiku, text: formatHaiku(haiku) });
    }

    if (path === "/api/haikus") {
      return json({ count: HAIKUS.length, haikus: HAIKUS });
    }

    if (path === "/api/verify" && req.method === "POST") {
      let lines: string[] = [];
      const type = req.headers.get("content-type") ?? "";
      if (type.includes("application/json")) {
        const body = (await req.json()) as { lines?: string[]; haiku?: string };
        lines = body.lines ?? body.haiku?.split("\n") ?? [];
      } else {
        lines = (await req.text()).split("\n");
      }
      lines = lines.filter((l) => l.trim().length > 0);
      return json({ ...verifyEngine(lines), lines, expected: [...EXPECTED] });
    }

    if (path === "/api/verify" && req.method === "GET") {
      const raw = url.searchParams.get("haiku") ?? "";
      const lines = raw.split(/\n|\|/).filter((l) => l.trim().length > 0);
      return json({ ...verifyEngine(lines), lines, expected: [...EXPECTED] });
    }

    if (path === "/robots.txt") {
      return new Response("User-agent: *\nAllow: /\n", {
        headers: { "content-type": "text/plain" },
      });
    }

    return json({ error: "not found", hint: "GET /api/haiku" }, 404);
  },
});

console.log(`haiku-core listening on http://localhost:${server.port} (${engineName()})`);
