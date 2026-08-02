<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class HeldSale extends Model { protected $fillable=['reference','shift_id','customer_id','user_id','discount','tax','shipping','note','status']; protected $casts=['discount'=>'decimal:2','tax'=>'decimal:2','shipping'=>'decimal:2']; public function items():HasMany{return $this->hasMany(HeldSaleItem::class);} public function customer():BelongsTo{return $this->belongsTo(Customer::class);} public function shift():BelongsTo{return $this->belongsTo(PosShift::class);} }
