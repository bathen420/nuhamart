# NuhaMart v0.8.0 — Reports Module Installation

## এই ZIP কী যোগ করবে

- Reports Dashboard
- Sales Report
- Date range filter
- Customer filter
- Payment method ও payment status filter
- Gross Sales, Sales Returns ও Net Sales summary
- Printable report
- CSV export
- Sidebar Reports menu
- `reports.view` ও `reports.export` permission
- Basic route test

## গুরুত্বপূর্ণ

এই package শুধুমাত্র **NuhaMart v0.7.0 latest**-এর ওপর বসানোর জন্য তৈরি। ZIP extract করার আগে Git working tree clean রাখুন।

## Installation

1. NuhaMart project বন্ধ করার দরকার নেই, তবে `npm run dev` terminal সাময়িকভাবে বন্ধ করলে ভালো।
2. এই ZIP extract করুন।
3. Extract করা package-এর `app`, `database`, `resources`, `routes`, `tests` এবং documentation files আপনার NuhaMart project root-এর ওপর Copy/Replace করুন।
4. PowerShell project root-এ খুলুন:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
php artisan db:seed --class=RolesAndPermissionsSeeder
npm run build
```

5. Build successful হলে development server চালান:

```powershell
php artisan serve
```

অন্য PowerShell:

```powershell
npm run dev
```

6. Browser hard refresh করুন: `Ctrl + Shift + R`
7. Sidebar থেকে **Reports** খুলুন।

## URLs

- Reports Dashboard: `http://127.0.0.1:8000/admin/reports`
- Sales Report: `http://127.0.0.1:8000/admin/reports/sales`

## Verification

```powershell
php artisan route:list --name=admin.reports
php artisan test --filter=ReportsRoutesTest
```

Expected routes:

- `admin.reports.index`
- `admin.reports.sales`
- `admin.reports.sales.export`

## Reporting basis

- Gross Sales: নির্বাচিত সময়ের মধ্যে তৈরি হওয়া Sales-এর original value
- Sales Returns: নির্বাচিত সময়ের মধ্যে completed return value
- Net Sales: Gross Sales minus Sales Returns

অর্থাৎ Gross Sales sale date অনুযায়ী এবং Return return date অনুযায়ী হিসাব হয়—এটি accounting period reporting-এর জন্য ইচ্ছাকৃত।

## Rollback

কপি করার আগে commit করা থাকলে:

```powershell
git restore .
php artisan optimize:clear
```

অথবা stable tag-এ ফিরে যেতে পারেন:

```powershell
git reset --hard v0.7.0
```

`git reset --hard` uncommitted পরিবর্তন মুছে দেয়—সতর্কভাবে ব্যবহার করুন।
