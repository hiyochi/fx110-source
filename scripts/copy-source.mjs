import { mkdir, readFile, writeFile } from "node:fs/promises";

const source = "fx110-book-source-netlify.json";
const target = "public/source.json";

const parsed = JSON.parse(await readFile(source, "utf8"));
const sources = Array.isArray(parsed) ? parsed : [parsed];

await mkdir("public", { recursive: true });
await writeFile(target, `${JSON.stringify(sources, null, 2)}\n`);
console.log(`${source} -> ${target} (${sources.length} source${sources.length === 1 ? "" : "s"})`);
