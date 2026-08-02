<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class AdjustCustomerPointsRequest extends FormRequest
{public function authorize():bool{return true;} public function rules():array{return ['points'=>['required','integer','between:-1000000,1000000','not_in:0'],'note'=>['required','string','max:1000']];}}
