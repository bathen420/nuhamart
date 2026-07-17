<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BrandController extends Controller
{
    /**
     * Display a listing of brands.
     */
    public function index()
    {
        $brands = Brand::latest()->paginate(10);

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
        ]);
    }


    /**
     * Show create page.
     */
    public function create()
    {
        return Inertia::render('Admin/Brands/Create');
    }


    /**
     * Store brand.
     */
    public function store(StoreBrandRequest $request)
    {
        Brand::create([

            'name' => $request->name,

            'slug' => Str::slug($request->name),

            'description' => $request->description,

            'status' => $request->boolean('status'),

            'sort_order' => $request->sort_order ?? 0,

        ]);


        return redirect()
            ->route('brands.index')
            ->with('success', 'Brand created successfully.');
    }


    /**
     * Edit page.
     */
    public function edit(Brand $brand)
    {
        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand,
        ]);
    }


    /**
     * Update brand.
     */
    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $brand->update([

            'name' => $request->name,

            'slug' => Str::slug($request->name),

            'description' => $request->description,

            'status' => $request->boolean('status'),

            'sort_order' => $request->sort_order ?? 0,

        ]);


        return redirect()
            ->route('brands.index')
            ->with('success', 'Brand updated successfully.');
    }


    /**
     * Delete brand.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();


        return redirect()
            ->route('brands.index')
            ->with('success', 'Brand deleted successfully.');
    }
}