<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'gateway',
        'attempt_no',
        'transaction_id',
        'session_key',
        'validation_id',
        'bank_transaction_id',
        'amount',
        'currency',
        'status',
        'callback_count',
        'risk_level',
        'gateway_url',
        'request_payload',
        'response_payload',
        'callback_payload',
        'failure_reason',
        'initiated_at',
        'paid_at',
        'failed_at',
        'last_verified_at',
        'last_callback_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'attempt_no' => 'integer',
        'callback_count' => 'integer',
        'request_payload' => 'array',
        'response_payload' => 'array',
        'callback_payload' => 'array',
        'initiated_at' => 'datetime',
        'paid_at' => 'datetime',
        'failed_at' => 'datetime',
        'last_verified_at' => 'datetime',
        'last_callback_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
