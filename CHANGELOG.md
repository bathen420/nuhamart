# NuhaMart v3.0 Changelog

## Added

- Complete Sales Return module
- Full and partial return support
- Validation against over-return and duplicate-return quantities
- Automatic returned-stock increase
- Stock History `IN` record for every returned product
- Automatic sale total, paid amount, due amount, payment status and sale status adjustment
- Sales Return history, filters and details page
- Printable Sales Return invoice
- Sales Return routes preconfigured in `routes/web.php`
- Sales Returns item preconfigured in the admin sidebar
- Sales Return button added to the sales invoice page
- Dashboard cards for today, current month and lifetime returns

## Architecture

- Controller
- FormRequest
- Service
- Repository
- Eloquent Models
- Inertia React pages

## Database

- `sale_returns`
- `sale_return_items`
