<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourierConsignment extends Model
{
    protected $fillable = [
        'order_id','provider','external_id','tracking_code','status','cod_amount',
        'request_payload','response_payload','last_error','last_synced_at',
    ];

    protected $casts = [
        'cod_amount' => 'decimal:2',
        'request_payload' => 'array',
        'response_payload' => 'array',
        'last_synced_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
