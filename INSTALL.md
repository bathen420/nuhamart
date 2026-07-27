# NuhaMart v3.0 Installation

## 1. Extract and open the project

```powershell
cd C:\xampp\htdocs\nuhamart
```

## 2. Install dependencies (only when needed)

```powershell
composer install
npm install
```

## 3. Configure environment

Confirm `.env` database settings, then run:

```powershell
php artisan key:generate
php artisan optimize:clear
php artisan migrate
```

For an existing NuhaMart database, `php artisan migrate` only adds the new Sales Return tables.

## 4. Start NuhaMart

Open two terminals:

```powershell
php artisan serve
```

```powershell
npm run dev
```

Open: `http://127.0.0.1:8000`

## Update from your previous project

Back up your old project and database first. Keep your existing `.env` if its database credentials are already correct, then run:

```powershell
php artisan optimize:clear
composer dump-autoload
php artisan migrate
npm run dev
```
