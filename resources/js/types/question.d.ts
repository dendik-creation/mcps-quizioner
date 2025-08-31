import { Participant } from "./participant";
import { Questionnaire } from "./questionnaire";
import { User } from "./user";

export type Question = {
    id: number;
    questionnaire_id: number;
    question: string;
    choices: Choice[];
};

export type Choice = {
    id: number;
    question_id: number;
    choice: string;
    point: number;
};

export type Answer = {
    id: number;
    participant_id: number;
    questionnaire_id: number;
    questions_id: number;
    choice_id: number | null;
    researcher_id: number | null;
    essay_answer: string | null;
    point: number | null;
    participant: Participant;
    questionnaire: Questionnaire;
    question: Question | null;
    choice: Choice | null;
    researcher: User | null;
};
