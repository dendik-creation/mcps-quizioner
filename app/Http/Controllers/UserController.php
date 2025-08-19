<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return Inertia::render('Admin/User/Index', [
            'title' => 'Daftar User',
            'description' => 'Kelola user yang dapat mengakses dashboard pada aplikasi',
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/User/Create', [
            'title' => 'Tambah User',
            'description' => 'Form untuk membuat user baru'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'role' => 'required|in:ADMIN,PENELITI',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        User::create($validated);
        Session::flash('success', 'User baru berhasil ditambahkan');
        return Inertia::location('/admin/user');
    }
    
    /**
     * Show the form for editing the specified resource.
    */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('Admin/User/Edit', [
            'title' => 'Edit User',
            'description' => 'Form untuk mengedit user',
            'user' => $user
        ]);
    }
    
    /**
     * Update the specified resource in storage.
    */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'username' => 'required|string|unique:users,username,' . $id,
            'password' => 'required|string|min:6',
            'role' => 'required|in:ADMIN,PENELITI',
        ]);
        
        $user = User::findOrFail($id);
        $validated['password'] = Hash::make($validated['password']);
        $user->update($validated);
        Session::flash('success', 'User berhasil diperbarui');
        return Inertia::location('/admin/user');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        Session::flash('success', 'User berhasil dihapus');
        return Inertia::location('/admin/user');
    }
}
