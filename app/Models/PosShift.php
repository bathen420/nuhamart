<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class PosShift extends Model { protected $fillable=['counter_id','user_id','opening_cash','closing_cash','expected_cash','cash_difference','opened_at','closed_at','status','opening_note','closing_note']; protected $casts=['opening_cash'=>'decimal:2','closing_cash'=>'decimal:2','expected_cash'=>'decimal:2','cash_difference'=>'decimal:2','opened_at'=>'datetime','closed_at'=>'datetime']; public function counter():BelongsTo{return $this->belongsTo(PosCounter::class,'counter_id');} public function user():BelongsTo{return $this->belongsTo(User::class);} public function payments():HasMany{return $this->hasMany(SalePayment::class,'shift_id');} public function drawerTransactions():HasMany{return $this->hasMany(CashDrawerTransaction::class,'shift_id');} }
