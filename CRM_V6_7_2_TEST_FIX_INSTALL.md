# NuhaMart CRM v6.7.2 Test Fix

The application build succeeded. The compatibility test failed only because
the project does not contain `Database\Factories\CustomerFactory`.

This patch updates the test to create Customer records directly with
`Customer::query()->create(...)`. It does not change application code,
database schema, or existing data.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.7.2-Test-Fix.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
php artisan test --filter=EnterpriseCrmCompatibilityV671Test
```

Then verify:

```text
http://127.0.0.1:8000/admin/crm/customers/1
```
