# NuhaMart v3.2.1 Installation

1. Keep a backup of the old project and database.
2. Extract this ZIP.
3. Copy your existing `.env` and `database/database.sqlite` only if needed.
4. Run:

```powershell
php artisan optimize:clear
composer dump-autoload
php artisan migrate
npm install
npm run dev
```

In another terminal:

```powershell
php artisan serve
```

Open Admin > Settings, save the business information, then hard refresh with Ctrl+Shift+R.
