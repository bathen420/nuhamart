<?php
namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class StoreStockTransferRequest extends FormRequest {
    public function authorize(): bool { return $this->user()?->can('stock-transfers.create') ?? false; }
    public function rules(): array { return [
        'from_warehouse_id'=>['required','exists:warehouses,id'],'to_warehouse_id'=>['required','different:from_warehouse_id','exists:warehouses,id'],
        'transfer_date'=>['required','date'],'note'=>['nullable','string','max:2000'],'items'=>['required','array','min:1'],
        'items.*.product_id'=>['required','distinct','exists:products,id'],'items.*.quantity'=>['required','integer','min:1'],
    ]; }
}