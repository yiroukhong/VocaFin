# Contributing to VocaFin

## Branch naming

```
feature/<your-name>/<short-description>
e.g. feature/yirou/voice-button
     feature/kayyi/budget-bar
```

## File ownership (suggested split)

| Member   | Primary ownership |
|----------|-------------------|
| Member 1 | `pages/HomePage`, `pages/LogExpensePage`, `hooks/useVoiceInput` |
| Member 2 | `pages/ConfirmPage`, `pages/HistoryPage`, `components/TransactionCard`, `components/ConfirmDialog` |
| Member 3 | `pages/BudgetPage`, `pages/SummaryPage`, `components/BudgetBar`, `components/CategoryBadge` |
| Member 4 | `store/`, `data/`, `hooks/useTransactions`, `hooks/useBudget`, `router.jsx` |

## Import style

Always use the `@/` alias. Never use relative `../` paths that go up more than one level.

```js
// ✅ correct
import VoiceButton from '@/components/VoiceButton'
import { useTransactions } from '@/hooks/useTransactions'

// ❌ avoid
import VoiceButton from '../../components/VoiceButton'
```

## Component rules

- One component per file. File name = component name.
- Keep components presentational where possible — pull logic into hooks.
- No inline styles. Tailwind classes only.

## State rules

- Never import a store directly inside a page. Always go through a hook.
- Hooks are the only files that touch the store.

## Running the project

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Linting

```bash
npm run lint
```

Fix all warnings before opening a pull request.
