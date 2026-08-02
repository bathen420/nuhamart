<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedContent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    use HasLocalizedContent;

    protected $fillable = [
        'name',
        'name_bn',
        'slug',
        'description',
        'description_bn',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}