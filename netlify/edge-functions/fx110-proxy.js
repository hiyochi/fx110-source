const UPSTREAM = "https://www.fx110.com";
const ALLOWED_PATH = /^\/(?:book|api\/book)(?:\/|$)/;

export default async function handler(request) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(request.url);
  if (!ALLOWED_PATH.test(url.pathname)) {
    return new Response("Not Found", { status: 404 });
  }

  const upstream = await fetch(UPSTREAM + url.pathname + url.search, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9",
    },
    redirect: "follow",
  });

  const contentType = upstream.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  }

  const html = (await upstream.text())
    .split(UPSTREAM)
    .join(url.origin)
    .split("http://www.fx110.com")
    .join(url.origin);

  return new Response(html, {
    status: upstream.status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": upstream.status === 200 ? "public, max-age=300" : "no-store",
    },
  });
}

export const config = {
  path: ["/book", "/book/*", "/api/book/*"],
  method: "GET",
};
