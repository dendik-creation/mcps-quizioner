<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Questionnaires;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionnairesController extends Controller
{
    public function adminIndex(){
        $questionnaires = Questionnaires::with('questions')->get();
        return Inertia::render('Admin/Questionnaire/Index', [
            'title' => 'Daftar Kuisioner',
            'description' => 'Halaman untuk melihat daftar kuisioner',
            'questionnaires' => $questionnaires
        ]);
    }

    public function adminCreate(){
        return Inertia::render('Admin/Questionnaire/Create', [
            'title' => 'Buat Kuesioner',
            'description' => 'Halaman untuk membuat kuesioner baru',
        ]);
    }

    public function adminStore(Request $request){
        dd($request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
    }
}
