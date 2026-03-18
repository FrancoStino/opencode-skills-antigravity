# Walkthrough: Release v8.1.0 Maintenance Sweep

## Overview

This walkthrough captures the maintainer-side documentation and release preparation work for **v8.1.0** after the 2026-03-17 PR merge batch.

## Changes Verified

### 1. Community PR batch integrated

- **PR #324**: Added `progressive-web-app`
- **PR #325**: Added `vibers-code-review`
- **PR #326**: Repaired invalid YAML frontmatter in existing skills
- **PR #329**: Added `trpc-fullstack`
- **PR #330**: Aligned FAQ risk labels and documented the active `skill-review` check
- **PR #331**: Removed a broken reference from `skills/data-scientist/SKILL.md`

### 2. Release-facing docs refreshed

- **README.md**:
  - Current release updated to **v8.1.0**
  - Release summary text aligned with the merged PR batch
  - Contributor acknowledgements kept in sync with the latest merge set
- **docs/users/getting-started.md**:
  - Version header updated to **v8.1.0**
- **docs/users/faq.md**:
  - Active `skill-review` workflow guidance retained as the current contributor check
- **CHANGELOG.md**:
  - Added the release notes section for **8.1.0**

### 3. Release protocol to run

- `npm run release:preflight`
- `npm run security:docs`
- `npm run validate:strict` (diagnostic, optional blocker)
- `npm run release:prepare -- 8.1.0`
- `npm run release:publish -- 8.1.0`

## Expected Outcome

- Documentation, changelog, and generated metadata all agree on the release state.
- The repository is ready for the `v8.1.0` tag and GitHub release.
