<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class HomepageBanner extends Model
{
    protected $fillable = [
        'badge', 'badge_bn', 'title', 'title_bn', 'highlight', 'highlight_bn', 'subtitle', 'subtitle_bn', 'primary_button_text', 'primary_button_text_bn',
        'primary_button_url', 'secondary_button_text', 'secondary_button_text_bn', 'secondary_button_url',
        'image', 'mobile_image', 'background_from', 'background_to', 'text_color',
        'sort_order', 'is_active', 'starts_at', 'ends_at',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->where(fn (Builder $q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn (Builder $q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()));
    }
}
