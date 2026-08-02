<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHomepageBannerRequest;
use App\Http\Requests\StoreHomepagePromotionRequest;
use App\Models\HomepageBanner;
use App\Models\HomepagePromotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomepageContentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/HomepageContent/Index', [
            'banners' => HomepageBanner::orderBy('sort_order')->orderBy('id')->get(),
            'promotions' => HomepagePromotion::orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function storeBanner(StoreHomepageBannerRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');
        $data['image'] = $request->file('image')?->store('homepage/banners', 'public');
        HomepageBanner::create($data);
        return back()->with('success', 'Homepage banner created successfully.');
    }

    public function updateBanner(StoreHomepageBannerRequest $request, HomepageBanner $banner): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');
        if ($request->hasFile('image')) {
            if ($banner->image) Storage::disk('public')->delete($banner->image);
            $data['image'] = $request->file('image')->store('homepage/banners', 'public');
        } else {
            unset($data['image']);
        }
        $banner->update($data);
        return back()->with('success', 'Homepage banner updated successfully.');
    }

    public function destroyBanner(HomepageBanner $banner): RedirectResponse
    {
        if ($banner->image) Storage::disk('public')->delete($banner->image);
        $banner->delete();
        return back()->with('success', 'Homepage banner deleted successfully.');
    }

    public function storePromotion(StoreHomepagePromotionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');
        $data['image'] = $request->file('image')?->store('homepage/promotions', 'public');
        HomepagePromotion::create($data);
        return back()->with('success', 'Promotion block created successfully.');
    }

    public function updatePromotion(StoreHomepagePromotionRequest $request, HomepagePromotion $promotion): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');
        if ($request->hasFile('image')) {
            if ($promotion->image) Storage::disk('public')->delete($promotion->image);
            $data['image'] = $request->file('image')->store('homepage/promotions', 'public');
        } else {
            unset($data['image']);
        }
        $promotion->update($data);
        return back()->with('success', 'Promotion block updated successfully.');
    }

    public function destroyPromotion(HomepagePromotion $promotion): RedirectResponse
    {
        if ($promotion->image) Storage::disk('public')->delete($promotion->image);
        $promotion->delete();
        return back()->with('success', 'Promotion block deleted successfully.');
    }
}
