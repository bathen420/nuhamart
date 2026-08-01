<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    protected $fillable = ['code','name','type','parent_id','is_cash','is_bank','is_active','opening_balance','opening_balance_type','description'];
    protected $casts = ['is_cash'=>'boolean','is_bank'=>'boolean','is_active'=>'boolean','opening_balance'=>'decimal:2'];
    public function parent(): BelongsTo { return $this->belongsTo(self::class, 'parent_id'); }
    public function children(): HasMany { return $this->hasMany(self::class, 'parent_id'); }
    public function journalLines(): HasMany { return $this->hasMany(JournalLine::class); }
    public function getCurrentBalanceAttribute(): float
    {
        $debit = (float) $this->journalLines()->sum('debit');
        $credit = (float) $this->journalLines()->sum('credit');
        $opening = (float) $this->opening_balance * ($this->opening_balance_type === 'credit' ? -1 : 1);
        return round($opening + $debit - $credit, 2);
    }
}
