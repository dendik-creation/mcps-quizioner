import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { QuestionnaireResultShowProps } from "@/types/questionnaire";
import {
    CircleCheck,
    CircleX,
    ClipboardList,
    ListTodo,
    Pin,
    Target,
} from "lucide-react";
import React, { useEffect } from "react";

const QuestionnaireResultShow = ({
    title,
    description,
    meta_information,
    answers,
    questions,
}: QuestionnaireResultShowProps) => {
    const MetaInformationKeyValue = (key: string, value: string | number) => {
        return (
            <div className="flex flex-col items-start">
                <span className="font-bold text-slate-500 text-sm">{key}</span>
                <span className="text-base">{value}</span>
            </div>
        );
    };
    const getSelectedAnswer = (
        target: "CHOICE" | "ESSAY",
        questions_id: number,
        choice_id?: number | null
    ) => {
        if (target == "CHOICE") {
            const answer = answers.find(
                (answer) =>
                    Number(answer.questions_id) == Number(questions_id) &&
                    Number(answer.choice_id) == Number(choice_id)
            );
            return answer?.choice_id;
        } else if (target == "ESSAY") {
            const answer = answers.find(
                (answer) =>
                    Number(answer.questions_id) == Number(questions_id) &&
                    answer.choice_id == null
            );
            return answer;
        }
    };
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <Card className="py-3 mb-10">
                <CardContent className="px-3">
                    <div className="flex items-center gap-3 mb-4">
                        <ClipboardList className="text-slate-400" />
                        <h3 className="font-semibold">Informasi Kuisioner</h3>
                    </div>
                    <div className="grid grid-cols-1 ms-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {MetaInformationKeyValue(
                            "Nama Siswa",
                            meta_information.participant_name
                        )}
                        {MetaInformationKeyValue(
                            "Asal Sekolah",
                            meta_information.participant_name
                        )}
                        {MetaInformationKeyValue(
                            "Kelas",
                            meta_information.participant_class
                        )}
                        {MetaInformationKeyValue(
                            "Kuisioner",
                            meta_information.questionnaire_name
                        )}
                        {MetaInformationKeyValue(
                            "Total Poin / Total Skor",
                            `${meta_information.total_point} / ${meta_information.total_score}`
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-3 mb-4">
                <ListTodo className="text-slate-400" />
                <h3 className="font-semibold">Detail Jawaban</h3>
            </div>
            {questions.length > 0 &&
                questions.map((question, index) => (
                    <Card className="py-3 mb-4" key={index}>
                        <CardContent className="px-3">
                            <div className="flex flex-col w-full mb-3">
                                <label className="text-base font-semibold text-slate-500">
                                    Pertanyaan {index + 1}
                                </label>
                                <span
                                    className=""
                                    dangerouslySetInnerHTML={{
                                        __html: question.question
                                            ? String(question.question)
                                            : "-",
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col w-full">
                                        <label className="text-base mb-1">
                                            Jawaban yang dipilih
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            {question.choices.map(
                                                (choice, choiceIdx) => (
                                                    <div
                                                        key={choiceIdx}
                                                        className="flex items-center gap-2 relative"
                                                    >
                                                        <div className="absolute rounded-l-md bg-amber-200 h-full flex items-center justify-center w-8">
                                                            <span className="font-semibold">
                                                                {String.fromCharCode(
                                                                    65 +
                                                                        choiceIdx
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="absolute right-0 rounded-r-md h-full flex items-center justify-center w-8">
                                                            <div className="flex items-center">
                                                                {choice.point ==
                                                                1 ? (
                                                                    <CircleCheck
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-green-400"
                                                                    />
                                                                ) : (
                                                                    <CircleX
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-red-400"
                                                                    />
                                                                )}
                                                                {getSelectedAnswer(
                                                                    "CHOICE",
                                                                    question.id,
                                                                    choice.id
                                                                ) ==
                                                                    choice.id && (
                                                                    <Pin
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-slate-400 ml-1 me-6 rotate-45"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Input
                                                            readOnly
                                                            disabled
                                                            type="text"
                                                            className="ps-10 w-full pointer-events-none select-none focus:outline-none focus:ring-0 focus:border-gray-300 cursor-default disabled:opacity-90"
                                                            name="choice"
                                                            value={
                                                                choice.choice
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    {(() => {
                                        const essayAnswer: {
                                            essay_answer: string | null;
                                            point: number | null;
                                        } = getSelectedAnswer(
                                            "ESSAY",
                                            question.id
                                        ) as {
                                            essay_answer: string | null;
                                            point: number | null;
                                        };
                                        return (
                                            <>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <label className="text-base">
                                                        Jawaban isian
                                                    </label>
                                                    <span className="text-sm text-slate-500">
                                                        {essayAnswer?.point ==
                                                        null
                                                            ? "(belum dikoreksi)"
                                                            : essayAnswer?.point !==
                                                              undefined
                                                            ? `(poin ${essayAnswer.point})`
                                                            : ""}
                                                    </span>
                                                </div>
                                                {essayAnswer ? (
                                                    <span
                                                        className=""
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                essayAnswer.essay_answer ||
                                                                "-",
                                                        }}
                                                    />
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </AppLayout>
    );
};

export default QuestionnaireResultShow;
