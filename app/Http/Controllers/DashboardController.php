<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'title' => 'Dashboard',
            'description' => 'Halaman utama untuk melihat ringkasan data kuisioner',
        ]);
    }

    public function penelitiDashboard()
    {
        return Inertia::render('Peneliti/Dashboard', [
            'title' => 'Dashboard',
            'description' => 'Halaman utama untuk melihat ringkasan data kuisioner',
        ]);
    }
}
