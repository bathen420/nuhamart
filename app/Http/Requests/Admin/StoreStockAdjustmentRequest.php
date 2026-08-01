<?php
namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
class StoreStockAdjustmentRequest extends FormRequest {
    public function authorize(): bool { return $this->user()?->can('stock-adjustments.create') ?? false; }
    public function rules(): array { return [
        'warehouse_id'=>['required','exists:warehouses,id'],'adjustment_date'=>['required','date'],'note'=>['nullable','string','max:2000'],
        'items'=>['required','array','min:1'],'items.*.product_id'=>['required','distinct','exists:products,id'],
        'items.*.direction'=>['required','in:increase,decrease'],'items.*.quantity'=>['required','integer','min:1'],
        'items.*.reason'=>['required','string','max:100'],'items.*.unit_cost'=>['nullable','numeric','min:0'],
    ]; }
}