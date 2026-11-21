<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    /**
     * Report API and database connectivity status.
     */
    public function index(): JsonResponse
    {
        $databaseConnected = false;

        try {
            DB::connection()->getPdo();
            $databaseConnected = true;
        } catch (Throwable) {
            $databaseConnected = false;
        }

        return response()->json([
            'status' => 'ok',
            'service' => config('app.name'),
            'environment' => app()->environment(),
            'laravel_version' => app()->version(),
            'database' => [
                'connection' => config('database.default'),
                'connected' => $databaseConnected,
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}

