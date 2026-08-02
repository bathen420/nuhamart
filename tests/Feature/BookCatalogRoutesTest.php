<?php
namespace Tests\Feature;
use Tests\TestCase;
class BookCatalogRoutesTest extends TestCase
{
    public function test_storefront_and_book_catalog_routes_are_registered(): void
    {
        foreach (['home','storefront.catalog','storefront.products.show','storefront.author','storefront.publisher','admin.authors.index','admin.publishers.index'] as $name) {
            $this->assertTrue(app('router')->has($name), "Missing route: {$name}");
        }
    }
}
