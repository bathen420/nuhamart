<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [

        'customer_code',

        'name',

        'phone',

        'email',

        'address',

        'opening_balance',

        'current_balance',

        'status',

        'notes',

    ];

    protected $casts = [

        'opening_balance'=>'decimal:2',

        'current_balance'=>'decimal:2',

        'status'=>'boolean',

    ];

}