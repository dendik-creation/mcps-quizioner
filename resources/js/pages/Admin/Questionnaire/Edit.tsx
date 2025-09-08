import BlastToaster from "@/components/custom/BlastToaster";
import {
    ErrorInput,
    RichTextEditorInput,
} from "@/components/custom/FormElement";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { QuestionnaireEditProps } from "@/types/questionnaire";
import { useForm } from "@inertiajs/react";
import {
    ClipboardList,
    ListTodo,
    MinusCircle,
    PlusCircle,
    Save,
} from "lucide-react";
import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const choiceLetters = ["A", "B", "C", "D"];

type Choice = {
    id?: number | null;
    choice: string;
    point: number;
};

type Question = {
    id?: number | null;
    question: string;
    choices: Choice[];
};

interface FormData {
    name: string;
    description: string;
    is_open: boolean | number;
    saved_questions: Question[];
    new_questions: Omit<Question, "id">[];
    deleted_questions: number[];
}

const QuestionnaireEdit = ({
    title,
    description,
    questionnaire,
}: QuestionnaireEditProps) => {
    const { data, setData, put, processing, errors, setError, clearErrors } =
        useForm<FormData>({
            name: questionnaire.name ?? "",
            description: questionnaire.description ?? "",
            is_open: Number(questionnaire.is_open) ?? false,
            saved_questions:
                questionnaire?.questions?.map((q) => ({
                    id: typeof q.id === "number" ? q.id : null,
                    question: q.question ?? "",
                    choices:
                        q.choices?.map((c) => ({
                            id: typeof c.id === "number" ? c.id : null,
                            choice: c.choice ?? "",
                            point: c.point ?? 1,
                        })) ?? [],
                })) ?? [],
            new_questions: [],
            deleted_questions: [],
        });

    const allQuestions: Question[] = [
        ...(data.saved_questions ?? []),
        ...(data.new_questions ?? []),
    ];

    const addNewQuestion = () => {
        setData("new_questions", [
            ...data.new_questions,
            {
                question: "",
                choices: choiceLetters.map(() => ({
                    choice: "",
                    point: 1,
                })),
            },
        ]);
    };

    const removeQuestion = (index: number) => {
        const savedCount = data.saved_questions.length;
        if (index < savedCount) {
            const removed = data.saved_questions[index];
            if (removed.id) {
                setData("deleted_questions", [
                    ...data.deleted_questions,
                    removed.id,
                ]);
            }
            setData(
                "saved_questions",
                data.saved_questions.filter((_, i) => i !== index)
            );
        } else {
            const newIdx = index - savedCount;
            setData(
                "new_questions",
                data.new_questions.filter((_, i) => i !== newIdx)
            );
        }
    };

    const handleChangeQuestion = (questionIdx: number, value: string) => {
        const savedCount = data.saved_questions.length;
        if (questionIdx < savedCount) {
            const newSaved = [...data.saved_questions];
            newSaved[questionIdx].question = value;
            setData("saved_questions", newSaved);
        } else {
            const newIdx = questionIdx - savedCount;
            const newNew = [...data.new_questions];
            newNew[newIdx].question = value;
            setData("new_questions", newNew);
        }
    };

    const handleChangeChoice = (
        questionIdx: number,
        choiceIdx: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const savedCount = data.saved_questions.length;
        if (questionIdx < savedCount) {
            const newSaved = [...data.saved_questions];
            newSaved[questionIdx].choices[choiceIdx][
                e.target.name as "choice"
            ] = e.target.value;
            setData("saved_questions", newSaved);
        } else {
            const newIdx = questionIdx - savedCount;
            const newNew = [...data.new_questions];
            newNew[newIdx].choices[choiceIdx][e.target.name as "choice"] =
                e.target.value;
            setData("new_questions", newNew);
        }
    };

    const handleChangeQuestionnaire = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setData(
            e.target.name as "name" | "description" | "is_open",
            e.target.value
        );
    };

    const handleChangeChoicePoint = (
        questionIdx: number,
        choiceIdx: number,
        value: number
    ) => {
        const newQuestions = [...data.saved_questions];
        newQuestions[questionIdx].choices[choiceIdx].point = value;
        setData("saved_questions", newQuestions);
    };

    const validateForm = (): boolean => {
        let valid = true;
        let hasToasterShown = false;
        clearErrors();

        if (!data.name.trim()) {
            setError("name", "Nama kuisioner wajib diisi");
            valid = false;
        }

        if (!data.description.trim()) {
            setError("description", "Deskripsi kuisioner wajib diisi");
            valid = false;
        }

        allQuestions.forEach((q) => {
            const cleanQuestion = q.question
                .replace(/<[^>]+>/g, "")
                .replace(/&nbsp;/g, "")
                .trim();
            if (!cleanQuestion) {
                valid = false;
                hasToasterShown = true;
            }
            q.choices.forEach((c) => {
                if (!c.choice || !c.choice.trim()) {
                    valid = false;
                    hasToasterShown = true;
                }
            });
        });

        if (hasToasterShown || !valid) {
            BlastToaster("error", "Lengkapi form terlebih dahulu");
        }

        return valid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        put("/admin/questionnaire/" + questionnaire.id, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <form onSubmit={handleSubmit} className="relative">
                <Card className="py-3 mb-14">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-3 mb-2">
                            <ClipboardList className="text-slate-400" />
                            <h3 className="font-semibold">
                                Informasi Kuisioner
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="flex flex-col w-full">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Nama
                                </label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Masukkan nama"
                                    value={data.name ?? ""}
                                    onChange={handleChangeQuestionnaire}
                                    className={cn(
                                        errors.name && "border-red-500"
                                    )}
                                />
                                {errors.name && (
                                    <ErrorInput error={errors.name} />
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Aktifkan Kuisioner{" "}
                                    <span className="text-sm">
                                        (Jika aktif, maka kuisioner lainnya
                                        dimatikan)
                                    </span>
                                </label>
                                <Switch
                                    name="is_open"
                                    id="is_open"
                                    checked={!!data.is_open}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            "is_open",
                                            checked ? true : false
                                        )
                                    }
                                    className={cn(
                                        "bg-blue-100",
                                        errors.is_open && "border-red-500"
                                    )}
                                />
                                {errors.is_open && (
                                    <ErrorInput error={errors.is_open} />
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    placeholder="Masukkan deskripsi"
                                    value={data.description ?? ""}
                                    onChange={handleChangeQuestionnaire}
                                    className={cn(
                                        "border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
                                        errors.description && "border-red-500"
                                    )}
                                    rows={2}
                                />
                                {errors.description && (
                                    <ErrorInput error={errors.description} />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* QUESTIONS */}
                <div className="flex mb-3 items-center justify-end w-full">
                    <div className="sticky z-10 bg-white py-2">
                        <Button
                            variant={"yellow"}
                            className="flex items-center gap-2"
                            onClick={addNewQuestion}
                            type="button"
                        >
                            <PlusCircle />
                            <span>Tambah Pertanyaan</span>
                        </Button>
                    </div>
                </div>
                {allQuestions.map((question, questionIdx) => (
                    <Card className="py-3 mb-4" key={questionIdx}>
                        <CardContent className="px-3">
                            <div className="flex justify-between items-center gap-3 mb-2">
                                <div className="flex items-center gap-3">
                                    <ListTodo className="text-slate-400" />
                                    <h3 className="font-semibold">
                                        Pertanyaan & Pilihan Jawab -{" "}
                                        {questionIdx + 1}
                                    </h3>
                                </div>
                                {allQuestions.length > 1 && (
                                    <Button
                                        type="button"
                                        size={"sm"}
                                        variant={"red"}
                                        onClick={() =>
                                            removeQuestion(questionIdx)
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <MinusCircle />
                                        <span>Hapus</span>
                                    </Button>
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col w-full">
                                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                            Pertanyaan
                                        </label>
                                        <RichTextEditorInput
                                            height={300}
                                            content={question.question}
                                            onChange={(val) =>
                                                handleChangeQuestion(
                                                    questionIdx,
                                                    val
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                            Pilihan Jawaban
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
                                                        <Input
                                                            type="text"
                                                            className="flex-1 ps-10"
                                                            name="choice"
                                                            value={
                                                                choice.choice
                                                            }
                                                            onChange={(e) =>
                                                                handleChangeChoice(
                                                                    questionIdx,
                                                                    choiceIdx,
                                                                    e
                                                                )
                                                            }
                                                        />
                                                        <div className="absolute right-3 top-0.5 rounded-r-md h-full flex items-center justify-center w-8">
                                                            <Tooltip>
                                                                <TooltipTrigger type="button">
                                                                    <Switch
                                                                        name="point"
                                                                        id="point"
                                                                        checked={
                                                                            choice.point ==
                                                                            1
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) =>
                                                                            handleChangeChoicePoint(
                                                                                questionIdx,
                                                                                choiceIdx,
                                                                                checked
                                                                                    ? 1
                                                                                    : 0
                                                                            )
                                                                        }
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        {choice.point ==
                                                                        1
                                                                            ? "Jawaban Benar"
                                                                            : "Jawaban Salah"}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <Button
                    type="submit"
                    variant={"blue"}
                    className="flex w-full items-center gap-2"
                    disabled={processing}
                >
                    <Save />
                    <span>Simpan</span>
                </Button>
            </form>
        </AppLayout>
    );
};

export default QuestionnaireEdit;
