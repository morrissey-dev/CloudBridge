# Safely applying CloudBridge V1.4 to your existing VS Code project

**Prerequisite:** This patch assumes your working tree matches the **V1.3 ZIP** supplied in the previous release. If you've changed local files or have an older version, `git apply --check` may fail. Never force the patch or overwrite your project to make it fit.

## 1. Protect your current work
In the original CloudBridge project folder:

```powershell
git status
node -p "require('./package.json').version"
```

Make sure any uncommitted work is saved and committed to a branch you control:

```powershell
git add .
git commit -m "Checkpoint before V1.4 upgrade"
git switch -c feature/cloudbridge-v1.4
```

A failed `git commit` because there is nothing to commit is fine. If the branch already exists, use a new name. A separate full ZIP backup is also a good precaution.

## 2. Check the patch BEFORE applying
Put `CloudBridge-V1.4.patch` in your CloudBridge project's root folder:

```powershell
git apply --check .\CloudBridge-V1.4.patch
```

If this fails, STOP: your local project does not match the exact V1.3 baseline. Do not use `--reject`, `--3way` or copy-paste replacements without reviewing the differences.

## 3. Apply, reinstall dependencies cleanly and verify

```powershell
git apply .\CloudBridge-V1.4.patch
npm ci
npm test
npx tsc --noEmit
npm run build
npm run dev
```

If `npm ci` fails, inspect the console first. Do not delete the lockfile or blindly run `npm audit fix --force`.

## 4. Verify in the browser
Open the local address printed by Vite and follow `docs/V1.4-RELEASE-NOTES.md` smoke tests. Use **export progress backup** on the old deployed site if you're moving study progress between domains or browsers. The backup stores learner results, not source code.

## 5. Commit only after all tests succeed

```powershell
Remove-Item .\CloudBridge-V1.4.patch
git add .
git commit -m "Expand scenario practice and source review in V1.4"
git push -u origin feature/cloudbridge-v1.4
```

Move or delete the downloaded `.patch` file from the project root **before running `git add .`**, so it is not accidentally committed to your source repository. Review and merge the branch before deploying. A successful Git push does **not** automatically guarantee that the public Netlify site has updated; that depends on its configured build branch and deploy pipeline.
