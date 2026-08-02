<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class ClosePosShiftRequest extends FormRequest { public function authorize():bool{return auth()->check();} public function rules():array{return ['closing_cash'=>['required','numeric','min:0'],'closing_note'=>['nullable','string','max:1000']];} }
