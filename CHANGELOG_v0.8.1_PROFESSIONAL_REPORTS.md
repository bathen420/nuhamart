# Changelog — v0.8.1 Professional Reports

## Fixed

- Fixed blank Sales Report print preview caused by printing the scrollable admin layout.
- Fixed inconsistent rows where a fully returned sale could display Returned = 0 and Net = Gross.
- Report totals now always reconcile: Gross − Returned = Net.

## Added

- Dedicated A4 landscape print/PDF page.
- Company logo, name, tagline, contact details and footer in print output.
- Generated date/time and prepared-by information.
- Grand totals in print output.
- Professional Excel-compatible `.xls` export with styled header and totals.
- Average Net Sale summary card.
- Page totals in the web report table.
- Separate CSV and Excel export controls.

## Changed

- Sales Report uses sale-date filtering and includes all completed returns linked to selected sales.
- Print/PDF opens in a separate browser tab and launches print preview automatically.
