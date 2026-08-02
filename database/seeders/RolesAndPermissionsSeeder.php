<?php

namespace Database\Seeders;

use App\Models\PosCounter;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $modules = [
            'dashboard' => ['view'],
            'homepage-content' => ['view', 'manage'],
            'categories' => ['view', 'create', 'edit', 'delete'],
            'brands' => ['view', 'create', 'edit', 'delete'],
            'authors' => ['view', 'create', 'edit', 'delete'],
            'publishers' => ['view', 'create', 'edit', 'delete'],
            'warehouses' => ['view', 'create', 'edit', 'delete'],
            'customer-groups' => ['view', 'create', 'edit', 'delete'],
            'supplier-groups' => ['view', 'create', 'edit', 'delete'],
            'products' => ['view', 'create', 'edit', 'delete', 'print', 'export'],
            'barcode-labels' => ['view', 'generate', 'print'],
            'units' => ['view', 'create', 'edit', 'delete'],
            'product-variants' => ['view', 'create', 'edit', 'delete', 'print'],
            'customers' => ['view', 'create', 'edit', 'delete'],
            'crm' => ['view', 'manage'],
            'loyalty' => ['manage'],
            'wallet' => ['manage'],
            'vouchers' => ['manage'],
            'suppliers' => ['view', 'create', 'edit', 'delete'],
            'purchase-requisitions' => ['view', 'create', 'approve'],
            'purchase-orders' => ['view', 'create', 'approve'],
            'goods-receipts' => ['view', 'create'],
            'supplier-statements' => ['view'],
            'purchases' => ['view', 'create', 'edit', 'delete', 'print'],
            'purchase-returns' => ['view', 'create', 'print'],
            'pos' => ['view', 'create', 'hold', 'manage-shifts', 'manage-drawer', 'view-reports'],
            'orders' => ['view', 'create', 'edit', 'delete', 'print'],
            'sales' => ['view', 'delete', 'print'],
            'sale-returns' => ['view', 'create', 'print'],
            'opening-stocks' => ['view', 'create'],
            'stock-adjustments' => ['view', 'create', 'approve'],
            'stock-transfers' => ['view', 'create', 'dispatch', 'receive'],
            'stock-ledger' => ['view'],
            'stock-history' => ['view'],
            'reports' => ['view', 'export'],
            'accounts' => ['view', 'create', 'edit', 'delete'],
            'journals' => ['view', 'create'],
            'ledger' => ['view'],
            'financial-statements' => ['view', 'export'],
            'settings' => ['view', 'edit'],
            'users' => ['view', 'create', 'edit', 'delete'],
            'roles' => ['view', 'create', 'edit', 'delete'],
            'permissions' => ['view'],
            'activity-logs' => ['view', 'export'],
            'notifications' => ['view', 'delete'],
            'profile' => ['edit'],
        ];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                    'guard_name' => 'web',
                ]);
            }
        }

        $superAdminRole = Role::firstOrCreate([
            'name' => 'Super Admin',
            'guard_name' => 'web',
        ]);
        $superAdminRole->syncPermissions(Permission::all());

        foreach (['Admin', 'Manager', 'Accountant', 'Cashier', 'Store Keeper'] as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        $admin = User::query()
            ->where('username', 'admin')
            ->orWhere('email', 'admin@nuhamartbd.com')
            ->first();

        if ($admin) {
            $admin->forceFill([
                'name' => 'Super Admin',
                'username' => 'admin',
                'email' => 'admin@nuhamartbd.com',
                'is_active' => true,
                'email_verified_at' => $admin->email_verified_at ?: now(),
            ])->save();
        } else {
            $admin = User::create([
                'name' => 'Super Admin',
                'username' => 'admin',
                'email' => 'admin@nuhamartbd.com',
                'phone' => null,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }

        $admin->syncRoles([$superAdminRole]);

        PosCounter::firstOrCreate(
            ['code' => 'MAIN'],
            ['name' => 'Main Counter', 'is_active' => true],
        );

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
