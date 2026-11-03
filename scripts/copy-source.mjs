import { copyFile, mkdir } from "node:fs/promises";

const source = "fx110-book-source-netlify.json";
const target = "public/source.json";

await mkdir("public", { recursive: true });
await copyFile(source, target);
console.log(`${source} -> ${target}`);
