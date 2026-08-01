# NuhaMart v0.9.0 — Professional Invoice System

## Installation

1. Confirm your current project includes v0.8.2.
2. Extract this ZIP.
3. Copy every folder from the extracted package into your project root:
   `C:\Users\HP\nuhamart`
4. Choose **Replace files in destination**.
5. Run:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
npm run build
```

6. Start development services:

```powershell
php artisan serve
```

In another PowerShell:

```powershell
cd C:\Users\HP\nuhamart
npm run dev
```

7. Hard refresh Chrome: `Ctrl + Shift + R`.

## Test

Open a Sales record and test:

- A4 Invoice
- Download PDF
- 80mm Receipt
- 58mm Receipt
- Print / Save PDF

Routes:

- `/admin/sales/{sale}/invoice`
- `/admin/sales/{sale}/invoice/thermal?size=80`
- `/admin/sales/{sale}/invoice/thermal?size=58`
- `/admin/sales/{sale}/invoice/pdf`

## Print settings

For A4:
- Paper: A4
- Layout: Portrait
- Headers and footers: Off
- Background graphics: On

For thermal:
- Select the installed 58mm or 80mm receipt printer
- Margins: None or Minimum
- Scale: 100%
- Headers and footers: Off

## Rollback

```powershell
git restore routes/web.php resources/js/Pages/Admin/Sales/Show.jsx
git clean -fd app/Http/Controllers/Admin/InvoiceController.php resources/js/Pages/Admin/Invoices resources/views/invoices tests/Feature/InvoiceRoutesTest.php
```
