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
