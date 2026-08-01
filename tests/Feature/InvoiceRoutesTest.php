<?php

namespace Tests\Feature;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_routes_are_registered(): void
    {
        $this->assertTrue(route('admin.invoices.a4', 1, false) === '/admin/sales/1/invoice');
        $this->assertTrue(route('admin.invoices.thermal', 1, false) === '/admin/sales/1/invoice/thermal');
        $this->assertTrue(route('admin.invoices.pdf', 1, false) === '/admin/sales/1/invoice/pdf');
    }
}
