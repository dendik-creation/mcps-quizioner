<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Schools;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

use function PHPSTORM_META\map;

class AuthController extends Controller
{
    public function authCheck()
    {
        $auth = Auth::user();
        if (!$auth) {
            return Inertia::location('/auth/signin');
        }
        $role = $auth->role;
        if ($role == 'ADMIN') {
            return Inertia::location('/admin/dashboard');
        } else {
            return Inertia::location('/peneliti/dashboard');
        }
    }

    public function signInView()
    {
        return Inertia::render('Auth/SignIn', [
            'app_name' => config('app.name'),
        ]);
    }

    public function signInStore(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $credentials['username'])->first();
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'message' => 'Username atau password salah',
            ]);
        }

        if (Auth::attempt($credentials)) {
            return Inertia::location('/');
        }

        return back()->withErrors([
            'message' => 'Autentikasi Gagal - Hubungi Admin',
        ]);
    }

    public function signOutStore(Request $request)
    {
        Auth::logout();
        Session::flash('success', 'Logout berhasil');
        return Inertia::location('/auth/signin');
    }

    public function registerView()
    {
        if (session('participant_id')) {
            return redirect()->route('guide');
        }

        $schools = Schools::all();
        $schools = $schools->map(function ($school) {
            return [
                'value' => $school->id,
                'label' => $school->name,
            ];
        });
        return Inertia::render('Auth/Registration', [
            'app_name' => config('app.name'),
            'schools' => $schools
        ]);
    }

    public function registerStore(Request $request)
    {
        $data = $request->validate(
            [
                'fullname' => 'required',
                'nisn' => 'required|regex:/^[0-9]{10}$/',
                'school_id' => 'required|exists:schools,id',
                'class' => 'required|max:10',
            ],
            [
                'fullname.required' => 'Nama lengkap harus diisi',
                'nisn.required' => 'NISN harus diisi',
                'nisn.regex' => 'NISN harus berupa 10 digit angka',
                'nisn.numeric' => 'NISN harus berupa angka',
                'school_id.required' => 'Sekolah harus dipilih',
                'school_id.exists' => 'Sekolah tidak valid',
                'class.required' => 'Kelas harus diisi',
                'class.max' => 'Kelas tidak boleh lebih dari 10 karakter',
            ]
        );

        $participant = Participant::create($data);
        session(['participant_id' => $participant->id]);

        Session::flash('success', 'Registrasi berhasil');
        return Inertia::location('/guide');
    }
}
