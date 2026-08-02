<?php
namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class StoreCouponRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $id = $this->route('coupon')?->id;
        return [
            'marketing_campaign_id'=>['nullable','exists:marketing_campaigns,id'],
            'code'=>['required','string','max:50',Rule::unique('coupons','code')->ignore($id)],
            'name'=>['required','string','max:150'],
            'type'=>['required',Rule::in(['percentage','fixed','free_shipping'])],
            'value'=>['required_unless:type,free_shipping','numeric','min:0'],
            'minimum_order'=>['nullable','numeric','min:0'],
            'maximum_discount'=>['nullable','numeric','min:0'],
            'scope_type'=>['required',Rule::in(['all','product','category','brand'])],
            'scope_ids'=>['nullable','array'], 'scope_ids.*'=>['integer'],
            'usage_limit'=>['nullable','integer','min:1'],
            'per_customer_limit'=>['required','integer','min:1'],
            'starts_at'=>['nullable','date'], 'ends_at'=>['nullable','date','after_or_equal:starts_at'],
            'is_active'=>['required','boolean'],
        ];
    }
    protected function prepareForValidation(): void
    {
        $this->merge(['code'=>strtoupper(trim((string)$this->code)), 'is_active'=>$this->boolean('is_active')]);
    }
}
