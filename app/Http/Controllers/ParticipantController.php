<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Models\Schools;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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

    public function adminEdit($participant_id)
    {
        $participant = Participant::findOrFail($participant_id);
        $schools = Schools::all()->map(function ($school) {
            return [
                'label' => $school->name,
                'value' => "".$school->id."",
            ];
        });
        return Inertia::render('Admin/Participant/Edit', [
            'title' => 'Edit Siswa',
            'description' => 'Perbarui informasi siswa',
            'participant' => $participant,
            'schools' => $schools
        ]);
    }

    public function adminUpdate(Request $request, $id)
    {
        $request->validate([
            'fullname' => 'required|string|max:50',
            'nisn' => 'required|string|max:10|unique:participants,nisn,' . $id,
            'school_id' => 'required|exists:schools,id',
            'class' => 'required|string|max:10'
        ]);

        $participant = Participant::findOrFail($id);
        $participant->update($request->only(['fullname', 'nisn', 'school_id', 'class']));
        Session::flash('success', 'Data siswa berhasil diperbarui.');
        return Inertia::location('/admin/participant');
    }

    public function adminDestroy($id)
    {
        $participant = Participant::findOrFail($id);
        $participant->delete();
        Session::flash('success', 'Data siswa berhasil dihapus.');
        return Inertia::location('/admin/participant');
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
