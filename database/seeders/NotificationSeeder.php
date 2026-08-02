<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->where('email', 'admin@nuhamartbd.com')->first() ?? User::query()->first();

        if (!$user) {
            return;
        }

        $items = [
            ['title' => 'Welcome to Nuha Mart BD v3.3.2', 'message' => 'The enterprise notification centre is ready to use.', 'type' => 'success', 'icon' => 'bell', 'url' => '/admin/notifications'],
            ['title' => 'Low stock alert', 'message' => 'Review products that have reached their reorder level.', 'type' => 'warning', 'icon' => 'triangle-alert', 'url' => '/admin/dashboard'],
            ['title' => 'Security centre active', 'message' => 'Role permissions and activity logs are enabled.', 'type' => 'info', 'icon' => 'shield-check', 'url' => '/admin/activity-logs'],
        ];

        foreach ($items as $item) {
            Notification::query()->firstOrCreate([
                'user_id' => $user->getKey(),
                'title' => $item['title'],
            ], [
                ...$item,
                'is_read' => false,
                'read_at' => null,
            ]);
        }
    }
}
