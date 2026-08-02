# NuhaMart v1.4.0 — Barcode & Label Printing

## Baseline

This upgrade was prepared for **NuhaMart v1.3.1**.

## Before installation

1. Confirm your working tree is clean: `git status`.
2. Create a database backup.
3. Stop the Vite development server with `Ctrl + C`.

## Copy files

Extract this ZIP and copy every included file/folder into:

```text
C:\Users\HP\nuhamart
```

Choose **Merge / Replace files in destination**.

## Run commands

```powershell
cd C:\Users\HP\nuhamart

composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
npm run build
```

After all checks succeed:

```powershell
php artisan serve
```

In another PowerShell window:

```powershell
cd C:\Users\HP\nuhamart
npm run dev
```

Hard-refresh Chrome with `Ctrl + Shift + R`.

## Open the module

```text
http://127.0.0.1:8000/admin/barcode-labels
```

## Typical workflow

1. Select **Products** or **Variants**.
2. Filter by product name, SKU, barcode, category, or brand.
3. Select rows and enter label quantities.
4. Generate Code 128 or EAN-13 when needed.
5. Choose a label preset or custom dimensions.
6. Choose which fields appear on the label.
7. Open Print Labels and print from Chrome/Edge.

## Supported label presets

- 38 × 25 mm
- 50 × 25 mm
- 100 × 50 mm
- A4 sheet with 24 labels
- Custom width, height, and column count

## Print recommendations

- Paper size: A4 for sheet labels.
- Scale: 100%.
- Margins: Default or None, depending on the physical sheet.
- Disable browser headers and footers.
- Enable background graphics only when needed.

## Rollback

```powershell
php artisan migrate:rollback --step=1
```

Then restore the replaced source files from Git:

```powershell
git restore .
```

Do not run rollback after barcode data has become operationally important without first taking a database backup.
