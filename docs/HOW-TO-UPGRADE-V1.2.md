# CloudBridge V1.2 — Safely updating an existing project

The complete V1.2 ZIP is a reference snapshot. If you already have CloudBridge in VS Code and Git, **do not paste this entire folder over your current project**. Applying a small patch preserves any unrelated changes and lets you review exactly what will change.

## If your project is already V1.1

1. Open your existing CloudBridge folder in VS Code. In a PowerShell terminal, run:
   ```powershell
   git status
   git branch --show-current
   node --version
   node -p "require('./package.json').version"
   ```
2. If needed, commit your local edits. Your deployed site stays unchanged by these commits.
   ```powershell
   git add .
   git commit -m "Checkpoint before V1.2"
   git switch -c feature/cloudbridge-v1.2
   ```
3. Download **CloudBridge-V1.2.patch** and put it in the project root (same level as package.json), then run:
   ```powershell
   git apply --check .\CloudBridge-V1.2.patch
   git apply .\CloudBridge-V1.2.patch
   ```
   If `--check` fails, **stop**; no code has changed. Your V1.1 files may differ. Compare the patch manually or share your current project archive rather than forcing changes.
4. Check the upgrade:
   ```powershell
   npm ci
   npm test
   npx tsc --noEmit
   npm run build
   npm run dev
   ```
5. Test the Scenario practice link and verify existing lessons, flashcards, practice exams and progress still work. Then:
   ```powershell
   git status
   git add src package.json package-lock.json README.md docs
   git commit -m "Add objective-linked scenario practice in V1.2"
   git push -u origin feature/cloudbridge-v1.2
   ```

**Do not deploy to the production Netlify site until testing and review are complete.** If Netlify automatically builds branch previews, review the preview first.

## If your current code is an older version

This patch assumes the earlier CloudBridge **V1.1** source snapshot. It cannot be safely applied to arbitrary older versions. Do not overwrite your main project with the full ZIP. First get V1.1 into your Git branch or provide your current source so changes can be merged precisely.

## If Git says 'not a git repository'

The project folder does not currently contain a `.git` history. Make a separate folder backup first; then you may initialise Git with `git init` (or clone the actual GitHub repository if one already exists). Only add a remote URL if you know it belongs to your project.

## What changes in the incremental patch

- `src/App.tsx` — new nav entry and page renderer only
- `src/index.css` — extra isolated styles appended at end
- `src/components/ScenarioPracticeView.tsx` — new UI
- `src/scenarioQuestions.ts` — 12 original scenarios
- `src/scenarioProgress.ts` — separately namespaced saved results
- `src/scenarioPractice.test.ts` — 5 new tests
- `package.json`, `package-lock.json` — 1.2 version and test script
- `README.md`, `docs/HOW-TO-UPGRADE-V1.2.md` — documentation

This update does **not** modify previous `localStorage` keys, overwrite original question banks, change Netlify settings, or include `.git` history. Browser learning data is specific to the site origin and device; Git never backs up that data.

## Remaining work for V1.2

The 12 scenarios are an initial objective-aligned set only. Review questions against Microsoft Learn, extend assessed objectives, add hands-on networking practice, and build a learner-friendly backup/export facility before marketing full AZ-900 readiness.
