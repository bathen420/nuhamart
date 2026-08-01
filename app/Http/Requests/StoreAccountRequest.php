<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreAccountRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('accounts.create') ?? false; }
 public function rules(): array { return ['code'=>'required|string|max:30|unique:accounts,code','name'=>'required|string|max:150','type'=>'required|in:asset,liability,equity,income,expense','parent_id'=>'nullable|exists:accounts,id','opening_balance'=>'nullable|numeric|min:0','opening_balance_type'=>'required|in:debit,credit','is_cash'=>'boolean','is_bank'=>'boolean','is_active'=>'boolean','description'=>'nullable|string|max:1000']; }
}
