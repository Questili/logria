import { execSync } from "node:child_process";

const patterns = [
  "sk_(live|test)_[A-Za-z0-9]+",
  "xox[baprs]-[A-Za-z0-9-]+",
  "gh[pousr]_[A-Za-z0-9_]{20,}",
  "-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----",
];
const command = `rg -n --hidden --glob '!node_modules' --glob '!.next' --glob '!pnpm-lock.yaml' -e '${patterns.join("|")}' .`;
try {
  const output = execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  console.error(output);
  process.exit(1);
} catch (error) {
  if (error.status === 1) {
    console.log("No high-signal secret patterns found.");
    process.exit(0);
  }
  throw error;
}
