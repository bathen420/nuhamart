# Upgrade Instructions

1. Back up the current project and database.
2. Replace the project with the fixed full-project package, or copy the patch files while preserving paths.
3. Open a terminal in the project root and run:

```bash
composer install
composer dump-autoload
php artisan optimize:clear
php artisan storage:link
npm install
npm run build
```

For development:

```bash
php artisan serve
npm run dev
```

Then hard-refresh the browser with `Ctrl + F5`.

## Important

Do not copy an old `public/hot` file into the project. Vite creates it automatically while `npm run dev` is running.
