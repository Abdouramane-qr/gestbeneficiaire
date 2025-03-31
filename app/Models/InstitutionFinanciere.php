<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use Illuminate\Database\Eloquent\Model;

class InstitutionFinanciere extends Model
{
    use HasFactory;

    protected $fillable = ['nom','adresse','ville','description'];
    protected $dates = ['deleted_at'];

    protected $table = 'institution_financieres';

    public function indicateur()
    {
        return $this->belongsTo(Indicateur::class, 'indicateur_id');
    }

    public function  beneficiaires()
    {
        return $this->hasMany(Beneficiaire::class,'institution_financiere_id');
    }

}
