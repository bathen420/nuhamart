<?php
namespace App\Models; use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\SoftDeletes;
class Unit extends Model { use SoftDeletes; protected $fillable=['name','short_name','is_base','status']; protected $casts=['is_base'=>'boolean','status'=>'boolean']; public function variants(){return $this->hasMany(ProductVariant::class);} }
