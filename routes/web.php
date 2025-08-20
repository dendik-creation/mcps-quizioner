<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\SchoolsController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\adminRole;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuthController::class, 'authCheck']);
Route::middleware('guest')->group(function(){
    // Sign-in
    Route::get('/auth/signin', [AuthController::class, 'signInView'])->name('login');
    Route::post('/auth/signin', [AuthController::class, 'signInStore']);
});

Route::middleware('auth')->group(function(){
    // Sign-out
    Route::post('/auth/signout', [AuthController::class, 'signOutStore']);

    // Admind
    Route::prefix('admin')->middleware([adminRole::class])->group(function(){
        Route::get('/dashboard', [DashboardController::class, 'adminDashboard']);
        Route::resource('/user', UserController::class)->except(['show']);
        Route::resource('/school', SchoolsController::class)->except(['create', 'edit']);

        Route::get('/participant', [ParticipantController::class, 'index']);

        // 

        Route::get('/setting', [DashboardController::class, 'appSettingView']);
        Route::put('/setting', [DashboardController::class, 'appSettingUpdate']);
    });
});
