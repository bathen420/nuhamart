# Changelog — v1.5.2

## Security
- Added centralized fail-closed authorization middleware for all named admin routes.
- Replaced broad resource-level permissions with action-specific permission resolution.
- Added automated detection for newly added admin routes without permission mappings.

## Integrity
- Added balanced-journal, duplicate-posting, orphan-line, negative-stock and duplicate-barcode checks.
- Added `nuhamart:health-check` command; it never changes data.

## Quality
- Added FoundationHardeningTest.
- Added Windows full-release verification script.

## Database
- No migration and no data transformation.
