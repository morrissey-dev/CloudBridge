# CloudBridge V1.8 — Safe upgrade on Windows (VS Code / PowerShell)

V1.8 is an incremental enhancement to **V1.7**. It does not require a database or a replacement of existing code. Keep a backup of your working directory and any exported learner data before changing your project.

## Confirm your version

From the CloudBridge project root:

```powershell
node -p "require('./package.json').version"
git status
```

**If version is 1.7.0**, use `CloudBridge-V1.8.patch`. **If version is 1.0.0 AND your files exactly match your originally uploaded code**, use `CloudBridge-V1.0-to-V1.8.patch` instead. Never apply both patches. If neither condition holds or the patch check fails, merge changes against your actual code rather than forcing them.

## Protect the project

```powershell
git add .
git commit -m "Checkpoint before CloudBridge V1.8"
git switch -c feature/cloudbridge-v1.8
```

If Git reports *nothing to commit*, that's fine. If a branch with that name exists, choose another new branch. Do not commit local passwords or `.env` files; make sure they are ignored.

## Check and apply your selected patch

Place only the corresponding downloaded patch in the project root:

```powershell
git apply --check .\CloudBridge-V1.8.patch
git apply .\CloudBridge-V1.8.patch
```

Use `CloudBridge-V1.0-to-V1.8.patch` in both commands **only** if upgrading the exact original source. If the check reports conflicts, **stop**; do not use `--reject`, `--3way`, or replace your entire project.

## Install and test

```powershell
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

Then manually check these scenarios in the browser:

1. An empty learner profile shows optional next lessons (not fabricated failed questions).
2. After an incorrect exam answer, Learning Insights shows a linked review topic, or an explicit unmatched warning.
3. The suggested topic's **Open learning module** action enters the existing module without marking anything completed.
4. The **Practise this objective** action opens the linked scenario.
5. After a corrected scenario attempt, the incorrect-scenario counter decreases on revisiting Insights.
6. The Study Plan revision suggestions reflect study days and session length, but do not auto-book dates or mark activities completed.
7. Previously saved exam attempts, lessons, scenarios, lab results, backup and restore still work.
8. Test on a narrow mobile viewport and keyboard navigation.

Finally, commit changes and push the feature branch:

```powershell
git add .
git commit -m "Add personalised revision queue and study suggestions"
git push -u origin feature/cloudbridge-v1.8
```

**Deployment**: Merge and deploy only after tests, local production build and a Netlify preview are successful. The live website and GitHub repository are unchanged by merely downloading this patch.

**Why build validation remains open:** The provided archive includes dependencies installed for another environment and its Rolldown Linux native binding cannot be loaded here. A fresh install in your environment is needed. Automated tests and TypeScript checks were completed successfully.
