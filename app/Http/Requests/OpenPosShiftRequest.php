<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class OpenPosShiftRequest extends FormRequest { public function authorize():bool{return auth()->check();} public function rules():array{return ['counter_id'=>['required','integer','exists:pos_counters,id'],'opening_cash'=>['required','numeric','min:0'],'opening_note'=>['nullable','string','max:1000']];} }
