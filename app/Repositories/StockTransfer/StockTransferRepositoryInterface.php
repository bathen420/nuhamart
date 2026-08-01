<?php
namespace App\Repositories\StockTransfer;
use App\Models\StockTransfer;
interface StockTransferRepositoryInterface {
    public function paginate(array $filters=[]);
    public function create(array $data): StockTransfer;
    public function findWithRelations(StockTransfer $transfer): StockTransfer;
}