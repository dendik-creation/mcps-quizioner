<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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
    
    public function appSettingView(){
        $setting = Settings::first();
        return Inertia::render('Admin/Setting/Index', [
            'title' => 'Pengaturan Aplikasi',
            'description' => 'Halaman untuk mengelola pengaturan aplikasi',
            'setting' => $setting
        ]);
    }

    public function appSettingUpdate(Request $request){
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'questionnary_time' => 'required|integer|min:1',
        ]);

        $setting = Settings::first();
        if($setting){
            $setting->update($validated);
        }else{
            Settings::create($validated);
        }
        Session::flash('success', 'Pengaturan aplikasi berhasil diperbarui');
        return Inertia::location('/admin/setting');
    }
}
