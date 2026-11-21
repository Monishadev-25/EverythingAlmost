<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', function (): JsonResponse {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'running',
        'role' => 'api-backend',
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),
        'endpoints' => [
            'health' => url('/api/health'),
            'register' => url('/api/auth/register'),
            'login' => url('/api/auth/login'),
            'me' => url('/api/auth/me'),
            'logout' => url('/api/auth/logout'),
        ],
    ]);
});
