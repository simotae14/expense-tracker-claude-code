---
name: deploy
description: Deploy the expense-tracker app to staging — runs lint checks, builds the production bundle with Vite, and pushes the build to a local "staging" git branch. Use this whenever the user says "deploy", "deploy to staging", "push to staging", "ship this", or asks to build and release the app. Do not use for plain "build" or "lint" requests where the user just wants that one step, not a full deploy.
---

# Deploy to staging

This project has no dedicated test suite (no `test` script in `package.json`) and no
existing staging infrastructure (no CI, no hosting config, no `staging` branch at the
time this skill was written). This skill fills that gap with a simple, self-contained
convention: lint acts as the pre-deploy gate, and "staging" is a local git branch that
holds the latest built `dist/` output. If the project later adds a real test script or
a real hosting target, update the corresponding step below rather than working around it.

Run the steps below in order. Stop and report the failure if any step fails — never
push a broken or unverified build to staging.

## 1. Run checks (test gate)

```bash
npm run lint
```

There is no `npm test` script in this repo. `lint` is the only verification available,
so treat it as the required gate. If it fails, stop — fix the lint errors (or have the
user fix them) before continuing.

## 2. Build the production bundle

```bash
npm run build
```

This runs `vite build` and outputs static assets to `dist/`. On Windows/Git Bash, `npm run`
scripts fail because npm can't find node on PATH (see CLAUDE.md) — in that environment use
`./node_modules/.bin/vite build` instead. Detect this by checking if `npm run build` errors
with something like "node: command not found" and retry with the direct binary if so.

Confirm `dist/` was produced (e.g. `ls dist/index.html`) before moving on.

## 3. Push the build to the staging branch

`dist/` is gitignored, so the staging branch is a separate, orphan-style branch that
holds only the built output — it never merges into `main`. Use `git worktree` to avoid
disturbing the user's working tree on `main`:

```bash
# Create the staging branch if it doesn't exist yet
git show-ref --verify --quiet refs/heads/staging || git branch staging --orphan

# Check out staging into a temp worktree, copy the fresh build in, commit, clean up
git worktree add /tmp/staging-deploy staging 2>/dev/null || git worktree add --force /tmp/staging-deploy staging
rm -rf /tmp/staging-deploy/*
cp -r dist/. /tmp/staging-deploy/
cd /tmp/staging-deploy
git add -A
git commit -m "Deploy: $(cd - > /dev/null && git rev-parse --short HEAD)" --allow-empty
cd - > /dev/null
git worktree remove /tmp/staging-deploy --force
```

This commits the build output to `staging` locally. **Do not run `git push` to any
remote without explicit confirmation from the user** — pushing affects shared state and
should never happen silently as part of an automated skill run.

After committing, tell the user the deploy succeeded locally on the `staging` branch and
ask whether they want it pushed to `origin/staging`.

## Notes

- If the user says "staging" refers to something else for this project (e.g. a specific
  host, Vercel/Netlify, an S3 bucket, a real CI pipeline) once such infra exists, ask them
  for the concrete target instead of assuming — this skill's git-branch convention is a
  placeholder until real staging infra exists.
- If a real `test` script gets added to `package.json` later, run `npm test` in step 1 in
  addition to (or instead of) lint.
