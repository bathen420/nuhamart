<?php

namespace App\Services;

use App\Models\CashDrawerTransaction;
use App\Models\HeldSale;
use App\Models\PosShift;
use App\Models\Sale;
use App\Models\SalePayment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EnterprisePosService
{
    public function __construct(private SaleService $sales) {}

    public function currentShift(?int $userId = null): ?PosShift
    {
        return PosShift::with('counter')->where('user_id', $userId ?? Auth::id())->where('status', 'open')->latest('opened_at')->first();
    }

    public function openShift(array $data): PosShift
    {
        if ($this->currentShift()) throw ValidationException::withMessages(['shift' => 'Close your current POS shift before opening another one.']);
        return PosShift::create(['counter_id'=>$data['counter_id'],'user_id'=>Auth::id(),'opening_cash'=>$data['opening_cash'],'opened_at'=>now(),'status'=>'open','opening_note'=>$data['opening_note']??null]);
    }

    public function expectedCash(PosShift $shift): float
    {
        $cashSales=(float)$shift->payments()->where('method','Cash')->sum('amount');
        $cashIn=(float)$shift->drawerTransactions()->where('type','cash_in')->sum('amount');
        $cashOut=(float)$shift->drawerTransactions()->where('type','cash_out')->sum('amount');
        return round((float)$shift->opening_cash+$cashSales+$cashIn-$cashOut,2);
    }

    public function closeShift(PosShift $shift, array $data): PosShift
    {
        abort_unless($shift->user_id===Auth::id() && $shift->status==='open',403);
        $expected=$this->expectedCash($shift); $closing=round((float)$data['closing_cash'],2);
        $shift->update(['closing_cash'=>$closing,'expected_cash'=>$expected,'cash_difference'=>round($closing-$expected,2),'closed_at'=>now(),'status'=>'closed','closing_note'=>$data['closing_note']??null]);
        return $shift->fresh(['counter','user']);
    }

    public function hold(array $data): HeldSale
    {
        $shift=$this->currentShift(); if(!$shift) throw ValidationException::withMessages(['shift'=>'Open a POS shift before holding a sale.']);
        return DB::transaction(function()use($data,$shift){
            $hold=HeldSale::create(['reference'=>'HOLD-'.now()->format('YmdHis').'-'.random_int(100,999),'shift_id'=>$shift->id,'customer_id'=>$data['customer_id']??null,'user_id'=>Auth::id(),'discount'=>$data['discount']??0,'tax'=>$data['tax']??0,'shipping'=>$data['shipping']??0,'note'=>$data['note']??null,'status'=>'held']);
            foreach($data['items'] as $row){$product=\App\Models\Product::findOrFail($row['product_id']);$price=$product->discount_price && (float)$product->discount_price>0?$product->discount_price:$product->price;$hold->items()->create(['product_id'=>$product->id,'quantity'=>$row['quantity'],'price'=>$price]);}
            return $hold->load('items.product','customer');
        });
    }

    public function checkout(array $data): Sale
    {
        $shift=$this->currentShift(); if(!$shift) throw ValidationException::withMessages(['shift'=>'Open a POS shift before checkout.']);
        $payments=collect($data['payments']??[])->filter(fn($p)=>(float)($p['amount']??0)>0)->values();
        if($payments->isEmpty()) $payments=collect([['method'=>$data['payment_method']??'Cash','amount'=>(float)($data['paid_amount']??0),'reference'=>null]]);
        $paid=round((float)$payments->sum('amount'),2);
        $primary=(string)($payments->first()['method']??'Cash');
        $saleData=$data; $saleData['paid_amount']=$paid; $saleData['payment_method']=$payments->count()>1?'Cash':$primary; unset($saleData['payments']);
        return DB::transaction(function()use($saleData,$payments,$shift){
            $sale=$this->sales->store($saleData);
            foreach($payments as $payment) SalePayment::create(['sale_id'=>$sale->id,'shift_id'=>$shift->id,'method'=>$payment['method'],'amount'=>$payment['amount'],'reference'=>$payment['reference']??null]);
            return $sale->load(['customer','user','items.product','payments']);
        });
    }

    public function drawer(PosShift $shift, string $type, float $amount, ?string $note=null): CashDrawerTransaction
    {
        abort_unless($shift->user_id===Auth::id() && $shift->status==='open',403);
        return CashDrawerTransaction::create(['shift_id'=>$shift->id,'user_id'=>Auth::id(),'type'=>$type,'amount'=>$amount,'note'=>$note]);
    }

    public function shiftReport(PosShift $shift): array
    {
        $payments=$shift->payments()->selectRaw('method, SUM(amount) total')->groupBy('method')->pluck('total','method');
        return ['shift'=>$shift->load('counter','user'),'payment_totals'=>$payments,'sales_count'=>$shift->payments()->distinct('sale_id')->count('sale_id'),'gross_sales'=>(float)$shift->payments()->sum('amount'),'expected_cash'=>$this->expectedCash($shift),'cash_in'=>(float)$shift->drawerTransactions()->where('type','cash_in')->sum('amount'),'cash_out'=>(float)$shift->drawerTransactions()->where('type','cash_out')->sum('amount')];
    }
}
