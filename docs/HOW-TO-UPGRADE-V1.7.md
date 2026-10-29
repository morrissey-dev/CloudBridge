# Safe CloudBridge V1.7 upgrade in VS Code (Windows PowerShell)

**Do not extract the complete source ZIP over an existing project folder.** Use one matching patch on a committed working tree, and ensure your local code is the expected base. The V1.6 → V1.7 patch was generated from `CloudBridge-V1.6-source.zip` and checked against that exact snapshot. Local modifications can make it fail; never use `--reject` or force an unrelated patch.

1. Open the existing CloudBridge project in VS Code and create a safe Git checkpoint.

```powershell
git status
git add .
git commit -m "Checkpoint before CloudBridge V1.7"
git switch -c feature/cloudbridge-v1.7
```

2. Put the downloaded `CloudBridge-V1.7.patch` file into the project root, then check and apply:

```powershell
git apply --check .\CloudBridge-V1.7.patch
git apply .\CloudBridge-V1.7.patch
```

3. Install and verify:

```powershell
npm ci
npm test
npm run typecheck
npm run review:export
npm run build
npm run dev
```

4. In your browser, confirm: Learning insights empty state, completing/reviewing exams, domain drill-down to Scenario practice, old saved attempts, and backup/restore. `npm run review:export` regenerates the full question queue from the source.

5. Commit if you are satisfied:

```powershell
git add .
git commit -m "Add learning insights and question review workflow"
git push -u origin feature/cloudbridge-v1.7
```

Only merge/deploy after verifying the app locally and reviewing the preview deployment. The cumulative original → V1.7 patch is available **only** if your source exactly matches the initial uploaded CloudBridge v1.0 snapshot; confirm with `git apply --check` first. Do not apply both patches.

The downloadable `.patch` file should not itself be committed into application source unless you intentionally keep release archives in the repository.
