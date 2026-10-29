# Safe upgrade — CloudBridge V1.4 → V1.5 (VS Code / Windows PowerShell)

**Do not unzip the full source on top of your existing project.** You should already be running the V1.4 source snapshot. The patch targets that version only.

## 1. Preserve current work

Open the existing project folder in VS Code, then run:

```powershell
git status
node -p "require('./package.json').version"
```

The version should report `1.4.0`. If your working files are modified, commit or stash them first. If this is not a Git repository, initialise/connect it before applying a patch; do not blindly use these commands.

```powershell
git add .
git commit -m "Checkpoint before CloudBridge V1.5"
git switch -c feature/cloudbridge-v1.5
```

An empty-working-tree message from `git commit` is harmless. Avoid creating an existing branch again; switch to it instead.

## 2. Review and apply the patch

Copy `CloudBridge-V1.5.patch` to the root of the existing CloudBridge project.

```powershell
git apply --check .\CloudBridge-V1.5.patch
```

**Only when the check succeeds**:

```powershell
git apply .\CloudBridge-V1.5.patch
```

If the check fails, stop and compare your exact files with the patch; **do not use `--force`, overwrite the source directory, or delete existing files to make it apply**.

## 3. Install, validate and preview

```powershell
npm ci
npm test
npx tsc --noEmit
npm run build
npm run dev
```

If `npm ci` fails because of optional native dependencies, troubleshoot the install for your OS before changing the lock file or the application code. Validate the learning modules, exams, flashcards, scenarios, both labs and the objective tracker in the browser.

### Manual acceptance checks

1. Open **Azure labs** and complete the four storage steps. Check feedback and previous score when you return.
2. Open the network lab, complete four steps, and confirm no real Azure subscription is accessed.
3. From **Scenario practice**, select new question `scenario-v15-LO-051` and an original question. Verify both save answers and Review mistakes works.
4. Confirm 63/63 original objectives now have at least one scenario on the objectives tracker.
5. Export a progress backup; verify it contains `cloudbridge-lab-progress-v1` if you completed a lab.
6. Restart the browser and confirm original lesson, exam, scenario and lab progress remain.
7. Verify layout on an actual phone or narrow browser window, including keyboard-only access.

## 4. Push for review, merge and deploy

```powershell
git add .
git commit -m "Add V1.5 curriculum scenarios and guided Azure labs"
git push -u origin feature/cloudbridge-v1.5
```

Merge to `main` only after the build and acceptance checks succeed; Netlify updates according to the branch configured for production deployment. Do not assume a feature-branch push changes the public website.
