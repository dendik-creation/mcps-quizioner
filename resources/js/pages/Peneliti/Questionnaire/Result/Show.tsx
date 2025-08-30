import { SelectSearchInput } from "@/components/custom/FormElement";
import { Button } from "@/components/ui/button";
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
    Loader,
    Pin,
    Save,
} from "lucide-react";
import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import { Answer } from "@/types/question";

const QuestionnaireResultShow = ({
    title,
    description,
    meta_information,
    answers,
    questions,
}: QuestionnaireResultShowProps) => {
    const { data, setData, processing, put } = useForm<{
        essay_points: { question_id: number; point: number }[];
    }>({
        essay_points: [],
    });

    const getSelectedAnswer = (
        target: "CHOICE" | "ESSAY",
        questions_id: number,
        choice_id?: number | null
    ) => {
        if (target == "CHOICE") {
            const answer = answers.find(
                (answer) =>
                    answer.questions_id == questions_id &&
                    answer.choice_id == choice_id
            );
            return answer?.choice_id;
        } else if (target == "ESSAY") {
            const answer = answers.find(
                (answer) =>
                    answer.questions_id == questions_id &&
                    answer.choice_id == null
            );
            return answer;
        }
    };

    const initiateEssayPoint = () => {
        const essayAnswers = answers.filter(
            (answer) => answer.choice_id === null
        );
        const newEssayPoints = essayAnswers
            .filter(
                (answer) => answer.point !== null && answer.point !== undefined
            )
            .map((answer) => ({
                question_id: answer.questions_id,
                point: answer.point as number,
            }));

        if (newEssayPoints.length > 0) {
            setData("essay_points", newEssayPoints);
        }
    };

    useEffect(() => {
        initiateEssayPoint();
    }, [answers]);

    const handleChangeEssayPoint = (questionId: number, value: number) => {
        const existing = data.essay_points.find(
            (item) => item.question_id === questionId
        );
        if (existing) {
            setData(
                "essay_points",
                data.essay_points.map((item) =>
                    item.question_id === questionId
                        ? { ...item, point: value }
                        : item
                )
            );
        } else {
            setData("essay_points", [
                ...data.essay_points,
                { question_id: questionId, point: value },
            ]);
        }
    };

    const removeEssayPoint = (questionId: number) => {
        setData(
            "essay_points",
            data.essay_points.filter((item) => item.question_id !== questionId)
        );
    };

    const handleSaveEssayPoint = () => {
        put(
            `/peneliti/result/${meta_information.questionnaire_id}/${meta_information.participant_id}`,
            {
                replace: true,
                preserveState: true,
            }
        );
    };

    const MetaInformationKeyValue = (key: string, value: string | number) => {
        return (
            <div className="flex flex-col items-start">
                <span className="font-bold text-slate-500 text-sm">{key}</span>
                <span className="text-base">{value}</span>
            </div>
        );
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
                                                                {choice.point ===
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
                                                                ) ===
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
                                                        {essayAnswer?.point ===
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
                                                        className="border rounded-md p-2 min-h-[150px]"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                essayAnswer.essay_answer ||
                                                                "-",
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="italic">
                                                        Siswa tidak menjawab
                                                    </span>
                                                )}
                                                <div className="mt-2 flex items-center gap-2">
                                                    <SelectSearchInput
                                                        placeholder="Poin untuk jawaban essay"
                                                        options={[
                                                            {
                                                                value: "0",
                                                                label: "0 Poin",
                                                            },
                                                            {
                                                                value: "1",
                                                                label: "1 Poin",
                                                            },
                                                            {
                                                                value: "2",
                                                                label: "2 Poin",
                                                            },
                                                        ]}
                                                        removeValue={() =>
                                                            removeEssayPoint(
                                                                question.id
                                                            )
                                                        }
                                                        onChange={(value) =>
                                                            handleChangeEssayPoint(
                                                                question.id,
                                                                Number(value)
                                                            )
                                                        }
                                                        value={
                                                            data.essay_points
                                                                .find(
                                                                    (point) =>
                                                                        point.question_id ===
                                                                        question.id
                                                                )
                                                                ?.point?.toString() ||
                                                            ""
                                                        }
                                                    />
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            <div className="w-full ">
                <Button
                    variant={"green"}
                    disabled={data.essay_points.length === 0 || processing}
                    size={"lg"}
                    className="flex items-center w-full gap-2"
                    onClick={handleSaveEssayPoint}
                >
                    {processing ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save />
                            <span>Simpan Koreksi Jawaban</span>
                        </span>
                    )}
                </Button>
            </div>
        </AppLayout>
    );
};

export default QuestionnaireResultShow;
