import { PageTitleProps } from "./global";
import { Question } from "./question";

export type Questionnaire = {
    id: number;
    name: string;
    description: string;
    is_open: boolean;
    questions: Question[];
};

export type QuestionnaireIndexProps = PageTitleProps & {
    questionnaires: Questionnaire[];
};

export type QuestionnaireEditProps = PageTitleProps & {
    questionnaire: Questionnaire;
};
