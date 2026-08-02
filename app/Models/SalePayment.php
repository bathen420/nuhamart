<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class SalePayment extends Model { protected $fillable=['sale_id','shift_id','method','amount','reference','meta']; protected $casts=['amount'=>'decimal:2','meta'=>'array']; public function sale():BelongsTo{return $this->belongsTo(Sale::class);} public function shift():BelongsTo{return $this->belongsTo(PosShift::class);} }
