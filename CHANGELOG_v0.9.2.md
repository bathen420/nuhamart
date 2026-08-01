# Changelog — v0.9.2

## Fixed
- Prevented duplicate creation of `customers.created_by` during fresh migrations.
- Made the follow-up audit-column migration safe for both fresh and older databases.
- Made rollback conditional and foreign-key aware.
