<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Questionnaires extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    public function questions()
    {
        return $this->hasMany(Questions::class);
    }
}
