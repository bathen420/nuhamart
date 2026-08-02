<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreAuthorRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return [
'name_bn'=>['nullable','string','max:255'],'biography_bn'=>['nullable','string'],'name'=>['required','string','max:255'],'biography'=>['nullable','string'],'status'=>['required','boolean'],'sort_order'=>['nullable','integer','min:0']]; }
}
