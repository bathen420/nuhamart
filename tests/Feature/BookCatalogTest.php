<?php
namespace Tests\Feature;
use App\Models\Author;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Publisher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class BookCatalogTest extends TestCase
{
    use RefreshDatabase;
    public function test_catalog_search_finds_book_by_isbn_and_author(): void
    {
        $category=Category::create(['name'=>'Books','slug'=>'books','status'=>true,'sort_order'=>0]);
        $brand=Brand::create(['name'=>'Books','slug'=>'books-brand','status'=>true,'sort_order'=>0]);
        $author=Author::create(['name'=>'Test Author','slug'=>'test-author','status'=>true,'sort_order'=>0]);
        $publisher=Publisher::create(['name'=>'Test Publisher','slug'=>'test-publisher','status'=>true,'sort_order'=>0]);
        Product::create(['category_id'=>$category->id,'brand_id'=>$brand->id,'author_id'=>$author->id,'publisher_id'=>$publisher->id,'name'=>'Laravel Book','slug'=>'laravel-book','sku'=>'BOOK-1','isbn'=>'9781234567890','product_type'=>'physical','price'=>500,'stock_quantity'=>5,'status'=>true,'is_featured'=>true,'is_new_arrival'=>true,'is_best_seller'=>false,'sort_order'=>0]);
        $this->get(route('storefront.catalog',['search'=>'9781234567890']))->assertOk()->assertInertia(fn($page)=>$page->component('Storefront/Catalog')->has('products.data',1));
        $this->get(route('storefront.catalog',['search'=>'Test Author']))->assertOk()->assertInertia(fn($page)=>$page->has('products.data',1));
    }
}
