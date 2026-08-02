<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageBanner extends Model
{
    protected $fillable = [
        'badge', 'badge_bn', 'title', 'title_bn', 'highlight', 'highlight_bn', 'subtitle', 'subtitle_bn', 'primary_button_text', 'primary_button_text_bn',
        'primary_button_url', 'secondary_button_text', 'secondary_button_text_bn', 'secondary_button_url',
        'image', 'background_from', 'background_to', 'text_color',
        'sort_order', 'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];
}
