import fs from "node:fs";
import path from "node:path";

const patterns = [
  /sk_(live|test)_[A-Za-z0-9]+/,
  /xox[baprs]-[A-Za-z0-9-]+/,
  /gh[pousr]_[A-Za-z0-9_]{20,}/,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
const ignoredDirs = new Set([".git", ".next", "node_modules", "coverage", "dist"]);
const ignoredFiles = new Set(["pnpm-lock.yaml"]);
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".github" && entry.name !== ".env.example") {
      if (ignoredDirs.has(entry.name)) continue;
    }
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(file);
      continue;
    }
    if (!entry.isFile() || ignoredFiles.has(entry.name)) continue;
    const buffer = fs.readFileSync(file);
    if (buffer.includes(0)) continue;
    const text = buffer.toString("utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (patterns.some((pattern) => pattern.test(line))) hits.push(`${file}:${index + 1}`);
    });
  }
}

walk(process.cwd());
if (hits.length) {
  console.error(`Potential secrets found:\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("No high-signal secret patterns found.");
