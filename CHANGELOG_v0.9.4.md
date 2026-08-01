# Changelog — v0.9.4

## Fixed
- Blank A4 invoice print preview.
- Blank 80mm receipt print preview.
- Blank 58mm receipt print preview.
- Blank browser Save as PDF output.

## Changed
- Added a stable `#print-invoice` target to both standalone invoice templates.
- Added reusable `.print-document` support to global print CSS.
- Kept compatibility with existing Sales, Purchase, Return and Report print pages that already use `#print-invoice`.

## Data impact
None.
