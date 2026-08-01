# Inventory Core Functional Specification

## Stock Adjustment
A user creates a draft with one warehouse and one or more unique products. Approval applies all stock changes atomically and writes ledger rows.

## Stock Transfer
A transfer starts as draft. Dispatch deducts source warehouse balances. Receive adds destination balances. The total quantity in the product master remains unchanged.

## Stock Ledger
Each applied movement stores product, warehouse, reference, in/out quantity, warehouse balance after movement, unit cost, user and timestamp.

## Concurrency
Inventory application uses database transactions and row-level locks to prevent overselling during concurrent approval or dispatch.
