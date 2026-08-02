<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class AdjustCustomerWalletRequest extends FormRequest
{public function authorize():bool{return true;} public function rules():array{return ['type'=>['required',Rule::in(['credit','debit'])],'amount'=>['required','numeric','gt:0','max:999999999'],'note'=>['required','string','max:1000']];}}
