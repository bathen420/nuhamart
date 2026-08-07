# Nuha Mart BD — Enterprise Dashboard v6.2

This package replaces the oversized legacy dashboard hero with a compact,
high-density business command center.

## Prerequisites

Install these first:

1. `NuhaMart-Enterprise-Design-System-v6.0.zip`
2. `NuhaMart-Enterprise-Admin-Layout-v6.1.zip`

## Included

- Compact command-center page header
- Professional primary KPI cards
- High-density operational KPI row
- Redesigned sales-versus-purchases chart
- Business health score
- Quick workflow actions
- Best-selling product ranking
- Recent sales table
- Inventory attention panel
- Recent activity timeline
- Responsive desktop, tablet and mobile layouts
- Existing dashboard controller/data contract preserved
- No database migration required

## Install

Place the ZIP in:

```text
C:\Users\HP\nuhamart
```

Run:

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Dashboard-v6.2.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
npm run build
```

## Verify

Open:

```text
http://127.0.0.1:8000/admin/dashboard
```

Check:

1. The old large hero banner is gone.
2. Currency values are fully visible and not truncated.
3. KPI cards respond correctly at desktop, tablet and mobile widths.
4. Sales and purchase chart renders.
5. Best-selling products and recent sales render.
6. Low/out-of-stock products appear in Inventory Attention.
7. Recent activities appear when supplied by the controller.
8. Quick-action links open their correct modules.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Rollback

Restore:

```text
resources/js/Pages/Admin/Dashboard.jsx
```

Remove:

```text
resources/js/Components/Dashboard/CommandKpiCard.jsx
resources/js/Components/Dashboard/BusinessHealthCard.jsx
resources/js/Components/Dashboard/EnterpriseRevenueChart.jsx
resources/js/Components/Dashboard/EnterpriseRecentSales.jsx
resources/js/Components/Dashboard/InventoryAttention.jsx
resources/js/Components/Dashboard/BestProductsCard.jsx
resources/js/Components/Dashboard/ActivityTimeline.jsx
```

## Next phase

Enterprise Business Settings v6.3:

- Settings navigation aligned with the new admin shell
- Cleaner grouped branding manager
- Professional preview workspace
- Better mobile/tablet experience
- Shared v6 form primitives
