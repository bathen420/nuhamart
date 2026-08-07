<?php

return [
    'sslcommerz' => [
        'enabled' => (bool) env('PAYMENT_SSLCOMMERZ_ENABLED', false),
        'mode' => env('SSLCOMMERZ_MODE', 'sandbox'),
        'store_id' => env('SSLCOMMERZ_STORE_ID'),
        'store_password' => env('SSLCOMMERZ_STORE_PASSWORD'),
        'currency' => env('SSLCOMMERZ_CURRENCY', 'BDT'),
        'timeout' => (int) env('SSLCOMMERZ_TIMEOUT', 30),
        'sandbox_base_url' => env(
            'SSLCOMMERZ_SANDBOX_BASE_URL',
            'https://sandbox.sslcommerz.com'
        ),
        'live_base_url' => env(
            'SSLCOMMERZ_LIVE_BASE_URL',
            'https://securepay.sslcommerz.com'
        ),
    ],
];
