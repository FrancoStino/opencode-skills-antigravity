import type { Plugin } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

const AntigravityAutoUpdater: Plugin = async ({ app }) => {
  // Run asynchronously in background to not block OpenCode startup
  setTimeout(async () => {
    try {
      console.log("🔄 [Antigravity Plugin] Syncing Awesome Skills...");

      // Resolve the absolute path to OpenCode's config directory
      // antigravity-awesome-skills requires the full absolute path
      // so it installs correctly regardless of the cwd
      const opencodeCfgDir = path.join(os.homedir(), ".config", "opencode");
      const skillsPath = path.join(opencodeCfgDir, ".agents", "skills");

      const { stdout, stderr } = await execAsync(
        `npx antigravity-awesome-skills --path "${skillsPath}"`
      );

      if (stdout) console.log("✅ [Antigravity Plugin]", stdout.trim());
      if (stderr) console.error("⚠️  [Antigravity Plugin]", stderr.trim());

    } catch (error: any) {
      console.error("⚠️  [Antigravity Plugin] Could not sync skills (offline?):", error.message);
    }
  }, 0);

  return {
    event: async ({ event }) => {
      // Reserved for future hooks
    }
  };
};

export default AntigravityAutoUpdater;
