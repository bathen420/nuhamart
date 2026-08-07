# Nuha Mart BD — Central Business Settings v3.0

This upgrade keeps the existing Controller → Service → Repository → Model architecture and centralizes public branding.

## Admin-controlled settings

- Company name, short name and tagline
- Main, white and footer logos
- Favicon and Open Graph image
- Phone, hotline, WhatsApp, email and support email
- Address, map embed and support hours
- Facebook, Instagram, YouTube, LinkedIn, TikTok, Telegram and Messenger
- Default SEO title, description, keywords and verification tokens
- Footer description, copyright and invoice footer
- Shipping, tax and public payment-method switches
- Existing ERP prefixes, courier and currency settings

## Integrated surfaces

- Global Inertia props
- Storefront header and footer
- Admin branding already consuming global props
- Browser title, favicon, SEO and Open Graph metadata
- Customer and admin order invoice PDF
- POS sales invoice PDF

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Business-Settings-Centralization-v3.0.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan storage:link

php artisan test --filter=BusinessSettingsCentralizationTest
npm run build
```

`storage:link` may say that the link already exists; that is fine.

## Verify

Open:

```text
http://127.0.0.1:8000/admin/settings
```

Change the company name, logo, phone, support email and footer text. Then verify:

1. Storefront header/footer.
2. Admin sidebar/dashboard.
3. Browser favicon and page metadata after hard refresh.
4. Customer order invoice PDF.
5. Admin order invoice PDF.
6. POS sales invoice PDF.

## Security

SMTP passwords, SSLCommerz password and courier API secrets remain in `.env`.
The Admin panel stores only public values and enable/disable switches.
