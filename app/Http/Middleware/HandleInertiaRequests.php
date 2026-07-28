<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(\Illuminate\Http\Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user()?->loadMissing('roles'),
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name')->values() : [],
                'roles' => $request->user() ? $request->user()->getRoleNames()->values() : [],
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            'businessSettings' => function () {
                if (!\Illuminate\Support\Facades\Schema::hasTable('business_settings')) {
                    return [
                        'company_name' => 'NuhaMart',
                        'company_tagline' => 'Inventory & POS System',
                        'logo' => null,
                        'address' => null,
                        'phone' => null,
                        'email' => null,
                        'website' => null,
                        'currency_code' => 'BDT',
                        'currency_symbol' => '৳',
                    ];
                }

                return \App\Models\BusinessSetting::current()->only([
                    'company_name',
                    'company_tagline',
                    'logo',
                    'address',
                    'phone',
                    'email',
                    'website',
                    'currency_code',
                    'currency_symbol',
                    'timezone',
                    'tax_rate',
                    'default_payment_method',
                    'sales_prefix',
                    'purchase_prefix',
                    'sales_return_prefix',
                    'purchase_return_prefix',
                    'invoice_footer',
                ]);
            },
        ];
    }
}
