# Nuha Mart BD — Enterprise Products & Catalog v6.4

## Prerequisites

Install first:

1. Enterprise Design System v6.0
2. Enterprise Admin Layout v6.1
3. Enterprise Dashboard v6.2
4. Enterprise Business Settings v6.3

## Included

- Professional products listing
- Search, category, brand and status filters
- Sortable price and stock columns
- Product image, stock and status badges
- Responsive pagination
- Professional Create/Edit workspace
- General, Pricing, Inventory, Book, Media, SEO and Advanced tabs
- Cover image and gallery previews
- Physical, ebook and combined product support
- Book metadata
- Storefront product preview
- SEO preview
- Professional product details page
- SEO request validation
- Route/UI feature test
- No database migration required

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Products-v6.4.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
php artisan test --filter=EnterpriseProductsUiV64Test
npm run build
```

## Verify

Open:

```text
http://127.0.0.1:8000/admin/products
```

Test listing filters, sorting, create/edit forms, image upload, gallery upload,
book fields, pricing, inventory, SEO and responsive widths.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```
