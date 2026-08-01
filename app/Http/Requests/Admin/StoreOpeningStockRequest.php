<?php
namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
class StoreOpeningStockRequest extends FormRequest {
    public function authorize(): bool { return true; }
    public function rules(): array { return [
        'warehouse_id'=>['required','exists:warehouses,id'], 'opening_date'=>['required','date'], 'note'=>['nullable','string','max:2000'],
        'items'=>['required','array','min:1'], 'items.*.product_id'=>['required','distinct','exists:products,id'],
        'items.*.quantity'=>['required','integer','min:1'], 'items.*.unit_cost'=>['required','numeric','min:0'],
    ]; }
}
