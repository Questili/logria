import fs from "node:fs";
import path from "node:path";

const markdown = ["README.md", "CONTRIBUTING.md", "SECURITY.md", ...fs.existsSync("docs") ? fs.readdirSync("docs").filter((file) => file.endsWith(".md")).map((file) => path.join("docs", file)) : []];
const missing = [];
for (const file of markdown.filter((item) => fs.existsSync(item))) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)#][^)]+)\)/g)) {
    const href = match[1];
    if (/^https?:/.test(href) || href.startsWith("mailto:")) continue;
    const target = path.normalize(path.join(path.dirname(file), href));
    if (!fs.existsSync(target)) missing.push(`${file} -> ${href}`);
  }
}
if (missing.length) {
  console.error(`Missing local links:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log("Local markdown links are valid.");
