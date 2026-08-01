<?php

namespace Tests\Feature;

use Tests\TestCase;

class ReportsRoutesTest extends TestCase
{
    public function test_reports_routes_are_registered(): void
    {
        $this->assertSame('/admin/reports', route('admin.reports.index', absolute: false));
        $this->assertSame('/admin/reports/sales', route('admin.reports.sales', absolute: false));
        $this->assertSame('/admin/reports/sales/print', route('admin.reports.sales.print', absolute: false));
        $this->assertSame('/admin/reports/sales/export', route('admin.reports.sales.export', absolute: false));
        $this->assertSame('/admin/reports/sales/export-excel', route('admin.reports.sales.export-excel', absolute: false));
    }
}
