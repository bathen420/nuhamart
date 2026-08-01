<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateAccountRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('accounts.edit') ?? false; }
 public function rules(): array { $id=$this->route('account')?->id; return ['code'=>['required','string','max:30',Rule::unique('accounts','code')->ignore($id)],'name'=>'required|string|max:150','type'=>'required|in:asset,liability,equity,income,expense','parent_id'=>['nullable','exists:accounts,id',Rule::notIn([$id])],'opening_balance'=>'nullable|numeric|min:0','opening_balance_type'=>'required|in:debit,credit','is_cash'=>'boolean','is_bank'=>'boolean','is_active'=>'boolean','description'=>'nullable|string|max:1000']; }
}
