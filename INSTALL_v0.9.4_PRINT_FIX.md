# NuhaMart v0.9.4 — Print Architecture Fix

## Purpose
Fixes blank Chrome/Edge Print Preview for:

- A4 sales invoice
- 80mm thermal receipt
- 58mm thermal receipt
- Save as PDF from browser print

## Root cause
The global print stylesheet hides every element using `body * { visibility: hidden }` and only restores content inside `#print-invoice`. The standalone A4 and thermal invoice pages did not contain that print target, so the browser printed a blank page.

## Installation
1. Stop the running Vite terminal with `Ctrl + C`.
2. Extract this ZIP.
3. Copy the included `resources` folder into:

   `C:\Users\HP\nuhamart`

4. Choose **Replace the files in the destination**.
5. Run:

```powershell
cd C:\Users\HP\nuhamart
php artisan optimize:clear
npm run build
npm run dev
```

6. Hard refresh Chrome with `Ctrl + Shift + R`.

## Verification
Test all three pages:

- `/admin/sales/{sale}/invoice`
- `/admin/sales/{sale}/invoice/thermal?size=80`
- `/admin/sales/{sale}/invoice/thermal?size=58`

Click Print / Save PDF. The invoice or receipt must appear in preview.

For cleaner output, turn off **Headers and footers**. Enable **Background graphics** when invoice colors are required.

## Safety
- No migration
- No database change
- No route change
- No controller change
- Existing sales and inventory data are untouched
