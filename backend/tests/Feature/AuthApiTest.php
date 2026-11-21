<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_sanctum_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.email', 'ada@example.com')
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'name', 'email', 'created_at', 'updated_at'],
                'token',
                'token_type',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'ada@example.com',
        ]);
    }

    public function test_user_can_login_fetch_profile_and_logout(): void
    {
        $user = User::factory()->create([
            'email' => 'grace@example.com',
            'password' => 'Password123!',
        ]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'grace@example.com',
            'password' => 'Password123!',
        ]);

        $loginResponse->assertOk()->assertJsonPath('user.id', $user->id);

        $token = $loginResponse->json('token');

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'grace@example.com');

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'linus@example.com',
            'password' => 'Password123!',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'linus@example.com',
            'password' => 'wrong-password',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_superadmin_can_login_with_default_credentials(): void
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'superadmin',
            'password' => 'SuperAdmin123!',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.is_superadmin', true)
            ->assertJsonPath('user.username', 'superadmin');
    }

    public function test_me_endpoint_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }
}

