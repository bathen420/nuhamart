<?php
namespace App\Http\Controllers\Checkout;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class CouponController extends Controller
{
    public function __invoke(Request $request, CouponService $service): JsonResponse
    {
        $data=$request->validate(['coupon_code'=>['required','string','max:50'],'phone'=>['nullable','string','max:20'],'shipping'=>['nullable','numeric','min:0'],'items'=>['required','array','min:1'],'items.*.product_id'=>['required','integer','exists:products,id'],'items.*.quantity'=>['required','integer','min:1','max:100']]);
        $lines=collect($data['items'])->map(function($item){$p=Product::findOrFail($item['product_id']);$price=$p->product_type==='ebook'?(float)($p->ebook_price??$p->discount_price??$p->price):(float)($p->discount_price??$p->price);return ['product'=>$p,'quantity'=>(int)$item['quantity'],'lineSubtotal'=>round($price*(int)$item['quantity'],2)];});
        $subtotal=(float)$lines->sum('lineSubtotal');
        $result=$service->evaluate($data['coupon_code'],$lines,$subtotal,(float)($data['shipping']??0),$request->user()?->id,$data['phone']??null);
        return response()->json(['valid'=>true,'code'=>$result['coupon']->code,'discount'=>$result['discount'],'shipping_discount'=>$result['shipping_discount'],'message'=>'Coupon applied successfully.']);
    }
}
