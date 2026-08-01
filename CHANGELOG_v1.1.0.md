# Changelog — NuhaMart v1.1.0

## Added
- Automatic double-entry posting for sales.
- Cash/Bank and Accounts Receivable split for partial and due sales.
- Automatic purchase posting to Inventory, Cash/Bank and Accounts Payable.
- Automatic journal for later supplier payments.
- Automatic sales-return reversal.
- Automatic purchase-return reversal.
- Opening-stock posting to Inventory and Opening Capital.
- Inventory gain/loss posting for approved stock adjustments.
- Source tracking on journal entries.
- Unique duplicate-posting protection by source type and source ID.
- Automatic creation of required system accounts when missing.
- Feature tests for balanced and idempotent posting.

## Updated system accounts
- 1400 Inventory
- 3200 Opening Capital
- 4200 Sales Returns
- 4300 Inventory Gain
- 5300 Inventory Loss

## Accounting scope note
This release posts sales revenue and inventory transaction values. Cost of Goods Sold is not auto-posted because the current base Product model does not provide a reliable product-level cost source for every sale line. COGS should be added after a permanent costing method such as weighted-average or FIFO is selected.
