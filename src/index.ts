import type { Plugin, PluginContext, PluginEvent } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

const AntigravityAutoUpdater: Plugin = async (_ctx: PluginContext) => {
  // Run asynchronously in background to not block OpenCode startup
  setTimeout(async () => {
    try {
      console.log("🔄 [Antigravity Plugin] Syncing Awesome Skills...");

      // Resolve absolute path to OpenCode's config directory
      // so it works regardless of the cwd when OpenCode is launched
      const opencodeCfgDir = path.join(os.homedir(), ".config", "opencode");
      const skillsPath = path.join(opencodeCfgDir, ".agents", "skills");

      // --yes skips the interactive "Ok to proceed?" prompt from npx
      const { stdout, stderr } = await execAsync(
        `npx --yes antigravity-awesome-skills --path "${skillsPath}"`
      );

      if (stdout) console.log("✅ [Antigravity Plugin]", stdout.trim());
      if (stderr) console.error("⚠️  [Antigravity Plugin]", stderr.trim());

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("⚠️  [Antigravity Plugin] Could not sync skills (offline?):", message);
    }
  }, 0);

  return {
    event: async (_evt: PluginEvent) => {
      // Reserved for future hooks
    }
  };
};

export default AntigravityAutoUpdater;
