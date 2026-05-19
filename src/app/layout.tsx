import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logria — Open-source AI operations cockpit",
  description: "Ask Merlin what changed, see evidence, and act safely across SaaS operations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
