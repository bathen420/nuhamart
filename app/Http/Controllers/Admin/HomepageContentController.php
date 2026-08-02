<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHomepageBannerRequest;
use App\Http\Requests\StoreHomepagePromotionRequest;
use App\Http\Requests\UpdateHomepageSettingsRequest;
use App\Models\HomepageBanner;
use App\Models\HomepagePromotion;
use App\Models\HomepageSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomepageContentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/HomepageContent/Index', [
            'banners' => HomepageBanner::query()->orderBy('sort_order')->orderBy('id')->get(),
            'promotions' => HomepagePromotion::query()->orderBy('sort_order')->orderBy('id')->get(),
            'settings' => HomepageSetting::payload(),
            'presets' => [
                ['key' => 'book_store', 'label' => 'Book Store', 'description' => 'Books, authors, publishers and editorial discovery.'],
                ['key' => 'general_store', 'label' => 'General Store', 'description' => 'Balanced layout for mixed product categories.'],
                ['key' => 'campaign', 'label' => 'Campaign', 'description' => 'Promotion-first layout for sales and seasonal events.'],
                ['key' => 'education', 'label' => 'Education', 'description' => 'Academic books, learning tools and stationery.'],
            ],
        ]);
    }

    public function updateSettings(UpdateHomepageSettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $sections = collect($validated['sections'])->mapWithKeys(fn (array $section) => [
            $section['key'] => [
                'enabled' => (bool) ($section['enabled'] ?? false),
                'order' => (int) $section['order'],
            ],
        ])->all();

        HomepageSetting::savePayload([
            'general' => [
                'preset' => $validated['preset'],
                'announcement_enabled' => $request->boolean('announcement_enabled'),
                'announcement_text' => $validated['announcement_text'] ?? null,
                'announcement_text_bn' => $validated['announcement_text_bn'] ?? null,
                'announcement_url' => $validated['announcement_url'] ?? null,
                'cache_minutes' => (int) $validated['cache_minutes'],
            ],
            'sections' => $sections,
        ]);

        return back()->with('success', 'Homepage settings updated successfully.');
    }

    public function storeBanner(StoreHomepageBannerRequest $request): RedirectResponse
    {
        $data = $this->bannerData($request);
        HomepageBanner::create($data);
        $this->clearHomepageCache();

        return back()->with('success', 'Homepage banner created successfully.');
    }

    public function updateBanner(StoreHomepageBannerRequest $request, HomepageBanner $banner): RedirectResponse
    {
        $data = $this->bannerData($request, $banner);
        $banner->update($data);
        $this->clearHomepageCache();

        return back()->with('success', 'Homepage banner updated successfully.');
    }

    public function destroyBanner(HomepageBanner $banner): RedirectResponse
    {
        $this->deletePublicFiles([$banner->image, $banner->mobile_image]);
        $banner->delete();
        $this->clearHomepageCache();

        return back()->with('success', 'Homepage banner deleted successfully.');
    }

    public function storePromotion(StoreHomepagePromotionRequest $request): RedirectResponse
    {
        $data = $this->promotionData($request);
        HomepagePromotion::create($data);
        $this->clearHomepageCache();

        return back()->with('success', 'Promotion block created successfully.');
    }

    public function updatePromotion(StoreHomepagePromotionRequest $request, HomepagePromotion $promotion): RedirectResponse
    {
        $data = $this->promotionData($request, $promotion);
        $promotion->update($data);
        $this->clearHomepageCache();

        return back()->with('success', 'Promotion block updated successfully.');
    }

    public function destroyPromotion(HomepagePromotion $promotion): RedirectResponse
    {
        $this->deletePublicFiles([$promotion->image]);
        $promotion->delete();
        $this->clearHomepageCache();

        return back()->with('success', 'Promotion block deleted successfully.');
    }

    private function bannerData(StoreHomepageBannerRequest $request, ?HomepageBanner $banner = null): array
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');

        foreach (['image', 'mobile_image'] as $field) {
            if ($request->hasFile($field)) {
                if ($banner?->{$field}) {
                    Storage::disk('public')->delete($banner->{$field});
                }
                $data[$field] = $request->file($field)->store('homepage/banners', 'public');
            } else {
                unset($data[$field]);
            }
        }

        return $data;
    }

    private function promotionData(StoreHomepagePromotionRequest $request, ?HomepagePromotion $promotion = null): array
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('image')) {
            if ($promotion?->image) {
                Storage::disk('public')->delete($promotion->image);
            }
            $data['image'] = $request->file('image')->store('homepage/promotions', 'public');
        } else {
            unset($data['image']);
        }

        return $data;
    }

    private function deletePublicFiles(array $files): void
    {
        foreach (array_filter($files) as $file) {
            Storage::disk('public')->delete($file);
        }
    }

    private function clearHomepageCache(): void
    {
        Cache::forget('homepage-cms:settings');
        Cache::forget('storefront:home:en');
        Cache::forget('storefront:home:bn');
    }
}
