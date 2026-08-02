<?php

return [
    'shipping' => [
        'dhaka' => (float) env('COMMERCE_SHIPPING_DHAKA', 60),
        'outside_dhaka' => (float) env('COMMERCE_SHIPPING_OUTSIDE_DHAKA', 120),
        'digital_only' => 0,
        'store_pickup' => 0,
    ],
    'payments' => [
        'cod' => ['enabled' => true, 'label' => 'Cash on Delivery', 'label_bn' => 'ক্যাশ অন ডেলিভারি', 'reference_required' => false],
        'bkash' => ['enabled' => (bool) env('PAYMENT_BKASH_ENABLED', true), 'label' => 'bKash (Manual)', 'label_bn' => 'বিকাশ (ম্যানুয়াল)', 'reference_required' => true, 'account' => env('PAYMENT_BKASH_NUMBER')],
        'nagad' => ['enabled' => (bool) env('PAYMENT_NAGAD_ENABLED', true), 'label' => 'Nagad (Manual)', 'label_bn' => 'নগদ (ম্যানুয়াল)', 'reference_required' => true, 'account' => env('PAYMENT_NAGAD_NUMBER')],
        'bank' => ['enabled' => (bool) env('PAYMENT_BANK_ENABLED', true), 'label' => 'Bank Transfer', 'label_bn' => 'ব্যাংক ট্রান্সফার', 'reference_required' => true, 'account' => env('PAYMENT_BANK_INSTRUCTIONS')],
        'sslcommerz' => ['enabled' => (bool) env('PAYMENT_SSLCOMMERZ_ENABLED', false), 'label' => 'Online Payment', 'label_bn' => 'অনলাইন পেমেন্ট', 'reference_required' => false, 'mode' => env('SSLCOMMERZ_MODE', 'sandbox')],
    ],
];
