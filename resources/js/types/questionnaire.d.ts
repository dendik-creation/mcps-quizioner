import { PageTitleProps, PaginationData } from "./global";
import { Answer, Question } from "./question";

export type Questionnaire = {
    id: number;
    name: string;
    description: string;
    is_open: boolean | number;
    questions: Question[];
};

export type QuestionnaireIndexProps = PageTitleProps & {
    questionnaires: Questionnaire[];
};

export type QuestionnaireEditProps = PageTitleProps & {
    questionnaire: Questionnaire;
};

export type Participant = {
    id: number;
    fullname: string;
    nisn: string;
    school_id: number;
    class: string;
};

export type QuestionnaireAnswerList = {
    participant_name: string;
    participant_id: number;
    participant_class: string;
    school_name: string;
    questionnaire_name: string;
    questionnaire_id: number;
    latest_point: number;
    need_correction: boolean;
};

export type QuestionnaireResultIndexProps = PageTitleProps & {
    answers: PaginationData<QuestionnaireAnswerList>;
    search: string;
};
export type QuestionnaireResultShowProps = PageTitleProps & {
    meta_information: {
        participant_name: string;
        participant_id: number;
        school_name: string;
        participant_class: string;
        questionnaire_name: string;
        questionnaire_id: number;
        total_point: number;
        total_score: number;
    };
    answers: {
        answer_id: number;
        questions_id: number;
        choice_id?: number | null;
        essay_answer?: string | null;
        point?: number | null;
    }[];
    questions: Question[];
};
