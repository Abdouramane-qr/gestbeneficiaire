<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commune extends Model
{
    use HasFactory;
    // protected $fillable = ['nom', 'province_id'];

    // public function province() {
    //     return $this->belongsTo(Province::class);
    // }

    // public function beneficiaires() {
    //     return $this->hasMany(Beneficiaire::class);
    // }
}
