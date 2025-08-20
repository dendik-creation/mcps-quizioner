<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Questions extends Model
{
    protected $guarded = ['id'];

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaires::class);
    }

    public function choices()
    {
        return $this->hasMany(Choices::class);
    }
}
