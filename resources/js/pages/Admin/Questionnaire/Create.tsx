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
import { PageTitleProps } from "@/types/global";
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

const QuestionnaireCreate = ({ title, description }: PageTitleProps) => {
    const choiceLetters = ["A", "B", "C", "D", "E"];
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            name: "",
            description: "",
            questions: [
                {
                    question: "",
                    choices: choiceLetters.map(() => ({
                        choice: "",
                        point: 0,
                    })),
                },
            ],
        });

    const newQuestion = () => {
        setData("questions", [
            ...data.questions,
            {
                question: "",
                choices: choiceLetters.map((letter) => ({
                    choice: "",
                    point: 0,
                })),
            },
        ]);
    };

    const removeQuestion = (index: number) => {
        setData(
            "questions",
            data.questions.filter((_, i) => i !== index)
        );
    };

    const handleChangeQuestionnaire = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setData(e.target.name as "name" | "description", e.target.value);
    };

    const handleChangeQuestion = (questionIdx: number, value: string) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIdx].question = value;
        setData("questions", newQuestions);
    };

    const handleChangeChoice = (
        questionIdx: number,
        choiceIdx: number,
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIdx].choices[choiceIdx][
            e.target.name as "choice"
        ] = e.target.value;
        setData("questions", newQuestions);
    };

    const handleChangeChoicePoint = (
        questionIdx: number,
        choiceIdx: number,
        value: number
    ) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIdx].choices[choiceIdx].point = value;
        setData("questions", newQuestions);
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

        data.questions.forEach((q) => {
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
        post("/admin/questionnaire", {
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                            onClick={newQuestion}
                            type="button"
                        >
                            <PlusCircle />
                            <span>Tambah Pertanyaan</span>
                        </Button>
                    </div>
                </div>
                {data.questions.map((question, questionIdx) => (
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
                                {questionIdx > 0 && (
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
                                            height={215}
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
                >
                    <Save />
                    <span>Simpan</span>
                </Button>
            </form>
        </AppLayout>
    );
};

export default QuestionnaireCreate;
