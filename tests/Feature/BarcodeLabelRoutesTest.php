<?php

namespace Tests\Feature;

use Tests\TestCase;

class BarcodeLabelRoutesTest extends TestCase
{
    public function test_barcode_label_routes_are_registered(): void
    {
        foreach ([
            'admin.barcode-labels.index',
            'admin.barcode-labels.generate',
            'admin.barcode-labels.print',
        ] as $routeName) {
            $this->assertTrue(app('router')->has($routeName), "Missing route {$routeName}");
        }
    }
}
