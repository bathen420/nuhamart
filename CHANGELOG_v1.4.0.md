# Changelog — NuhaMart v1.4.0

## Added

- Barcode and label-printing administration module.
- Product barcode and barcode-type database fields.
- Code 128 barcode generation without an external JavaScript barcode package.
- EAN-13 generation, validation, and check-digit calculation.
- Product and product-variant label sources.
- Bulk selection and per-item print quantity.
- Category, brand, source, SKU, name, and barcode filtering.
- Label presets for 38×25, 50×25, 100×50 mm, and A4 24-label sheets.
- Custom label width, height, and column controls.
- Product name, price, SKU, and company-name display controls.
- A4 browser print layout suitable for label sheets.
- Barcode fields in the product create/edit form.
- `barcode-labels.view`, `barcode-labels.generate`, and `barcode-labels.print` permissions.
- Sidebar navigation.
- Route and barcode-service tests.

## Compatibility

- Built for NuhaMart v1.3.1.
- Does not remove or modify existing sales, purchase, inventory, accounting, or financial data.
- Existing product SKUs are used as printable Code 128 values until a dedicated barcode is generated.
