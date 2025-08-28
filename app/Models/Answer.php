<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    public function participant()
    {
        return $this->belongsTo(Participant::class, 'participant_id');
    }

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaires::class, 'questionnaire_id');
    }
    
    public function question()
    {
        return $this->belongsTo(Questions::class, 'question_id');
    }

    public function choice()
    {
        return $this->belongsTo(Choices::class, 'choice_id');
    }

    public function researcher()
    {
        return $this->belongsTo(User::class, 'researcher_id');
    }
}
