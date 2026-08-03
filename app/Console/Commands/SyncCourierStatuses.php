<?php
namespace App\Console\Commands;
use App\Models\CourierConsignment;
use App\Services\CourierService;
use Illuminate\Console\Command;
use Throwable;
class SyncCourierStatuses extends Command
{
    protected $signature = 'nuhamart:couriers-sync {--limit=100}';
    protected $description = 'Synchronize active courier consignment statuses';
    public function handle(CourierService $service): int
    {
        $failed = 0;
        CourierConsignment::query()->with('order')->whereNotIn('status', ['delivered','cancelled','returned'])->oldest('last_synced_at')->limit((int) $this->option('limit'))->get()->each(function ($item) use ($service, &$failed) {
            try { $service->sync($item); $this->line("Synced {$item->tracking_code}"); }
            catch (Throwable $e) { $failed++; $this->warn($e->getMessage()); }
        });
        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
