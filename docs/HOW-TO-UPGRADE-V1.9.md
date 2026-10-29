# CloudBridge V1.9 — Safe upgrade for existing VS Code project (PowerShell)

Do not replace the working project with the full ZIP. This release adds review feedback and a filter without changing scores, saved attempts, question IDs or the browser storage schema.

## 1. Identify the source version

```powershell
node -p "require('./package.json').version"
git status
```

- **Version 1.8.0**, source matches supplied V1.8: choose `CloudBridge-V1.9.patch`.
- **Original version 1.0.0**, source matches the originally uploaded archive: choose `CloudBridge-V1.0-to-V1.9.patch` (this includes V1.1–V1.9).
- Other versions or changed local files: STOP if the patch check fails; merge changes against your local repository instead. Never apply both patches.

## 2. Protect your current work

Export learning progress in the running app (if you have any), and protect local source modifications:

```powershell
git status
git add .
git commit -m "Checkpoint before CloudBridge V1.9"
git switch -c feature/cloudbridge-v1.9
```

If there are no changes to commit, skip the commit. If the suggested branch already exists, pick an unused branch name. Check `.env` and private data are ignored before staging.

## 3. Check, then apply the selected patch

Copy only the chosen patch into your project root. For V1.8 → V1.9:

```powershell
git apply --check .\CloudBridge-V1.9.patch
git apply .\CloudBridge-V1.9.patch
```

For the exact original V1.0 → V1.9 source, use the cumulative patch. The originally uploaded source has mixed Windows CRLF and Unix LF endings; **this verified cumulative path** requires Git's `--ignore-whitespace` option so CRLF-only differences in two original files do not cause a false conflict:

```powershell
git apply --check --ignore-whitespace .\CloudBridge-V1.0-to-V1.9.patch
git apply --ignore-whitespace .\CloudBridge-V1.0-to-V1.9.patch
```

Use that command only if your files still match your originally uploaded V1.0. Do **not** use `--force`, `--reject` or `--3way` on a failed check, and do not bypass conflicts when your source includes later custom changes. The cumulative patch was validated byte-for-byte against an extracted copy of the original with this setting.

## 4. Install and test

```powershell
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

A local `npm ci` or a clean CI build is necessary because the archived Linux native Rollup/Rolldown dependencies cannot run here. If the local build fails, do not deploy.

## 5. Manual regression checklist

1. Complete a practice exam and open its answer review.
2. Switch **All questions** and **Incorrect & unanswered**; the count must include skipped questions.
3. For a question with id `added-gov-source-011`, verify a chosen wrong option explains why it is wrong and a correct option explains why it fits. If the question is in a different exam, use the exported review CSV to check that the feedback is authored; do not change exam pools just to trigger it.
4. Review an older completed exam and verify the existing score/answers have not changed.
5. Verify learning progress export/import, scenario practice, objectives tracker and study planner.
6. Test keyboard focus, a small mobile screen and external reference links.
7. Confirm exam scores remain labelled *CloudBridge practice*, not official AZ-900 scoring.

## 6. Commit, review and deploy

```powershell
git add .
git commit -m "Improve exam answer explanations and missed-question review"
git push -u origin feature/cloudbridge-v1.9
```

Open a pull request and review a Netlify preview; merge only after build and tests succeed. Merely downloading the patch does not change the GitHub repository or live Netlify website.
