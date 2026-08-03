# Install v2.9.0

1. Merge the release files into the project root.
2. Add Steadfast credentials to `.env`.
3. Run migrations, permission seeder, tests, health check and production build.
4. Configure the server scheduler to run `php artisan schedule:run` every minute.

```env
STEADFAST_ENABLED=true
STEADFAST_API_KEY=
STEADFAST_SECRET_KEY=
STEADFAST_BASE_URL=https://portal.packzy.com/api/v1
```
