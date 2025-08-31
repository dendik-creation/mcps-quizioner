<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function adminIndex(Request $request){
        $search = $request->get('search');
        $participants = Participant::with('school')
            ->when($search, function ($query, $search) {
                return $query->where('nisn', 'like', "%{$search}%")
                           ->orWhere('fullname', 'like', "%{$search}%")
                           ->orWhereHas('school', function ($q) use ($search) {
                               $q->where('name', 'like', "%{$search}%");
                           });
            })
            ->paginate(10);
            
        return Inertia::render('Admin/Participant/Index', [
            'title' => 'Daftar Siswa',
            'description' => 'Informasi siswa yang terdaftar ketika registrasi kuisioner',
            'participants' => $participants,
            'search' => $search
        ]);
    }
    
    public function penelitiIndex(Request $request){
        $search = $request->get('search');
        $participants = Participant::with('school')
        ->when($search, function ($query, $search) {
            return $query->where('nisn', 'like', "%{$search}%")
            ->orWhere('fullname', 'like', "%{$search}%")
            ->orWhereHas('school', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        })
        ->paginate(10);
        
        return Inertia::render('Peneliti/Participant/Index', [
            'title' => 'Daftar Siswa',
            'description' => 'Informasi siswa yang terdaftar ketika registrasi kuisioner',
            'participants' => $participants,
            'search' => $search
        ]);
    }
}
