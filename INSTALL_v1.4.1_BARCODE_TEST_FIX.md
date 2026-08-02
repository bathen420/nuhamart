# NuhaMart v1.4.1 — Barcode Test Fix

## Purpose

This release corrects the EAN-13 reference value used by `BarcodeServiceTest`.
The production `BarcodeService` implementation was already correct.

For the 12-digit base `400638133393`, the valid EAN-13 check digit is `1`, producing `4006381333931`.

## Installation

1. Extract this ZIP.
2. Copy the `tests` folder into the NuhaMart project root.
3. Choose **Replace the file in the destination** when prompted.
4. Run:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
php artisan test
npm run build
```

## Database impact

None. This package contains no migration and does not alter business data.
