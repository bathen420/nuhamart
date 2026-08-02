<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class PosCounter extends Model { protected $fillable=['name','code','is_active']; protected $casts=['is_active'=>'boolean']; public function shifts():HasMany{return $this->hasMany(PosShift::class,'counter_id');} }
