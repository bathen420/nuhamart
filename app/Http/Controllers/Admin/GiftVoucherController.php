<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGiftVoucherRequest;
use App\Models\GiftVoucher;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
class GiftVoucherController extends Controller
{
 public function index():Response{return Inertia::render('Admin/GiftVouchers/Index',['vouchers'=>GiftVoucher::latest()->paginate(20)]);}
 public function store(StoreGiftVoucherRequest $request):RedirectResponse{GiftVoucher::create($request->validated()+['created_by'=>$request->user()?->id]);return back()->with('success','Gift voucher created.');}
 public function destroy(GiftVoucher $giftVoucher):RedirectResponse{$giftVoucher->delete();return back()->with('success','Gift voucher deleted.');}
}
