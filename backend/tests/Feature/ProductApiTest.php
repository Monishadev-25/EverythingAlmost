<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test products listing returns success.
     */
    public function test_can_list_products(): void
    {
        Product::create([
            'name' => 'Test Gift Box',
            'slug' => 'test-gift-box',
            'price' => 29.99,
            'category' => 'Personalised Gifts',
            'rating' => 5.0,
            'reviews_count' => 1,
            'in_stock' => true,
        ]);

        $response = $this->getJson('/api/products');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'price',
                        'category',
                        'rating',
                        'reviews_count',
                    ],
                ],
            ]);
    }

    /**
     * Test featured products endpoint.
     */
    public function test_can_fetch_featured_products(): void
    {
        $response = $this->getJson('/api/products/featured');

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    /**
     * Test categories listing.
     */
    public function test_can_fetch_categories(): void
    {
        $response = $this->getJson('/api/products/categories');

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    /**
     * Test single product lookup by slug.
     */
    public function test_can_fetch_single_product_by_slug(): void
    {
        Product::create([
            'name' => 'Custom Keepsake',
            'slug' => 'custom-keepsake',
            'price' => 39.99,
            'category' => 'Personalised Gifts',
            'rating' => 5.0,
            'reviews_count' => 1,
            'in_stock' => true,
        ]);

        $response = $this->getJson('/api/products/custom-keepsake');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'custom-keepsake');
    }
}
