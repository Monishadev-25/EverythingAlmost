<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Get aggregate ecommerce store and payment analytics.
     */
    public function stats(): JsonResponse
    {
        $totalRevenue = (float) Order::where('payment_status', 'paid')->sum('total');
        $ordersCount = Order::count();
        $paidCount = Order::where('payment_status', 'paid')->count();
        $pendingCount = Order::where('payment_status', 'pending')->count();
        $refundedCount = Order::where('payment_status', 'refunded')->count();
        $productsCount = Product::count();
        $recentOrders = Order::with('items')->latest()->take(5)->get();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'orders_count' => $ordersCount,
            'paid_orders' => $paidCount,
            'pending_orders' => $pendingCount,
            'refunded_orders' => $refundedCount,
            'products_count' => $productsCount,
            'recent_orders' => OrderResource::collection($recentOrders),
        ]);
    }

    /**
     * List all products for the superadmin panel with search & filter.
     */
    public function products(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('q')) {
            $q = (string) $request->query('q');
            $query->where(function ($sub) use ($q): void {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('category', 'like', "%{$q}%");
            });
        }

        if ($request->filled('category') && strtolower((string) $request->query('category')) !== 'all') {
            $query->where('category', (string) $request->query('category'));
        }

        $products = $query->latest('id')->get();

        return response()->json(['data' => ProductResource::collection($products)]);
    }

    /**
     * Upload and create a new ecommerce product.
     */
    public function storeProduct(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['required_without:image_url', 'nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'rating' => ['nullable', 'numeric', 'min:1', 'max:5'],
            'reviews_count' => ['nullable', 'integer', 'min:0'],
            'in_stock' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'is_bestseller' => ['nullable', 'boolean'],
            'badge' => ['nullable', 'string', 'max:50'],
            'tags' => ['nullable', 'array'],
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $count = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$count}";
            $count++;
        }

        $imageUrl = $this->storeUploadedImage($request, $slug) ?? ($validated['image_url'] ?? null);

        $customFields = null;
        if ($request->has('custom_fields')) {
            $raw = $request->input('custom_fields');
            if (is_string($raw)) {
                $decoded = json_decode($raw, true);
                $customFields = is_array($decoded) ? $decoded : [];
            } elseif (is_array($raw)) {
                $customFields = $raw;
            }
        }

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'price' => $validated['price'],
            'original_price' => $validated['original_price'] ?? null,
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'image_url' => $imageUrl,
            'rating' => $validated['rating'] ?? 5.0,
            'reviews_count' => $validated['reviews_count'] ?? 0,
            'in_stock' => $request->has('in_stock') ? $request->boolean('in_stock') : true,
            'is_featured' => $request->boolean('is_featured', false),
            'is_bestseller' => $request->boolean('is_bestseller', false),
            'badge' => $validated['badge'] ?? null,
            'tags' => $validated['tags'] ?? [$validated['category']],
            'custom_fields' => $customFields,
        ]);

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product),
        ], 201);
    }

    /**
     * Update an existing product.
     */
    public function updateProduct(Request $request, int|string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'in_stock' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'is_bestseller' => ['nullable', 'boolean'],
            'badge' => ['nullable', 'string', 'max:50'],
            'tags' => ['nullable', 'array'],
        ]);

        $product = Product::find($id);

        if (! $product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        unset($validated['image']);

        $slug = $product->slug;
        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $slug = Str::slug($validated['name']);
            $validated['slug'] = $slug;
        }

        if ($request->hasFile('image')) {
            $newImageUrl = $this->storeUploadedImage($request, $slug);
            if ($newImageUrl) {
                $this->deleteLocalImage($product->image_url);
                $validated['image_url'] = $newImageUrl;
            }
        }

        if ($request->has('in_stock')) {
            $validated['in_stock'] = $request->boolean('in_stock');
        }
        if ($request->has('is_featured')) {
            $validated['is_featured'] = $request->boolean('is_featured');
        }
        if ($request->has('is_bestseller')) {
            $validated['is_bestseller'] = $request->boolean('is_bestseller');
        }

        if ($request->has('custom_fields')) {
            $raw = $request->input('custom_fields');
            if (is_string($raw)) {
                $decoded = json_decode($raw, true);
                $validated['custom_fields'] = is_array($decoded) ? $decoded : [];
            } elseif (is_array($raw)) {
                $validated['custom_fields'] = $raw;
            }
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * Delete a product.
     */
    public function destroyProduct(int|string $id): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        $this->deleteLocalImage($product->image_url);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
            'id' => $id,
        ]);
    }

    /**
     * List all customer orders for payment & order management.
     */
    public function orders(Request $request): JsonResponse
    {
        $query = Order::with('items')->latest();

        if ($request->filled('payment_status') && strtolower((string) $request->query('payment_status')) !== 'all') {
            $query->where('payment_status', (string) $request->query('payment_status'));
        }

        if ($request->filled('status') && strtolower((string) $request->query('status')) !== 'all') {
            $query->where('status', (string) $request->query('status'));
        }

        if ($request->filled('q')) {
            $q = (string) $request->query('q');
            $query->where(function ($sub) use ($q): void {
                $sub->where('order_number', 'like', "%{$q}%")
                    ->orWhere('customer_name', 'like', "%{$q}%")
                    ->orWhere('customer_email', 'like', "%{$q}%");
            });
        }

        $orders = $query->get();

        return response()->json(['data' => OrderResource::collection($orders)]);
    }

    /**
     * Update payment status of an order (e.g. Paid, Refunded, Pending, Failed).
     */
    public function updatePayment(Request $request, int|string $id): JsonResponse
    {
        $validated = $request->validate([
            'payment_status' => ['required', 'string', 'in:paid,pending,refunded,failed'],
            'transaction_id' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $order = Order::with('items')->find($id);

        if (! $order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $order->payment_status = $validated['payment_status'];
        if (isset($validated['transaction_id'])) {
            $order->transaction_id = $validated['transaction_id'];
        }
        if (isset($validated['notes'])) {
            $order->notes = $validated['notes'];
        }
        $order->save();

        return response()->json([
            'message' => 'Payment status updated.',
            'order' => new OrderResource($order),
        ]);
    }

    /**
     * Update fulfillment status of an order (processing, shipped, delivered, cancelled).
     */
    public function updateOrderStatus(Request $request, int|string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:processing,shipped,delivered,cancelled'],
        ]);

        $order = Order::with('items')->find($id);

        if (! $order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $order->status = $validated['status'];
        $order->save();

        return response()->json([
            'message' => 'Order status updated.',
            'order' => new OrderResource($order),
        ]);
    }

    /**
     * Store an uploaded product image into public/uploads/products and return its public URL.
     */
    private function storeUploadedImage(Request $request, string $slug): ?string
    {
        if (! $request->hasFile('image')) {
            return null;
        }

        $file = $request->file('image');
        $uploadDir = public_path('uploads/products');

        if (! is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename = $slug.'-'.Str::random(8).'.'.$extension;
        $file->move($uploadDir, $filename);

        return rtrim($request->getSchemeAndHttpHost(), '/').'/uploads/products/'.$filename;
    }

    /**
     * Delete a previously uploaded local product image file if present.
     */
    private function deleteLocalImage(?string $imageUrl): void
    {
        if (! $imageUrl) {
            return;
        }

        $path = parse_url($imageUrl, PHP_URL_PATH);
        if (! is_string($path) || ! str_starts_with($path, '/uploads/products/')) {
            return;
        }

        $fullPath = public_path(ltrim($path, '/'));
        if (is_file($fullPath)) {
            @unlink($fullPath);
        }
    }
}
