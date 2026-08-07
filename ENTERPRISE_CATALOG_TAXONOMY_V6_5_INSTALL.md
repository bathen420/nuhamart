# Nuha Mart BD — Enterprise Catalog Taxonomy v6.5

## Included

- Professional Categories module
- Professional Brands module
- Professional Authors module
- Professional Publishers module
- Professional Units module
- Shared reusable listing component
- Shared reusable create/edit workspace
- Search and pagination
- Bilingual names and descriptions
- Status and display-order controls
- Live record preview
- Permission-aware existing routes preserved
- No migration required

## Prerequisites

Install v6.0–v6.4 first.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Catalog-Taxonomy-v6.5.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
php artisan test --filter=EnterpriseCatalogTaxonomyV65Test
npm run build
```

## Verify

Open and test:

```text
/admin/categories
/admin/brands
/admin/authors
/admin/publishers
/admin/units
```

Check search, create, edit, delete where available, bilingual fields, status,
display order, pagination and responsive layout.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```
