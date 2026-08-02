<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClosePosShiftRequest;
use App\Http\Requests\EnterprisePosCheckoutRequest;
use App\Http\Requests\HoldPosSaleRequest;
use App\Http\Requests\OpenPosShiftRequest;
use App\Models\HeldSale;
use App\Models\PosCounter;
use App\Models\PosShift;
use App\Services\EnterprisePosService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnterprisePosController extends Controller
{
    public function __construct(private EnterprisePosService $service) {}
    public function shifts(): Response { return Inertia::render('Admin/POS/Shifts', ['currentShift'=>$this->service->currentShift(),'counters'=>PosCounter::where('is_active',true)->orderBy('name')->get(),'recentShifts'=>PosShift::with('counter','user')->latest('opened_at')->limit(25)->get()]); }
    public function open(OpenPosShiftRequest $request): RedirectResponse { $this->service->openShift($request->validated()); return back()->with('success','POS shift opened.'); }
    public function close(ClosePosShiftRequest $request, PosShift $shift): RedirectResponse { $this->service->closeShift($shift,$request->validated()); return back()->with('success','POS shift closed.'); }
    public function hold(HoldPosSaleRequest $request): RedirectResponse { $hold=$this->service->hold($request->validated()); return back()->with('success',"Sale held as {$hold->reference}."); }
    public function holds(): Response { return Inertia::render('Admin/POS/Holds',['holds'=>HeldSale::with('customer','items.product')->where('user_id',auth()->id())->where('status','held')->latest()->paginate(20)]); }
    public function resume(HeldSale $heldSale): Response { abort_unless($heldSale->user_id===auth()->id() && $heldSale->status==='held',403); return Inertia::render('Admin/POS/Resume',['hold'=>$heldSale->load('customer','items.product')]); }
    public function destroyHold(HeldSale $heldSale): RedirectResponse { abort_unless($heldSale->user_id===auth()->id(),403); $heldSale->delete(); return back()->with('success','Held sale removed.'); }
    public function checkout(EnterprisePosCheckoutRequest $request): RedirectResponse { $sale=$this->service->checkout($request->validated()); return redirect()->route('admin.sales.show',$sale)->with('success','Enterprise POS sale completed.'); }
    public function drawer(Request $request, PosShift $shift): RedirectResponse { $data=$request->validate(['type'=>['required','in:cash_in,cash_out'],'amount'=>['required','numeric','min:0.01'],'note'=>['nullable','string','max:1000']]); $this->service->drawer($shift,$data['type'],(float)$data['amount'],$data['note']??null); return back()->with('success','Cash drawer transaction recorded.'); }
    public function report(PosShift $shift): Response { return Inertia::render('Admin/POS/ShiftReport',$this->service->shiftReport($shift)); }
}
