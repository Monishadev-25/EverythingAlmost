<?php

namespace Tests\Feature;

use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    /**
     * Test admin statistics endpoint returns valid metrics.
     */
    public function test_can_fetch_admin_stats(): void
    {
        $response = $this->getJson('/api/admin/stats');

        $response->assertOk()
            ->assertJsonStructure([
                'total_revenue',
                'orders_count',
                'paid_orders',
                'pending_orders',
                'refunded_orders',
                'products_count',
            ]);
    }

    /**
     * Test admin products listing.
     */
    public function test_can_fetch_admin_products(): void
    {
        $response = $this->getJson('/api/admin/products');

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    /**
     * Test admin product creation.
     */
    public function test_can_upload_new_product(): void
    {
        $payload = [
            'name' => 'Handcrafted Rose Gold Locket',
            'category' => 'Accessories',
            'price' => 59.99,
            'original_price' => 69.99,
            'description' => 'Fine filigree locket with custom photo insert.',
            'image' => UploadedFile::fake()->image('locket.jpg', 400, 400),
            'in_stock' => true,
            'badge' => 'New Arrival',
        ];

        $response = $this->post('/api/admin/products', $payload, ['Accept' => 'application/json']);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Handcrafted Rose Gold Locket')
            ->assertJsonPath('data.category', 'Accessories');
    }

    /**
     * Test admin orders listing.
     */
    public function test_can_fetch_admin_orders(): void
    {
        $response = $this->getJson('/api/admin/orders');

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    /**
     * Test payment status update.
     */
    public function test_can_update_payment_status(): void
    {
        $response = $this->putJson('/api/admin/orders/1/payment', [
            'payment_status' => 'paid',
        ]);

        $response->assertOk()
            ->assertJsonPath('order.payment_status', 'paid');
    }
}

