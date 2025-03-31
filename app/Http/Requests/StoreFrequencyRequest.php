<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Frequency;

class StoreFrequencyRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:frequencies,name',
            'code' => 'required|string|max:50|unique:frequencies,code',
            'days_interval' => 'required|integer|min:1',
            'is_custom' => 'boolean'
        ];
    }
}
