<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use Illuminate\Database\Eloquent\Model;

class ONG extends Model
{
    use HasFactory;

    protected $fillable = ['nom','adresse','description'];
    protected $table = 'ongs';


public function beneficiaires()
{
return $this->hasMany(Beneficiaire::class,'ong_id');

}
}
