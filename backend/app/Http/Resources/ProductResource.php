<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array{
     *     id: int,
     *     name: string,
     *     slug: string,
     *     description: string|null,
     *     price: float,
     *     original_price: float|null,
     *     category: string,
     *     image_url: string|null,
     *     rating: float,
     *     reviews_count: int,
     *     in_stock: bool,
     *     is_featured: bool,
     *     is_bestseller: bool,
     *     badge: string|null,
     *     tags: list<string>
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'original_price' => $this->original_price !== null ? (float) $this->original_price : null,
            'category' => $this->category,
            'image_url' => $this->image_url,
            'rating' => (float) $this->rating,
            'reviews_count' => (int) $this->reviews_count,
            'in_stock' => (bool) $this->in_stock,
            'is_featured' => (bool) $this->is_featured,
            'is_bestseller' => (bool) $this->is_bestseller,
            'badge' => $this->badge,
            'tags' => is_array($this->tags) ? $this->tags : [],
            'custom_fields' => is_array($this->custom_fields) ? $this->custom_fields : [],
        ];
    }
}

