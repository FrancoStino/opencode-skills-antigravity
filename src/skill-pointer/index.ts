import os from "os";
import path from "path";
import { VAULT_DIR_NAME } from "../constants/heuristics.js";
import { ensureDir } from "../utils/fs.utils.js";
import { generatePointers } from "./pointer-generator.js";
import { migrateSkillsToVault } from "./vault-manager.js";

export interface SkillPointerOptions {
  /** Absolute path where OpenCode looks for active skills. */
  activeSkillsDir: string;
  /**
   * Absolute path of the hidden vault where raw skills are stored.
   * Defaults to ~/.config/opencode/skill-libraries
   *
   * Co-located with the rest of OpenCode config to keep all
   * OpenCode-related data under one XDG-style directory.
   */
  vaultDir?: string;
}

/**
 * Resolves the default vault path: ~/.config/opencode/skill-libraries
 *
 * Keeping the vault inside ~/.config/opencode/ means:
 * - all OpenCode data lives in one place (easy to backup / delete)
 * - no pollution of the home directory root
 */
function resolveDefaultVaultDir(): string {
  return path.join(os.homedir(), ".config", "opencode", VAULT_DIR_NAME);
}

/**
 * Orchestrates the full SkillPointer pipeline:
 * 1. Moves all raw skill folders from activeSkillsDir into the hidden vault.
 * 2. Generates lightweight category pointer SKILL.md files in activeSkillsDir.
 *
 * After this runs, activeSkillsDir contains only ~35 pointer folders
 * instead of 800+, reducing startup context from ~80k tokens to ~255.
 */
export function runSkillPointer(options: SkillPointerOptions): void {
  const vaultDir = options.vaultDir ?? resolveDefaultVaultDir();

  ensureDir(options.activeSkillsDir);
  ensureDir(vaultDir);

  migrateSkillsToVault(options.activeSkillsDir, vaultDir);
  generatePointers(options.activeSkillsDir, vaultDir);
}
