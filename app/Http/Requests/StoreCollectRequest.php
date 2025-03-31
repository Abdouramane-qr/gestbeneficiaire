<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Collect;

class StoreCollectRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'data' => 'required|array',
            'status' => 'required|in:'.implode(',', Collect::getStatuses())
        ];
    }

    public function attributes()
    {
        return [
            'data' => 'données',
            'status' => 'statut'
        ];
    }
}
