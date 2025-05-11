<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CollectResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'entreprise_id' => $this->entreprise_id,
            'frequency_id' => $this->frequency_id,
            'collectable_type' => $this->collectable_type,
            'collectable_id' => $this->collectable_id,
            'data' => $this->data,
            'status' => $this->status,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'entreprise' => $this->whenLoaded('entreprise'),
            'frequency' => $this->whenLoaded('frequency'),
            'collectable' => $this->whenLoaded('collectable'),
        ];
    }
}
