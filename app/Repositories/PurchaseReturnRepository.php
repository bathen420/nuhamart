<?php
namespace App\Repositories;
use App\Models\PurchaseReturn; use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class PurchaseReturnRepository {
 public function paginate(array $filters=[],int $perPage=15): LengthAwarePaginator{return PurchaseReturn::query()->with(['purchase:id,purchase_number','supplier:id,name','user:id,name'])
 ->when($filters['search']??null,function($q,$s){$q->where(function($x)use($s){$x->where('return_number','like',"%{$s}%")->orWhereHas('purchase',fn($p)=>$p->where('purchase_number','like',"%{$s}%"))->orWhereHas('supplier',fn($p)=>$p->where('name','like',"%{$s}%"));});})
 ->latest('id')->paginate($perPage)->withQueryString();}
 public function create(array $data): PurchaseReturn{return PurchaseReturn::create($data);} public function generateReturnNumber(): string{$n=(PurchaseReturn::max('id')??0)+1;return 'PRN-'.now()->format('Ymd').'-'.str_pad((string)$n,5,'0',STR_PAD_LEFT);}
}