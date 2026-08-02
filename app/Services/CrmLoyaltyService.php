<?php

namespace App\Services;

use App\Models\CrmTimelineEntry;
use App\Models\Customer;
use App\Models\CustomerCrmProfile;
use App\Models\LoyaltyTier;
use App\Models\LoyaltyTransaction;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CrmLoyaltyService
{
    public function profile(Customer $customer): CustomerCrmProfile
    {
        $defaultTier = LoyaltyTier::query()->where('is_active', true)->orderBy('sort_order')->first();
        return CustomerCrmProfile::firstOrCreate(
            ['customer_id' => $customer->id],
            ['membership_number' => 'NM-'.str_pad((string)$customer->id, 8, '0', STR_PAD_LEFT), 'loyalty_tier_id' => $defaultTier?->id]
        );
    }

    public function recordSale(Sale $sale, ?int $userId = null): void
    {
        if (! $sale->customer_id) return;
        DB::transaction(function () use ($sale, $userId) {
            $customer = Customer::query()->lockForUpdate()->findOrFail($sale->customer_id);
            $profile = CustomerCrmProfile::query()->lockForUpdate()->where('customer_id',$customer->id)->first() ?? $this->profile($customer);
            if (LoyaltyTransaction::where('sale_id',$sale->id)->where('type','earn')->exists()) return;
            $points = max(0, (int) floor((float)$sale->total / 100));
            if ($points > 0) {
                $profile->points_balance += $points;
                $profile->lifetime_points += $points;
            }
            $profile->last_purchase_at = now();
            $profile->save();
            if ($points > 0) LoyaltyTransaction::create(['customer_id'=>$customer->id,'sale_id'=>$sale->id,'user_id'=>$userId,'type'=>'earn','points'=>$points,'balance_after'=>$profile->points_balance,'reference'=>$sale->sale_number,'note'=>'Points earned from sale.']);
            $this->updateTier($customer, $profile);
            $this->timeline($customer,'sale','Sale completed',"Sale {$sale->sale_number} completed for ৳".number_format((float)$sale->total,2),Sale::class,$sale->id,$userId);
        });
    }

    public function recordSaleReturn(SaleReturn $saleReturn, ?int $userId = null): void
    {
        if (! $saleReturn->customer_id) return;
        DB::transaction(function () use ($saleReturn, $userId) {
            if (LoyaltyTransaction::where('sale_return_id',$saleReturn->id)->exists()) return;
            $customer=Customer::query()->lockForUpdate()->findOrFail($saleReturn->customer_id);
            $profile=CustomerCrmProfile::query()->lockForUpdate()->where('customer_id',$customer->id)->first() ?? $this->profile($customer);
            $points=min($profile->points_balance,max(0,(int)floor((float)$saleReturn->subtotal/100)));
            $profile->points_balance -= $points;
            $profile->save();
            if($points>0) LoyaltyTransaction::create(['customer_id'=>$customer->id,'sale_return_id'=>$saleReturn->id,'user_id'=>$userId,'type'=>'reverse','points'=>-$points,'balance_after'=>$profile->points_balance,'reference'=>$saleReturn->return_number,'note'=>'Points reversed for sales return.']);
            $this->timeline($customer,'sale_return','Sales return completed',"Return {$saleReturn->return_number} for ৳".number_format((float)$saleReturn->subtotal,2),SaleReturn::class,$saleReturn->id,$userId);
        });
    }

    public function adjustPoints(Customer $customer, int $points, string $note, ?int $userId): CustomerCrmProfile
    {
        return DB::transaction(function() use($customer,$points,$note,$userId){
            $profile=CustomerCrmProfile::query()->lockForUpdate()->where('customer_id',$customer->id)->first() ?? $this->profile($customer);
            if($profile->points_balance+$points<0) throw ValidationException::withMessages(['points'=>'Insufficient points balance.']);
            $profile->points_balance += $points;
            if($points>0) $profile->lifetime_points += $points;
            $profile->save();
            LoyaltyTransaction::create(['customer_id'=>$customer->id,'user_id'=>$userId,'type'=>'manual','points'=>$points,'balance_after'=>$profile->points_balance,'note'=>$note]);
            $this->updateTier($customer,$profile);
            return $profile->fresh('tier');
        });
    }

    public function adjustWallet(Customer $customer, float $amount, string $type, string $note, ?int $userId): CustomerCrmProfile
    {
        return DB::transaction(function() use($customer,$amount,$type,$note,$userId){
            $profile=CustomerCrmProfile::query()->lockForUpdate()->where('customer_id',$customer->id)->first() ?? $this->profile($customer);
            $signed=$type==='credit'?abs($amount):-abs($amount);
            if((float)$profile->wallet_balance+$signed<0) throw ValidationException::withMessages(['amount'=>'Insufficient wallet balance.']);
            $profile->wallet_balance=round((float)$profile->wallet_balance+$signed,2); $profile->save();
            WalletTransaction::create(['customer_id'=>$customer->id,'user_id'=>$userId,'type'=>$type,'amount'=>abs($amount),'balance_after'=>$profile->wallet_balance,'note'=>$note]);
            $this->timeline($customer,'wallet','Wallet '.ucfirst($type),"৳".number_format(abs($amount),2)." {$type}",null,null,$userId);
            return $profile->fresh('tier');
        });
    }

    public function timeline(Customer $customer,string $type,string $title,?string $description=null,?string $referenceType=null,?int $referenceId=null,?int $userId=null): CrmTimelineEntry
    { return CrmTimelineEntry::create(['customer_id'=>$customer->id,'user_id'=>$userId,'type'=>$type,'title'=>$title,'description'=>$description,'reference_type'=>$referenceType,'reference_id'=>$referenceId]); }

    private function updateTier(Customer $customer, CustomerCrmProfile $profile): void
    {
        $spend=(float)$customer->sales()->sum('total');
        $tier=LoyaltyTier::query()->where('is_active',true)->where('minimum_spend','<=',$spend)->where('minimum_points','<=',$profile->lifetime_points)->orderByDesc('sort_order')->first();
        if($tier && $profile->loyalty_tier_id!==$tier->id){$profile->loyalty_tier_id=$tier->id;$profile->save();}
    }
}
