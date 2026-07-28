<?php

namespace App\Console\Commands;

use App\Services\DashboardService;
use Illuminate\Console\Command;

class ClearDashboardCache extends Command
{
    protected $signature = 'dashboard:clear-cache';

    protected $description = 'Clear the NuhaMart dashboard analytics cache';

    public function handle(DashboardService $dashboardService): int
    {
        $dashboardService->clearCache();

        $this->components->info('Dashboard analytics cache cleared successfully.');

        return self::SUCCESS;
    }
}
