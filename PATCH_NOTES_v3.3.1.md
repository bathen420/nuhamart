# NuhaMart v3.3.1 Print Patch

## Fixed

- Fixed the blank Activity Logs print preview.
- Activity Logs content is now connected to the existing NuhaMart print stylesheet through the `print-invoice` print target.
- Filters, buttons and pagination remain hidden during printing.

## Upgrade

Replace the project files, preserve your existing `.env` and database, then run:

```bash
php artisan optimize:clear
npm run build
```
