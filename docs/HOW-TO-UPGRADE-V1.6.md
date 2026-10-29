# Upgrade an existing CloudBridge V1.5 project to V1.6

**Choose exactly one patch, based on your starting code:**

- **V1.5 → V1.6:** use `CloudBridge-V1.6.patch`, generated against the exact V1.5 release.
- **Original uploaded V1.0 → V1.6:** use `CloudBridge-V1.0-to-V1.6.patch`, generated from the original `CloudBridge(1).rar` source snapshot. This bypasses V1.1–V1.5 patches if your local V1.0 source still matches that upload.
- **Any modified/intermediate version:** neither patch is guaranteed to apply. Run `git apply --check` and stop on failure; integrate on a branch rather than forcing changes.

Do not overwrite all project files. Create a Git branch and keep your original project intact.

## 1. Protect your code and browser study progress

In the existing project folder in VS Code PowerShell:

```powershell
git status
git add .
git commit -m "Checkpoint before CloudBridge V1.6"
git switch -c feature/cloudbridge-v1.6
```

If no changes are present, Git may say there is nothing to commit; proceed after confirming a clean status. If a branch of this name already exists, use a new branch name. **Do not add the generated patch into Git or commit any `node_modules` or `.env` files.** Use CloudBridge's Learning Objectives screen to export a progress JSON backup from your browser. Git does not protect localStorage.

## 2. Apply the patch

Copy the **one patch matching your starting version** into your project root. The example below uses the V1.5 patch; substitute `CloudBridge-V1.0-to-V1.6.patch` for the unmodified original V1.0 upload. Run:

```powershell
git apply --check .\CloudBridge-V1.6.patch
```

If it reports any error, **stop**. Compare your local changes against the exact V1.5 baseline and merge manually; do not force it.

Only if the check passes:

```powershell
git apply .\CloudBridge-V1.6.patch
```

## 3. Clean install, test and build

```powershell
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

Open the local address printed by Vite. Check the 77 scenario count, the new hands-on paths, working existing lessons, flashcards, exams, labs, and browser progress. Verify export/import from a separate browser profile with a backup copy; don't overwrite your only local progress.

## 4. Commit and publish safely

```powershell
git status
git add src docs .github README.md package.json package-lock.json
git commit -m "Add V1.6 deeper scenarios and optional official Azure practice paths"
git push -u origin feature/cloudbridge-v1.6
```

Review the GitHub Actions test results, merge only after checks pass, then deploy via your usual Netlify/GitHub integration. **Nothing in this ZIP or patch changes your GitHub repo or Netlify site automatically.**

## Risks and notes

- This code was tested with Node 22 and the archived dependencies. In the source-analysis environment, `vite build` could not run because the supplied `node_modules` did not include Rolldown's Linux native binding. A fresh `npm ci` from an intact lockfile on your device / GitHub Actions is required to confirm the production build.
- The hands-on NSG path can incur charges if followed in Azure; the pricing path does not deploy resources.
- All checkbox progress is self-reported. No Azure subscription credentials are collected.
- Existing V1.5 localStorage keys and scenario IDs are retained; a **new optional key** is added to backups. Rolling back to V1.5 code leaves that key untouched but older backup importers do not recognise it.
