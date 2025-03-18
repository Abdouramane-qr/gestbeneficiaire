<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use Illuminate\Database\Eloquent\Model;

class InstitutionFinanciere extends Model
{
    use HasFactory;

    protected $fillable = ['nom','adresse','ville','description'];

    public function  beneficiaires()
    {
        return $this->hasMany(Beneficiaire::class);
    }

}
