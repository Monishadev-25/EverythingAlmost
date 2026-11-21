<?php

namespace Tests\Feature;

use Tests\TestCase;

class PaymentGatewayApiTest extends TestCase
{
    /**
     * Test public payment configuration endpoint returns safe keys and bank payout details.
     */
    public function test_public_payment_config_returns_safe_keys_and_bank_details(): void
    {
        $response = $this->getJson('/api/payment/public-config');

        $response->assertOk()
            ->assertJsonStructure([
                'environment',
                'currency',
                'stripe_enabled',
                'paypal_enabled',
                'paypal_email',
                'bank_transfer_enabled',
                'bank_details' => [
                    'bank_name',
                    'bank_account_name',
                    'bank_sort_code',
                    'bank_account_number',
                    'bank_iban',
                    'bank_bic',
                ],
            ]);
    }

    /**
     * Test creating a payment intent.
     */
    public function test_can_create_payment_intent(): void
    {
        $payload = [
            'amount' => 45.00,
            'currency' => 'GBP',
            'customer_email' => 'customer@test.co.uk',
            'customer_name' => 'Eleanor Vance',
        ];

        $response = $this->postJson('/api/payment/create-intent', $payload);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'mode',
                'client_secret',
                'payment_intent_id',
                'amount',
                'currency',
            ]);
    }

    /**
     * Test admin can fetch and update payment & payout receiver settings.
     */
    public function test_admin_can_retrieve_and_update_payout_settings(): void
    {
        // Fetch current settings
        $getRes = $this->getJson('/api/admin/payment-settings');
        $getRes->assertOk()->assertJsonStructure(['settings']);

        // Update settings
        $updatePayload = [
            'environment' => 'sandbox',
            'bank_name' => 'Barclays Bank UK',
            'bank_account_name' => 'Everything Almost Ltd',
            'account_holder' => 'Everything Almost Ltd',
            'bank_sort_code' => '20-11-22',
            'sort_code' => '20-11-22',
            'bank_account_number' => '87654321',
            'account_number' => '87654321',
            'bank_transfer_enabled' => true,
            'payout_schedule' => 'daily',
            'paypal_email' => 'finance@everythingalmost.co.uk',
        ];

        $postRes = $this->postJson('/api/admin/payment-settings', $updatePayload);
        $postRes->assertOk()
            ->assertJsonPath('settings.bank_name', 'Barclays Bank UK')
            ->assertJsonPath('settings.sort_code', '20-11-22')
            ->assertJsonPath('settings.account_number', '87654321');
    }

    /**
     * Test admin test-gateway endpoint for PayPal verification.
     */
    public function test_admin_can_test_paypal_gateway(): void
    {
        $payload = [
            'gateway' => 'paypal',
            'paypal_email' => 'merchant@everythingalmost.co.uk',
        ];

        $response = $this->postJson('/api/admin/test-gateway', $payload);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('gateway', 'paypal');
    }

    /**
     * Test placing an order with Direct Bank Transfer (BACS).
     */
    public function test_order_placement_with_direct_bank_transfer(): void
    {
        $payload = [
            'customer_name' => 'Lady Whistledown',
            'customer_email' => 'lady@whistledown.co.uk',
            'shipping_address' => '10 Grosvenor Square',
            'city' => 'London',
            'postal_code' => 'W1K 4QT',
            'country' => 'United Kingdom',
            'shipping_method' => 'Royal Mail Tracked 24',
            'subtotal' => 65.00,
            'shipping_cost' => 0.00,
            'total' => 65.00,
            'payment_method' => 'bank_transfer',
            'items' => [
                [
                    'name' => 'Personalised Crystal Keepsake',
                    'price' => 65.00,
                    'quantity' => 1,
                ],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('order.payment_method', 'bank_transfer')
            ->assertJsonPath('order.payment_status', 'pending');
    }
}
