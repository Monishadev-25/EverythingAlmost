<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentGatewayController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health & System
Route::get('/health', [HealthController::class, 'index'])->name('api.health');

// Products Catalog (Public)
Route::prefix('products')->name('api.products.')->group(function (): void {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/featured', [ProductController::class, 'featured'])->name('featured');
    Route::get('/categories', [ProductController::class, 'categories'])->name('categories');
    Route::get('/{slugOrId}', [ProductController::class, 'show'])->name('show');
});

// Checkout & Orders (Public Placement & Guest Lookup)
Route::post('/orders', [OrderController::class, 'store'])->name('api.orders.store');
Route::get('/orders/{orderNumber}', [OrderController::class, 'show'])->name('api.orders.show');
Route::post('/upload-custom-image', [OrderController::class, 'uploadCustomImage'])->name('api.orders.upload-custom-image');

// Payment Gateway & Intent (Public Checkout)
Route::prefix('payment')->name('api.payment.')->group(function (): void {
    Route::get('/public-config', [PaymentGatewayController::class, 'getPublicConfig'])->name('config');
    Route::post('/create-intent', [PaymentGatewayController::class, 'createPaymentIntent'])->name('intent');
});

// Authentication
Route::prefix('auth')->name('api.auth.')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::get('/me', [AuthController::class, 'me'])->name('me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Protected Customer Profile & Orders
Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', function (Request $request) {
        return new UserResource($request->user());
    })->name('api.user');

    Route::get('/orders', [OrderController::class, 'index'])->name('api.orders.index');
});

// Store Admin Panel (Products & Payment Management)
Route::prefix('admin')->name('api.admin.')->group(function (): void {
    Route::get('/stats', [AdminController::class, 'stats'])->name('stats');
    Route::get('/products', [AdminController::class, 'products'])->name('products.index');
    Route::post('/products', [AdminController::class, 'storeProduct'])->name('products.store');
    Route::put('/products/{id}', [AdminController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{id}', [AdminController::class, 'destroyProduct'])->name('products.destroy');

    Route::get('/orders', [AdminController::class, 'orders'])->name('orders.index');
    Route::put('/orders/{id}/payment', [AdminController::class, 'updatePayment'])->name('orders.payment');
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus'])->name('orders.status');

    // Superadmin Payment Receiver & Banking Configuration
    Route::get('/payment-settings', [PaymentGatewayController::class, 'getAdminSettings'])->name('payment-settings.get');
    Route::post('/payment-settings', [PaymentGatewayController::class, 'updateAdminSettings'])->name('payment-settings.update');
    Route::post('/test-gateway', [PaymentGatewayController::class, 'testGatewayConnection'])->name('test-gateway');
});
