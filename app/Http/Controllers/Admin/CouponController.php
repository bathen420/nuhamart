<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCouponRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\MarketingCampaign;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
class CouponController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Marketing/Coupons', [
            'coupons'=>Coupon::with('campaign')->latest()->paginate(20),
            'campaigns'=>MarketingCampaign::orderBy('name')->get(['id','name']),
            'products'=>Product::where('status',true)->orderBy('name')->limit(300)->get(['id','name']),
            'categories'=>Category::where('status',true)->orderBy('name')->get(['id','name']),
            'brands'=>Brand::where('status',true)->orderBy('name')->get(['id','name']),
            'stats'=>['active'=>Coupon::currentlyActive()->count(),'redemptions'=>\App\Models\CouponRedemption::count(),'discount'=>\App\Models\CouponRedemption::sum('discount_amount')],
        ]);
    }
    public function store(StoreCouponRequest $request): RedirectResponse { Coupon::create($request->validated()); return back()->with('success','Coupon created.'); }
    public function update(StoreCouponRequest $request, Coupon $coupon): RedirectResponse { $coupon->update($request->validated()); return back()->with('success','Coupon updated.'); }
    public function destroy(Coupon $coupon): RedirectResponse { abort_if($coupon->redemptions()->exists(),422,'Used coupons cannot be deleted. Disable it instead.'); $coupon->delete(); return back()->with('success','Coupon deleted.'); }
}
