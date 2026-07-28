<?php

namespace Tests\Feature;

use App\Models\CustomerGroup;
use App\Models\SupplierGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CustomerSupplierGroupModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorised_user_can_create_customer_group(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        Permission::findOrCreate('customer-groups.create');
        $user->givePermissionTo('customer-groups.create');

        $this->actingAs($user)->post(route('admin.customer-groups.store'), [
            'name' => 'Retail',
            'code' => 'RETAIL',
            'discount_type' => 'percentage',
            'discount_value' => 5,
            'credit_limit' => 10000,
            'description' => 'Retail customers',
            'status' => true,
        ])->assertRedirect(route('admin.customer-groups.index'));

        $this->assertDatabaseHas('customer_groups', ['code' => 'RETAIL']);
    }

    public function test_authorised_user_can_create_supplier_group(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        Permission::findOrCreate('supplier-groups.create');
        $user->givePermissionTo('supplier-groups.create');

        $this->actingAs($user)->post(route('admin.supplier-groups.store'), [
            'name' => 'Local Supplier',
            'code' => 'LOCAL',
            'payment_terms_days' => 30,
            'description' => 'Local suppliers',
            'status' => true,
        ])->assertRedirect(route('admin.supplier-groups.index'));

        $this->assertDatabaseHas('supplier_groups', ['code' => 'LOCAL']);
    }
}
