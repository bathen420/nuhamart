<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Schema;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_no',
        'customer_id',
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'division',
        'district',
        'area',
        'address',
        'note',
        'subtotal',
        'shipping_charge',
        'shipping_method',
        'courier_name',
        'tracking_number',
        'admin_note',
        'discount',
        'coupon_id',
        'coupon_code',
        'total',
        'payment_method',
        'payment_reference',
        'payment_status',
        'status',
        'ordered_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_charge' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'ordered_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    protected static function booted(): void
    {
        static::created(function (Order $order) {
            if (Schema::hasTable('order_status_histories')) {
                $order->statusHistories()->create([
                    'status' => $order->status,
                    'title' => 'Order placed',
                    'note' => 'Your order has been received.',
                    'changed_by' => auth()->id(),
                    'recorded_at' => now(),
                ]);
            }
        });

        static::updated(function (Order $order) {
            if ($order->wasChanged('status') && Schema::hasTable('order_status_histories')) {
                $order->statusHistories()->create([
                    'status' => $order->status,
                    'title' => ucfirst(str_replace('_', ' ', $order->status)),
                    'note' => null,
                    'changed_by' => auth()->id(),
                    'recorded_at' => now(),
                ]);
            }
        });
    }
}
