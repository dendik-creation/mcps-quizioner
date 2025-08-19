<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

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
}
