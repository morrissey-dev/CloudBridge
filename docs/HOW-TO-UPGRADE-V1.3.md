# Safely applying the CloudBridge V1.3 patch in VS Code

**Do not overwrite your current code with the full V1.3 ZIP.** Use the patch only if you are already on the same clean V1.2 snapshot. V1.1 and older must be updated to V1.2 first or merged manually.

## 1. Preserve local edits and branch

Run these in the **existing CloudBridge project root**, not in a new project:

```powershell
git status
node -p "require('./package.json').version"
```

Expected version: `1.2.0`. Save your unfinished work first:

```powershell
git add .
git commit -m "Checkpoint before CloudBridge V1.3"
git switch -c feature/cloudbridge-v1.3
```

If you are already on a separate feature branch, use that branch or pick a different branch name. If Git has never been initialized, back up your folder before setting up version control. If `git commit` says there is nothing to commit, that's fine.

## 2. Preview the patch without changing files

Download `CloudBridge-V1.3.patch` into the **project root**, then:

```powershell
git apply --check .\CloudBridge-V1.3.patch
```

If checking fails, **stop and do not force it**. Your local files may differ from the exact source used for the patch. Share the `git status` output and current project source to prepare a specific merge.

When the check succeeds:

```powershell
git apply .\CloudBridge-V1.3.patch
```

## 3. Verify locally and try the interface

```powershell
npm ci
npm test
npx tsc --noEmit
npm run build
npm run dev
```

Check the new **Learning objectives** page, question status disclosure on **Practice quizzes**, and export/import workflow. Test on an unchanged browser profile first, and export a backup before experimenting with import.

## 4. Commit without deploying immediately

```powershell
git status
git add src package.json package-lock.json README.md docs
git commit -m "Add learning objective tracker and progress backups"
git push -u origin feature/cloudbridge-v1.3
```

Only merge and deploy to Netlify after you review a branch preview and all automated and manual checks pass. Do not commit `node_modules/`, local environment files, or a learner's progress backup.

## Why this is safer

The incremental patch modifies the V1.2 source instead of replacing your project and leaves your original saved progress keys intact. Your live Netlify website remains unchanged until your Git/Netlify deployment workflow updates it.
