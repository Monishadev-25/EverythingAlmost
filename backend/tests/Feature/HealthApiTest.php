<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthApiTest extends TestCase
{
    /**
     * Ensure the API health check endpoint returns a valid JSON payload.
     */
    public function test_health_endpoint_returns_ok_status(): void
    {
        $response = $this->getJson('/api/health');

        $response
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonStructure([
                'status',
                'service',
                'environment',
                'laravel_version',
                'database' => ['connection', 'connected'],
                'timestamp',
            ]);
    }
}

