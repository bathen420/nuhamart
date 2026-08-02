<?php

namespace App\Console\Commands;

use App\Services\SystemIntegrityService;
use Illuminate\Console\Command;

class NuhaMartHealthCheck extends Command
{
    protected $signature = 'nuhamart:health-check';

    protected $description = 'Run non-destructive Nuha Mart BD database and accounting integrity checks';

    public function handle(SystemIntegrityService $integrity): int
    {
        $checks = $integrity->run();

        $this->newLine();
        $this->info('Nuha Mart BD system integrity report');
        $this->table(
            ['Check', 'Status', 'Issues', 'Description'],
            collect($checks)->map(fn (array $check) => [
                $check['name'],
                $check['status'],
                $check['count'],
                $check['message'],
            ])->all()
        );

        if (! $integrity->isHealthy()) {
            $this->error('One or more integrity checks failed. No data was changed.');

            return self::FAILURE;
        }

        $this->info('All integrity checks passed.');

        return self::SUCCESS;
    }
}
