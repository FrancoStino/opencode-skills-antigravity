import type { Plugin } from "@opencode-ai/plugin";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

/**
 * Recursively copies all files from srcDir into destDir.
 * Creates destDir if it does not exist.
 * This avoids fs.cpSync's inconsistent behaviour when dest already exists
 * across different Node versions (nesting vs merging).
 */
function copyDirContents(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcEntry = path.join(srcDir, entry.name);
    const destEntry = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirContents(srcEntry, destEntry);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
    }
  }
}

const OpenCodeSkillsCollection: Plugin = async (_ctx) => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const bundledSkillsPath = path.join(__dirname, "..", "bundled-skills");
    const skillsPath = path.join(os.homedir(), ".config", "opencode", "skills");

    fs.mkdirSync(skillsPath, { recursive: true });

    const entries = fs.readdirSync(bundledSkillsPath, { withFileTypes: true });

    for (const entry of entries) {
      // Skip files (e.g. .antigravity-install-manifest.json) and hidden dirs
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith(".")) continue;

      const src = path.join(bundledSkillsPath, entry.name);

      // Only install folders that contain a SKILL.md at their root
      if (!fs.existsSync(path.join(src, "SKILL.md"))) continue;

      // Copy skill folder contents into skills/{name}/ explicitly
      const dest = path.join(skillsPath, entry.name);
      copyDirContents(src, dest);
    }
  } catch (error: unknown) {
    setTimeout(async () => {
      try {
        const { exec } = await import("child_process");
        const util = await import("util");
        const execAsync = util.promisify(exec);
        const fallbackPath = path.join(os.homedir(), ".config", "opencode", "skills");
        await execAsync(`npx --yes antigravity-awesome-skills --path "${fallbackPath}"`);
      } catch (e) {
        // silently fail completely
      }
    }, 0);
  }

  return {};
};

export default OpenCodeSkillsCollection;
