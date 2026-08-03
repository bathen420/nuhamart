<?php

return [
    'default' => env('COURIER_DEFAULT', 'steadfast'),
    'steadfast' => [
        'enabled' => (bool) env('STEADFAST_ENABLED', false),
        'base_url' => rtrim(env('STEADFAST_BASE_URL', 'https://portal.packzy.com/api/v1'), '/'),
        'api_key' => env('STEADFAST_API_KEY'),
        'secret_key' => env('STEADFAST_SECRET_KEY'),
        'timeout' => (int) env('STEADFAST_TIMEOUT', 20),
    ],
];
