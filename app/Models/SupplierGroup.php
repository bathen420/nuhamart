<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupplierGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'code', 'payment_terms_days', 'description', 'status', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'payment_terms_days' => 'integer',
            'status' => 'boolean',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
