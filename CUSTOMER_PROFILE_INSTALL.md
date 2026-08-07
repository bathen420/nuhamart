# Nuha Mart BD — Customer Profile Module

## Included

- `/account/profile` customer profile page
- Name, email, phone, date of birth and gender
- Profile photo upload and removal
- Existing password update and account deletion forms
- Customer account/sidebar and storefront dropdown integration
- Validation and automated tests

## Install

Extract this ZIP into the project root and merge/replace files.

```powershell
cd C:\Users\HP\nuhamart

composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan storage:link
php artisan test --filter=CustomerProfileTest
npm run build
```

`php artisan storage:link` may report that the link already exists; that is fine.

## Verify

Open:

```text
http://127.0.0.1:8000/account/profile
```

Then test:

1. Update name, phone, email, date of birth and gender.
2. Upload a JPG/PNG/WebP photo under 2 MB.
3. Remove the photo.
4. Change password.
5. Confirm Profile appears in both the account sidebar and header dropdown.
