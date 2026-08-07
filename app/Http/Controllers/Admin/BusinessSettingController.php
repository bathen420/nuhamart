<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateBusinessSettingRequest;
use App\Services\BusinessSettingService;
use Inertia\Inertia;
use Inertia\Response;

class BusinessSettingController extends Controller
{
    public function __construct(private readonly BusinessSettingService $service) {}

    public function edit(): Response
    {
        $setting = $this->service->getCurrent();

        return Inertia::render('Admin/Settings/Edit', [
            'setting' => [
                ...$setting->toArray(),
                'logo_url' => $this->assetUrl($setting->logo),
                'dark_logo_url' => $this->assetUrl($setting->dark_logo),
                'white_logo_url' => $this->assetUrl($setting->white_logo),
                'footer_logo_url' => $this->assetUrl($setting->footer_logo),
                'mobile_logo_url' => $this->assetUrl($setting->mobile_logo),
                'admin_logo_url' => $this->assetUrl($setting->admin_logo),
                'login_logo_url' => $this->assetUrl($setting->login_logo),
                'invoice_logo_url' => $this->assetUrl($setting->invoice_logo),
                'pos_logo_url' => $this->assetUrl($setting->pos_logo),
                'email_logo_url' => $this->assetUrl($setting->email_logo),
                'favicon_url' => $this->assetUrl($setting->favicon),
                'og_image_url' => $this->assetUrl($setting->og_image),
            ],
            'timezones' => ['Asia/Dhaka', 'UTC', 'Asia/Kolkata', 'Asia/Dubai', 'Europe/London'],
        ]);
    }

    public function update(UpdateBusinessSettingRequest $request)
    {
        $fileFields = \App\Models\BusinessSetting::LOGO_FIELDS;

        $this->service->update(
            $request->validated(),
            collect($fileFields)->mapWithKeys(fn ($field) => [$field => $request->file($field)])->all(),
            collect($fileFields)->mapWithKeys(fn ($field) => [$field => $request->boolean("remove_{$field}")])->all(),
        );

        return back()->with('success', 'Business settings updated across the website.');
    }

    private function assetUrl(?string $path): ?string
    {
        if (! $path) return null;
        if (str_starts_with($path, 'http') || str_starts_with($path, '/')) return $path;

        return asset('storage/' . ltrim($path, '/'));
    }
}
