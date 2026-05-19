import fs from "node:fs";
import path from "node:path";
import { pluginManifestSchema, type PluginManifest } from "./sdk";

export type LoadedPlugin = { manifest: PluginManifest; status: "disabled" | "enabled" | "invalid"; health: string; path: string };

export function loadLocalPlugins(root = path.join(process.cwd(), "plugins")): LoadedPlugin[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => {
    const pluginPath = path.join(root, entry.name);
    const manifestPath = path.join(pluginPath, "plugin.json");
    try {
      const raw = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      const manifest = pluginManifestSchema.parse(raw);
      return { manifest, status: "disabled" as const, health: "Valid manifest. Disabled until owner/admin enables it.", path: pluginPath };
    } catch (error) {
      const fallback: PluginManifest = {
        id: entry.name,
        name: entry.name,
        version: "0.0.0",
        publisher: "unknown",
        license: "unknown",
        compatibility: { logria: "unknown" },
        requestedPermissions: [],
        requestedSecrets: [],
        networkDomains: [],
        dataCategories: [],
        contributes: { connectors: [], tools: [], widgets: [], actions: [] },
        riskLevels: [],
        auditEvents: [],
        demoFixtures: false,
      };
      return { manifest: fallback, status: "invalid" as const, health: error instanceof Error ? error.message : "Invalid plugin", path: pluginPath };
    }
  });
}
