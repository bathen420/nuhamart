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

            'locale' => app()->getLocale(),
            'supportedLocales' => ['en' => 'English', 'bn' => 'বাংলা'],

            'auth' => [
                'user' => $request->user()?->loadMissing('roles'),
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name')->values() : [],
                'roles' => $request->user() ? $request->user()->getRoleNames()->values() : [],
            ],

            'storefrontCategories' => function () {
                if (!\Illuminate\Support\Facades\Schema::hasTable('categories')) return [];
                return \App\Models\Category::query()->where('status', true)->withCount(['products' => fn ($q) => $q->where('status', true)])->orderBy('sort_order')->limit(12)->get()->map(fn ($x) => [
                    'id' => $x->id, 'name' => $x->localized('name'), 'slug' => $x->slug, 'products_count' => $x->products_count,
                ]);
            },

            'notificationsSummary' => function () use ($request) {
                $user = $request->user();

                if (!$user || !\Illuminate\Support\Facades\Schema::hasTable('notifications')) {
                    return ['unread_count' => 0, 'items' => []];
                }

                $query = \App\Models\Notification::query()
                    ->where('user_id', $user->getKey())
                    ->where('is_read', false);

                return [
                    'unread_count' => (clone $query)->count(),
                    'items' => $query->latest('id')->limit(8)->get(),
                ];
            },

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            'businessSettings' => fn () => \App\Models\BusinessSetting::current()->publicPayload(),
        ];
    }
}
