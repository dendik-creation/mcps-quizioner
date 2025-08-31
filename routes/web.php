<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\QuestionnairesController;
use App\Http\Controllers\SchoolsController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\adminRole;
use App\Http\Middleware\participantRole;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuthController::class, 'authCheck']);
Route::middleware('guest')->group(function () {
    // Sign-in
    Route::get('/auth/signin', [AuthController::class, 'signInView'])->name('login');
    Route::post('/auth/signin', [AuthController::class, 'signInStore']);

    // Registration
    Route::get('/auth/register', [AuthController::class, 'registerView'])->name('register');
    Route::post('/auth/register', [AuthController::class, 'registerStore']);
    Route::post('/auth/unregister', [AuthController::class, 'unregisterStore']);
});

Route::middleware(['participant', 'answering'])->group(function () {

    Route::get('/guide', [QuestionnairesController::class, 'guide'])->name('guide');
    Route::get('/demo', [QuestionnairesController::class, 'demo'])->name('demo');
    Route::get('/kuisioner', [ParticipantController::class, 'kuisioner'])->name('kuisioner');

    Route::middleware(['answering'])->group(function () {
        Route::get('/questionnaire/in-progress', [QuestionnairesController::class, 'answerIndex']);
        Route::post('/questionnaire/in-progress', [QuestionnairesController::class, 'answerStore']);
    });
});

Route::middleware('auth')->group(function () {
    // Sign-out
    Route::post('/auth/signout', [AuthController::class, 'signOutStore']);

    // Admind
    Route::prefix('admin')->middleware([adminRole::class])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'adminDashboard']);
        Route::resource('/user', UserController::class)->except(['show']);

        //School
        Route::resource('/school', SchoolsController::class)->except(['create', 'edit']);

        // Participant
        Route::get('/participant', [ParticipantController::class, 'index']);

        // Questionares
        Route::get('/questionnaire', [QuestionnairesController::class, 'adminIndex']);
        Route::post('/questionnaire', [QuestionnairesController::class, 'adminStore']);
        Route::get('/questionnaire/create', [QuestionnairesController::class, 'adminCreate']);
        Route::get('/questionnaire/{questionnaire_id}/edit', [QuestionnairesController::class, 'adminEdit']);
        Route::put('/questionnaire/{questionnaire_id}', [QuestionnairesController::class, 'adminUpdate']);
        Route::delete('/questionnaire/{questionnaire_id}', [QuestionnairesController::class, 'adminDestroy']);

        // App Setting
        Route::get('/setting', [DashboardController::class, 'appSettingView']);
        Route::put('/setting', [DashboardController::class, 'appSettingUpdate']);
    });
});
