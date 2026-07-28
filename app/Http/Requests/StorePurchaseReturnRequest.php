<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest; use Illuminate\Validation\Rule;
class StorePurchaseReturnRequest extends FormRequest {
 public function authorize(): bool{return auth()->check();}
 public function rules(): array{return [
  'return_date'=>['required','date'], 'refund_method'=>['required',Rule::in(['cash','bank_transfer','supplier_adjustment','replacement'])],
  'reason'=>['nullable','string','max:2000'], 'items'=>['required','array','min:1'],
  'items.*.purchase_item_id'=>['required','integer','exists:purchase_items,id','distinct'], 'items.*.quantity'=>['required','integer','min:0'],
 ];}
}