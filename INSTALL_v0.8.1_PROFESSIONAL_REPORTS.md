# NuhaMart v0.8.1 — Professional Reports Upgrade

## Before installation

This package is an **upgrade patch for NuhaMart v0.8.0 Reports Module**. Confirm the current project is committed and pushed to Git before copying these files.

## Installation

1. Extract this ZIP.
2. Copy every folder/file from the extracted package into the NuhaMart project root.
3. Choose **Replace the files in the destination**.
4. Open PowerShell in the project root and run:

```powershell
composer dump-autoload
php artisan optimize:clear
npm run build
```

5. Start the development servers:

```powershell
php artisan serve
```

In another PowerShell:

```powershell
npm run dev
```

6. Hard refresh Chrome with `Ctrl + Shift + R`.

## URLs

- Reports Dashboard: `/admin/reports`
- Sales Report: `/admin/reports/sales`
- Dedicated Print/PDF: `/admin/reports/sales/print`
- CSV Export: `/admin/reports/sales/export`
- Excel Export: `/admin/reports/sales/export-excel`

## Important behavior

The Sales Report filters records by **sale date**. Returned and Net values include all completed returns linked to each selected sale. This guarantees:

`Gross Sales - Sales Returns = Net Sales`

The Print/PDF button opens a dedicated landscape A4 report page instead of attempting to print the scrollable admin layout.

## Verification checklist

- Open Sales Report and apply a date range.
- Verify a fully returned sale shows Gross, Returned and Net = 0 correctly.
- Click **Print / PDF** and confirm the print preview contains the full report.
- Click **Excel** and verify styled headers and Grand Total.
- Click **CSV** and verify all columns.
- Run:

```powershell
php artisan route:list | findstr reports
```

## Git backup after successful testing

```powershell
git add .
git commit -m "Upgrade reports to v0.8.1 professional print and Excel export"
git push origin main
git tag -a v0.8.1 -m "Professional Reports Upgrade"
git push origin v0.8.1
```
