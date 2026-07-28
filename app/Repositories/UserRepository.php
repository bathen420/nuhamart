<?php
namespace App\Repositories; use App\Models\User;
class UserRepository { public function paginate(array $filters){ return User::with('roles')->when($filters['search']??null,fn($q,$s)=>$q->where(fn($x)=>$x->where('name','like',"%$s%")->orWhere('email','like',"%$s%")->orWhere('username','like',"%$s%")))->latest()->paginate(15)->withQueryString(); } public function create(array $data): User{return User::create($data);} public function update(User $user,array $data): User{$user->update($data);return $user->fresh();} public function delete(User $user): void{$user->delete();} }
