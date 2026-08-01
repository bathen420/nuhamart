<?php
namespace App\Repositories\StockAdjustment;
use App\Models\StockAdjustment;
interface StockAdjustmentRepositoryInterface {
    public function paginate(array $filters=[]);
    public function create(array $data): StockAdjustment;
    public function findWithRelations(StockAdjustment $adjustment): StockAdjustment;
}