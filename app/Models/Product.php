<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedContent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasLocalizedContent;

    protected $fillable = [

        'category_id',

        'brand_id',

        'author_id',

        'publisher_id',

        'name',
        'name_bn',

        'slug',

        'sku',

        'barcode',

        'barcode_type',

        'product_type',

        'isbn',

        'edition',

        'language',

        'pages',

        'publication_year',

        'binding',

        'weight',

        'dimensions',

        'short_description',
        'short_description_bn',

        'description',
        'seo_title',
        'seo_description',
        'description_bn',

        'price',

        'discount_price',

        'ebook_price',

        'stock_quantity',

        'image',
        'gallery_images',
        'sample_file',

        'status',

        'is_featured',

        'is_new_arrival',

        'is_best_seller',

        'sort_order',

    ];


    protected $casts = [
        'gallery_images' => 'array',
        'status' => 'boolean',
        'is_featured' => 'boolean',
        'is_new_arrival' => 'boolean',
        'is_best_seller' => 'boolean',
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

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
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

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
 * Sale Items Relationship
 */
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
    
}
