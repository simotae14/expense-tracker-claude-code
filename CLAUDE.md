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

React app with no router, no state management library, no backend. The `transactions` array is the single source of truth, owned by `App.jsx` and passed down as props.

**Component tree:**
- `App` — holds `transactions` state, passes it down; renders the three child components
- `Summary` — receives `transactions`, computes and displays totalIncome, totalExpenses, balance
- `TransactionForm` — owns its own form state (description, amount, type, category); calls `onAdd(transaction)` prop on submit
- `TransactionList` — receives `transactions`, owns filter state (filterType, filterCategory) locally

Each transaction has: `{ id, description, amount: number, type: "income"|"expense", category, date }`.

`categories` is a hardcoded array duplicated in `TransactionForm` and `TransactionList`: `["food", "housing", "utilities", "transport", "entertainment", "salary", "other"]`.

No persistence — state resets on page reload.
