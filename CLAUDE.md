# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server (http://localhost:5173)
npm run build      # production build
npm run preview    # preview production build
npm run lint       # ESLint
```

If `node_modules` is missing:
```bash
npm install
```

**Note (Windows/Git Bash):** if `npm run dev` fails because npm spawns cmd.exe where node is not on PATH, use the direct binary instead: `./node_modules/.bin/vite`.

## Architecture

React app with no router, no state management library, no backend. Single-page, client-only.

**Component tree:**
- `App` — owns `transactions` state; renders the three child components
- `Summary` — receives `transactions`; computes and displays balance, totalIncome, totalExpenses
- `TransactionForm` — owns its own local form state; calls `onAdd(transaction)` prop on submit
- `TransactionList` — receives `transactions`; owns local filter state (filterType, filterCategory); calls `onDelete(id)` prop per row

## State

| Location | State | Notes |
|---|---|---|
| `App` | `transactions` | Single source of truth; passed down as props |
| `TransactionForm` | `description`, `amount`, `type`, `category` | Cleared on submit |
| `TransactionList` | `filterType`, `filterCategory` | UI-only, not lifted |

No persistence — state resets on page reload.

## Transaction model

```js
{
  id:          string,           // crypto.randomUUID()
  description: string,
  amount:      number,           // always positive
  type:        "income" | "expense",
  category:    string,           // one of the categories below
  date:        string,           // ISO date, e.g. "2024-03-15"
}
```

**Categories** (hardcoded, duplicated in `TransactionForm` and `TransactionList`):
`"food"`, `"housing"`, `"utilities"`, `"transport"`, `"entertainment"`, `"salary"`, `"other"`
