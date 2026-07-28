<?php
namespace App\Http\Controllers\Admin; use App\Http\Controllers\Controller; use Inertia\Inertia; use Spatie\Permission\Models\Permission;
class PermissionController extends Controller { public function index(){return Inertia::render('Admin/Permissions/Index',['permissionGroups'=>Permission::orderBy('name')->get()->groupBy(fn($p)=>explode('.',$p->name)[0])]);} }
