import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");
  const file = path.join(process.cwd(), "docs", `${safeSlug}.md`);
  const content = await fs.readFile(file, "utf8").catch(() => "# Not found\n\nThis document has not been written yet.");
  return <main className="container" style={{ padding: "36px 0 80px" }}><Link className="btn" href="/">← Logria</Link><article className="card" style={{ padding: 28, marginTop: 18 }}><pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{content}</pre></article></main>;
}
