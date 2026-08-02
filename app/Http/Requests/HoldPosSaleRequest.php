<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class HoldPosSaleRequest extends FormRequest { public function authorize():bool{return auth()->check();} public function rules():array{return ['customer_id'=>['nullable','integer','exists:customers,id'],'discount'=>['nullable','numeric','min:0'],'tax'=>['nullable','numeric','min:0'],'shipping'=>['nullable','numeric','min:0'],'note'=>['nullable','string','max:1000'],'items'=>['required','array','min:1'],'items.*.product_id'=>['required','integer','exists:products,id','distinct'],'items.*.quantity'=>['required','integer','min:1']];} }
