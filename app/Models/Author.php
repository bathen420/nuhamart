<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    use HasLocalizedContent;
    protected $fillable = ['name', 'name_bn', 'slug', 'biography', 'biography_bn', 'photo', 'status', 'sort_order'];

    protected $casts = ['status' => 'boolean'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
