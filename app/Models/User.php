<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class  User extends Authenticatable
{
    use HasFactory, Notifiable;
    const ADMIN_ROLE = 'ADMIN';
    const PENELITI_ROLE = 'PENELITI';
    protected $guarded = ['id'];
    protected $hidden = [
        'password',
        'created_at',
        'updated_at',
    ];
}
