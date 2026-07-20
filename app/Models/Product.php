<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [

        'category_id',

        'brand_id',

        'name',

        'slug',

        'sku',

        'short_description',

        'description',

        'price',

        'discount_price',

        'stock_quantity',

        'image',

        'status',

        'sort_order',

    ];

    /**
     * Category Relationship
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Brand Relationship
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Order Items Relationship
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function stockHistories()
{
    return $this->hasMany(StockHistory::class);
}
}
