<?php
namespace App\Http\Requests; use Illuminate\Foundation\Http\FormRequest; use Illuminate\Validation\Rule;
class UpdateUnitRequest extends FormRequest { public function authorize():bool{return $this->user()->can('units.edit');} public function rules():array{return ['name'=>['required','string','max:100'],'short_name'=>['required','string','max:20',Rule::unique('units','short_name')->ignore($this->route('unit'))],'is_base'=>['boolean'],'status'=>['boolean']];}}
