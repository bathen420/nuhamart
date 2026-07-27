<?php

use App\Http\Controllers\Admin\SaleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/pos', [SaleController::class, 'create'])->name('pos.create');
        Route::post('/pos', [SaleController::class, 'store'])->name('pos.store');

        Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
        Route::delete('/sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');
    });
