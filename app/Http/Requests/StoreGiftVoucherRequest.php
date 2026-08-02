<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class StoreGiftVoucherRequest extends FormRequest
{public function authorize():bool{return true;} public function rules():array{return ['code'=>['required','string','max:50','unique:gift_vouchers,code'],'name'=>['required','string','max:255'],'discount_type'=>['required',Rule::in(['fixed','percentage'])],'value'=>['required','numeric','gt:0'],'minimum_order'=>['nullable','numeric','min:0'],'usage_limit'=>['nullable','integer','min:1'],'starts_at'=>['nullable','date'],'expires_at'=>['nullable','date','after_or_equal:starts_at'],'is_active'=>['boolean']];}}
