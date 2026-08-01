# NuhaMart v3.3.5 — Inventory Core

## Added
- Draft and approval workflow for stock adjustments.
- Warehouse-to-warehouse stock transfers with dispatch and receive confirmation.
- Warehouse/product stock ledger with date and movement filters.
- Inventory permissions, sidebar links, repositories, services, requests and Inertia pages.
- Database indexes and row locking for critical stock changes.

## Business rules
- A decrease adjustment cannot exceed the warehouse balance.
- Only a draft adjustment may be approved.
- Source stock is deducted when a transfer is dispatched.
- Destination stock is increased only when the transfer is received.
- Product total stock is unchanged by internal transfers.
- Completed inventory transactions cannot be applied twice.
