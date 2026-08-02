<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedContent;

use Illuminate\Database\Eloquent\Model;



class Category extends Model
{
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

    public function products()
        {
            return $this->hasMany(Product::class);
        }

}

