<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Participant;
use App\Models\Schools;
use App\Models\Settings;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getSchoolParticipant()
    {
        return Schools::withCount('participants')
            ->get()
            ->map(function ($school) {
                return [
                    'label' => $school->name,
                    'value' => $school->participants_count,
                ];
            });
    }

    private function getLatestQuestionnaries(){
        return Answer::query()
            ->latest('created_at')
            ->with(['participant:id,fullname,school_id', 'participant.school:id,name', 'questionnaire:id,name'])
            ->select('participant_id', 'questionnaire_id', DB::raw('MAX(created_at) as created_at'), DB::raw('MAX(id) as id'))
            ->groupBy('participant_id', 'questionnaire_id')
            ->take(5)
            ->get()
            ->map(function ($answer) {
                return [
                    'participant_name' => $answer->participant->fullname ?? '-',
                    'school' => $answer->participant->school->name ?? 'N/A',
                    'questionnaire' => $answer->questionnaire->name ?? '-',
                    'submitted_at' => $answer->created_at,
                ];
            });
    }

    public function adminDashboard()
    {
        $data_count = [
            'school' => Schools::count(),
            'participant' => Participant::count(),
            'researcher' => User::where('role', User::PENELITI_ROLE)->count(),
        ];
        return Inertia::render('Admin/Dashboard', [
            'title' => 'Dashboard',
            'description' => 'Halaman utama untuk melihat ringkasan data kuisioner',
            'data_count' => $data_count,
            'data_chart' => [
                'school_participants' => $this->getSchoolParticipant(),
            ],
            'data_table' => [
                'latest_questionnaries' => $this->getLatestQuestionnaries(),
            ],
        ]);
    }
    
    public function penelitiDashboard()
    {
        $data_count = [
            'school' => Schools::count(),
            'participant' => Participant::count(),
            'researcher' => User::where('role', User::PENELITI_ROLE)->count(),
        ];
        return Inertia::render('Peneliti/Dashboard', [
            'title' => 'Dashboard',
            'description' => 'Halaman utama untuk melihat ringkasan data kuisioner',
            'data_count' => $data_count,
            'data_chart' => [
                'school_participants' => $this->getSchoolParticipant(),
            ],
            'data_table' => [
                'latest_questionnaries' => $this->getLatestQuestionnaries(),
            ],
        ]);
    }

    public function appSettingView()
    {
        $setting = Settings::first();
        return Inertia::render('Admin/Setting/Index', [
            'title' => 'Pengaturan Aplikasi',
            'description' => 'Halaman untuk mengelola pengaturan aplikasi',
            'setting' => $setting,
        ]);
    }

    public function appSettingUpdate(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'questionnary_time' => 'required|integer|min:1',
        ]);

        $setting = Settings::first();
        if ($setting) {
            $setting->update($validated);
        } else {
            Settings::create($validated);
        }
        Session::flash('success', 'Pengaturan aplikasi berhasil diperbarui');
        return Inertia::location('/admin/setting');
    }
}
