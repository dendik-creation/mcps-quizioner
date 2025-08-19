<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];
    protected $table = "participants";

    public function school()
    {
        return $this->belongsTo(Schools::class, 'school_id');
    }
}
