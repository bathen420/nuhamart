# Nuha Mart BD v2.6.0 — Homepage CMS

## Added
- Homepage layout presets: Book Store, General Store, Campaign, Education.
- Admin-controlled announcement bar in English and Bangla.
- Homepage section visibility and ordering settings.
- Desktop and mobile hero artwork.
- Hero and promotion scheduling with start/end dates.
- Homepage settings cache with automatic invalidation after CMS changes.
- CMS preview shortcut and regression tests.

## Changed
- Only active, currently scheduled banners and promotions are published.
- Homepage CMS admin screen has been redesigned around settings, content and preview tabs.

## Database
Run `php artisan migrate` to create `homepage_settings` and add scheduling/mobile-image fields.
