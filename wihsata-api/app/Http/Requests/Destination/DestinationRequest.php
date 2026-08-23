<?php

namespace App\Http\Requests\Destination;

use App\Enums\DestinationAccessType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi role dicek di middleware route, bukan di sini
    }

    public function rules(): array
    {
        $destinationId = $this->route('destination')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('destinations', 'slug')->ignore($destinationId)],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'uuid', 'exists:categories,id'],
            'district_id' => ['nullable', 'uuid', 'exists:districts,id'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'address' => ['nullable', 'string', 'max:500'],
            'price_range' => ['nullable', 'string', 'max:255'],
            'cover_image_url' => ['nullable', 'url'],
            'gallery_urls' => ['nullable', 'array'],
            'gallery_urls.*' => ['url'],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['string', 'max:100'],
            'google_maps_url' => ['nullable', 'url'],
            'is_featured' => ['boolean'],
            'access_type' => ['required', Rule::enum(DestinationAccessType::class)],
            'departure_port' => ['nullable', 'string', 'max:255'],
            'crossing_duration_minutes' => ['nullable', 'integer', 'min:0'],
            'crossing_cost_estimate' => ['nullable', 'numeric', 'min:0'],
            'crossing_notes' => ['nullable', 'string'],
            // safety_score opsional; kalau diisi wajib disertai sumbernya
            // supaya tidak ada angka tanpa dasar penilaian.
            'safety_score' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'safety_source' => ['nullable', 'string', 'max:500', 'required_with:safety_score'],
            'opening_hours' => ['nullable', 'array'],
            'opening_hours.*' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama destinasi wajib diisi.',
            'slug.required' => 'Slug wajib diisi.',
            'slug.unique' => 'Slug sudah dipakai destinasi lain.',
            'latitude.required' => 'Latitude wajib diisi.',
            'longitude.required' => 'Longitude wajib diisi.',
            'access_type.required' => 'Akses menuju destinasi wajib dipilih.',
            'safety_source.required_with' => 'Kalau mengisi safety score, sumber/dasar penilaian wajib diisi juga.',
        ];
    }
}
