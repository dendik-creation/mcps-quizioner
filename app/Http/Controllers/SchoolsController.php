<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Schools;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class SchoolsController extends Controller
{
    public function index(){
        $schools = Schools::all();
        return Inertia::render('Admin/School/Index', [
            'title' => 'Daftar Sekolah',
            'description' => 'Kelola sekolah yang terdaftar untuk mengelompokkan siswa',
            'schools' => $schools
        ]);
    }

    public function show($id){
        $school = Schools::with('participants')->findOrFail($id);
        return Inertia::render('Admin/School/Show', [
            'title' => 'Detail ' . $school->name,
            'description' => 'Informasi lengkap tentang sekolah dan siswa yang berada dilingkupnya',
            'school' => $school
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:schools,name',
        ]);

        Schools::create($validated);
        Session::flash('success', 'Sekolah baru berhasil ditambahkan');
        return Inertia::location('/admin/school');
    }

    public function update(Request $request, $id){
        $school = Schools::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:schools,name,'.$school->id,
        ]);

        $school->update($validated);
        Session::flash('success', 'Sekolah berhasil diperbarui');
        return Inertia::location('/admin/school');
    }

    public function destroy($id){
        $school = Schools::findOrFail($id);
        $school->delete();
        Session::flash('success', 'Sekolah berhasil dihapus');
        return Inertia::location('/admin/school');
    }
}
