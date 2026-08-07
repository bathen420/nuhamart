# NuhaMart CRM v6.7.3 Permission Test Fix

The CRM compatibility code and frontend build are working. The remaining test
failure was a permission mismatch.

The admin route is named:

```text
admin.crm.show
```

`EnforceAdminPermission` resolves this route to:

```text
crm.view
```

The CRM controller also explicitly checks:

```text
customers.view
```

Therefore, the test administrator must have both permissions.

This patch changes only the automated test. It does not modify application
code, database schema, or existing data.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.7.3-Permission-Test-Fix.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
php artisan test --filter=EnterpriseCrmCompatibilityV671Test
```

If the real admin account cannot open CRM, assign both permissions to its role:

```text
crm.view
customers.view
```
