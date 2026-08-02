<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CrmTimelineEntry extends Model
{
    protected $fillable=['customer_id','user_id','type','title','description','reference_type','reference_id'];
}
