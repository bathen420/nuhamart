# Upgrade to v3.3.6a

1. Back up the project and database.
2. Replace the patch files at the same relative paths, or use the full project archive.
3. Run:

```bash
composer dump-autoload
php artisan optimize:clear
npm install
npm run build
```

4. Start development services when needed:

```bash
php artisan serve
npm run dev
```
