<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array{
     *     id: int,
     *     order_number: string,
     *     customer_name: string,
     *     customer_email: string,
     *     customer_phone: string|null,
     *     shipping_address: string,
     *     city: string,
     *     postal_code: string,
     *     country: string,
     *     shipping_method: string,
     *     subtotal: float,
     *     discount: float,
     *     shipping_cost: float,
     *     total: float,
     *     status: string,
     *     payment_method: string,
     *     payment_status: string,
     *     created_at: string|null,
     *     items: list<array{
     *         id: int,
     *         product_id: int|null,
     *         product_name: string,
     *         product_image: string|null,
     *         price: float,
     *         quantity: int,
     *         total: float
     *     }>
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'shipping_address' => $this->shipping_address,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'shipping_method' => $this->shipping_method,
            'subtotal' => (float) $this->subtotal,
            'discount' => (float) $this->discount,
            'shipping_cost' => (float) $this->shipping_cost,
            'total' => (float) $this->total,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'transaction_id' => $this->transaction_id,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'items' => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_image' => $item->product_image,
                'price' => (float) $item->price,
                'quantity' => (int) $item->quantity,
                'total' => (float) $item->total,
                'customization' => is_array($item->customization) ? $item->customization : [],
            ])->values()->all(),
        ];
    }
}

