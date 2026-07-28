<?php
namespace App\Repositories; use Spatie\Permission\Models\Role;
class RoleRepository { public function all(){return Role::withCount('permissions')->orderBy('name')->get();} public function create(array $data):Role{return Role::create(['name'=>$data['name'],'guard_name'=>'web']);} public function update(Role $role,array $data):Role{$role->update(['name'=>$data['name']]);return $role;} public function delete(Role $role):void{$role->delete();} }
