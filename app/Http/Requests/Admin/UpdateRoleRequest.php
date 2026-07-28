<?php
namespace App\Http\Requests\Admin; use Illuminate\Foundation\Http\FormRequest; use Illuminate\Validation\Rule;
class UpdateRoleRequest extends FormRequest { public function authorize(): bool{return true;} public function rules(): array{$role=$this->route('role'); return ['name'=>['required','string','max:100',Rule::unique('roles','name')->where('guard_name','web')->ignore($role)],'permissions'=>['array'],'permissions.*'=>['exists:permissions,name']];} }
