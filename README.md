# DompetKeluarga — Household Budget Site

[![best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/noniairox/best-household-budget-site-20261126/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/noniairox/best-household-budget-site-20261126/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A working household budget site for the Santoso family (Bandung), November 2026 — in Indonesian, in rupiah. It runs offline in a web browser, on desktop and on a phone, from its own static files: no build step, no network requests.

## What it does

- **Dashboard** — month summary (income Rp 12.500.000, spending, set-aside savings, remaining), spending per category, nearest savings goals, unpaid bills, recent transactions.
- **Budget planner** — budget vs. spent per category with progress bars; add a transaction (description, category, amount, date) and the tables update; delete a transaction; filter the list by category.
- **Savings goals** — four goals with progress bars; add funds to any goal; create a new goal.
- **Bill calendar** — November 2026 calendar with due dates marked; mark bills paid/unpaid and the unpaid total updates.
- **Reports** — six-month income-vs-spending chart, spending donut, and insights computed from the numbers.

All figures are concrete and consistent across pages: one seed dataset (`app/data.js`) drives every view.

## Run it

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, unchanged).

## Structure

- `app/index.html` — shell: header, navigation, footer
- `app/main.js` — hash router (five pages)
- `app/views.js` — the five page renderers and their event wiring
- `app/data.js` — the single seed dataset (income, categories, transactions, goals, bills, trend) and totals
- `app/charts.js` — hand-rolled SVG charts (bars, donut, trend)
- `app/style.css` — all styling, including the phone layout
- `main.ts` — hands the site in: copies `app/` + `screenshots/`, writes `dossier.json`
- `serve.ts` — local static server for development
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

## License

MIT — see [LICENSE](LICENSE).
