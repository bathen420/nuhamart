<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CashDrawerTransaction extends Model { protected $fillable=['shift_id','user_id','type','amount','reference','note']; protected $casts=['amount'=>'decimal:2']; public function shift():BelongsTo{return $this->belongsTo(PosShift::class);} public function user():BelongsTo{return $this->belongsTo(User::class);} }
