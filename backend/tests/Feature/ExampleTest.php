<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Ensure the backend root returns API metadata as JSON.
     */
    public function test_the_application_returns_api_metadata_response(): void
    {
        $response = $this->getJson('/');

        $response
            ->assertOk()
            ->assertJsonPath('status', 'running')
            ->assertJsonPath('role', 'api-backend')
            ->assertJsonStructure([
                'name',
                'status',
                'role',
                'frontend_url',
                'endpoints' => ['health', 'register', 'login', 'me', 'logout'],
            ]);
    }
}
