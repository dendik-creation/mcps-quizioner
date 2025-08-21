<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
class QuestionnairesController extends Controller
{
    public function demo(){
        return Inertia::render('Questionnaires/Demo', [
            'app_name' => config('app.name'),
        ]);
    }
}
