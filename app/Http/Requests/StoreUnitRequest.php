<?php
namespace App\Http\Requests; use Illuminate\Foundation\Http\FormRequest;
class StoreUnitRequest extends FormRequest { public function authorize():bool{return $this->user()->can('units.create');} public function rules():array{return ['name'=>['required','string','max:100'],'short_name'=>['required','string','max:20','unique:units,short_name'],'is_base'=>['boolean'],'status'=>['boolean']];}}
