<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\CheckPermission;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('login');

Route::middleware(CheckPermission::class)->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');  
});