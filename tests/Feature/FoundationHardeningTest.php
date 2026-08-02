<?php

namespace Tests\Feature;

use App\Http\Middleware\EnforceAdminPermission;
use App\Models\User;
use App\Services\SystemIntegrityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class FoundationHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_every_named_admin_route_has_a_permission_mapping(): void
    {
        $unmapped = [];

        foreach (app('router')->getRoutes() as $route) {
            $name = $route->getName();

            if ($name && str_starts_with($name, 'admin.') && EnforceAdminPermission::permissionForRouteName($name) === null) {
                $unmapped[] = $name;
            }
        }

        $this->assertSame([], array_values(array_unique($unmapped)), 'Unmapped admin routes: '.implode(', ', $unmapped));
    }

    public function test_user_without_dashboard_permission_is_forbidden(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_integrity_service_reports_a_clean_fresh_database(): void
    {
        $this->assertTrue(app(SystemIntegrityService::class)->isHealthy());
    }

    public function test_health_check_command_succeeds_on_a_clean_database(): void
    {
        $this->assertSame(0, Artisan::call('nuhamart:health-check'));
    }

    public function test_permission_mapping_uses_action_specific_permissions(): void
    {
        Permission::findOrCreate('categories.create');

        $this->assertSame('categories.view', EnforceAdminPermission::permissionForRouteName('admin.categories.index'));
        $this->assertSame('categories.create', EnforceAdminPermission::permissionForRouteName('admin.categories.store'));
        $this->assertSame('categories.edit', EnforceAdminPermission::permissionForRouteName('admin.categories.update'));
        $this->assertSame('categories.delete', EnforceAdminPermission::permissionForRouteName('admin.categories.destroy'));
    }
}
