# NuhaMart v0.9.1 — Migration & Windows npm Stability Fix

## Fixes

1. Laravel migration fatal error caused by a typed `$withinTransaction` property.
2. Windows `EPERM` lock on `node_modules/@esbuild/win32-x64/esbuild.exe`.
3. Missing `vite` command after an interrupted `npm ci`.

## Install

1. Stop `npm run dev`, Laravel Pail, and any terminal running Node/Vite.
2. Extract this ZIP.
3. Copy the `database` folder into the NuhaMart project root and choose **Replace**.
4. Copy `FIX_NPM_WINDOWS.ps1` into the NuhaMart project root.
5. Open **PowerShell as Administrator** in the project root.

Run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan test
```

Then recover frontend dependencies:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\FIX_NPM_WINDOWS.ps1
```

If Windows Defender or another antivirus still locks `esbuild.exe`, temporarily close VS Code and all Chrome windows, rerun the script as Administrator, and restore normal antivirus protection afterward.

## Expected results

- `php artisan test` proceeds beyond migration loading without the `$withinTransaction` fatal error.
- `npm ci` completes.
- `npm run build` recognizes Vite and generates production assets.

## Safety

This patch does not delete application data or run `migrate:fresh`. It only replaces one migration source file and rebuilds `node_modules`.
