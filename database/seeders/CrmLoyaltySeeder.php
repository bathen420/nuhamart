<?php
namespace Database\Seeders;
use App\Models\LoyaltyTier;
use Illuminate\Database\Seeder;
class CrmLoyaltySeeder extends Seeder
{public function run():void{foreach([['Bronze',0,0,0,1],['Silver',25000,250,2,2],['Gold',75000,750,5,3],['Platinum',200000,2000,8,4],['VIP',500000,5000,10,5]] as [$name,$spend,$points,$discount,$order])LoyaltyTier::updateOrCreate(['name'=>$name],['minimum_spend'=>$spend,'minimum_points'=>$points,'discount_percent'=>$discount,'sort_order'=>$order,'is_active'=>true]);}}
