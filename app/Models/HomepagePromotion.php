<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepagePromotion extends Model
{
    protected $fillable = [
        'title', 'title_bn', 'subtitle', 'subtitle_bn', 'button_text', 'button_text_bn', 'button_url', 'image', 'theme',
        'sort_order', 'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];
}
