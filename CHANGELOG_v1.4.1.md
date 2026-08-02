# Changelog — v1.4.1

- Corrected the EAN-13 expected check digit in `BarcodeServiceTest`.
- Added validation that an existing valid 13-digit EAN code is accepted.
- No production service logic was changed because the implementation already followed the EAN-13 weighting rule correctly.
