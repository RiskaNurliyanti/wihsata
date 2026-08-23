<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Wihsata API',
        'status' => 'ok',
    ]);
});
