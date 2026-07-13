# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**On Windows (Git Bash), `npm run dev` fails because npm spawns cmd.exe where node is not on the PATH. Use the direct binary instead:**

```bash
./node_modules/.bin/vite          # dev server (http://localhost:5173)
./node_modules/.bin/vite build    # production build
./node_modules/.bin/vite preview  # preview production build
```

If `node_modules` is missing, install with:
```bash
npm install --ignore-scripts
```

Lint:
```bash
npm run lint
```

## Architecture

Single-file React app (`src/App.jsx`) — no router, no state management library, no backend. All state lives in one `useState` hook holding a `transactions` array. Derived values (totalIncome, totalExpenses, balance, filteredTransactions) are computed inline on every render.

Each transaction has: `{ id, description, amount, type: "income"|"expense", category, date }`. Note: `amount` is stored as a string — the reduce sums use string concatenation, not arithmetic, which is a latent bug.

Categories are a hardcoded array in `App.jsx`: `["food", "housing", "utilities", "transport", "entertainment", "salary", "other"]`.

No persistence — state resets on page reload.
