<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function index(){
        $participants = Participant::with('school')->paginate(10);
        return Inertia::render('Admin/Participant/Index', [
            'title' => 'Daftar Siswa',
            'description' => 'Informasi siswa yang terdaftar ketika registrasi kuisioner',
            'participants' => $participants
        ]);
    }
}
