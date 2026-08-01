<?php
namespace App\Repositories\OpeningStock;
use App\Models\OpeningStock;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
interface OpeningStockRepositoryInterface {
    public function paginate(array $filters=[]): LengthAwarePaginator;
    public function create(array $data): OpeningStock;
    public function findWithRelations(OpeningStock $openingStock): OpeningStock;
}
