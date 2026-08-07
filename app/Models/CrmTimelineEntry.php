<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmTimelineEntry extends Model
{
    protected $fillable = [
        'customer_id',
        'user_id',
        'type',
        'title',
        'description',
        'reference_type',
        'reference_id',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
