<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * Display a listing of products with filtering, search, and sorting.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::query();

        if ($request->filled('category')) {
            $category = (string) $request->query('category');
            if (strtolower($category) !== 'all') {
                $query->where('category', $category);
            }
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->query('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->query('max_price'));
        }

        if ($request->has('in_stock')) {
            $query->where('in_stock', filter_var($request->query('in_stock'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('q')) {
            $search = (string) $request->query('q');
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        $sort = (string) $request->query('sort', 'popular');
        match ($sort) {
            'price-asc' => $query->orderBy('price', 'asc'),
            'price-desc' => $query->orderBy('price', 'desc'),
            'rating' => $query->orderBy('rating', 'desc'),
            'newest' => $query->orderBy('id', 'desc'),
            default => $query->orderBy('reviews_count', 'desc'),
        };

        return ProductResource::collection($query->get());
    }

    /**
     * Display featured products for home page promotions.
     */
    public function featured(): AnonymousResourceCollection
    {
        $featured = Product::where('is_featured', true)->take(8)->get();

        return ProductResource::collection($featured);
    }

    /**
     * List all categories with product counts.
     */
    public function categories(): JsonResponse
    {
        $categories = Product::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderBy('category')
            ->pluck('count', 'category')
            ->all();

        return response()->json(['data' => $categories]);
    }

    /**
     * Display a specific product by slug or id.
     */
    public function show(string $slugOrId): JsonResponse|ProductResource
    {
        $product = is_numeric($slugOrId)
            ? Product::find($slugOrId)
            : Product::where('slug', $slugOrId)->first();

        if (! $product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return new ProductResource($product);
    }
}
