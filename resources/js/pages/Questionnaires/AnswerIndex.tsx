import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RichTextEditorInput } from "@/components/custom/FormElement";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import { ListTodo, Timer, ClipboardList } from "lucide-react";
import { removeLocalStorage } from "@/lib/local_storage";
import { ChoiceItem } from "@/components/ui/choice-item";
import { NumberGrid } from "@/components/ui/number-grid";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import type { Questionnaire } from "@/types/questionnaire";
import type { Setting } from "@/types/setting";

interface ChoiceAnswer {
    index: number;
    questionId: number;
    choices: number[];
}

class EssayAnswerClass {
    index!: number;
    questionId!: number;
    essay: string = "<p><br></p>";
}
interface EssayAnswer extends EssayAnswerClass {}
export default function AnswerIndex({
    app_name,
    questionnaire,
    setting,
}: {
    app_name: string;
    questionnaire: Questionnaire;
    setting: Setting;
}) {
    const { flash } = usePage().props as any;
    const stripHtml = (str: string) => str.replace(/<[^>]*>/g, "").trim();

    const [choiceAnswers, setChoiceAnswers] = useState<ChoiceAnswer[]>(() => {
        const saved = localStorage.getItem("choiceAnswers");
        return saved && saved !== "[]"
            ? JSON.parse(saved)
            : questionnaire.questions.map((q, index) => ({
                  index,
                  questionId: q.id,
                  choices: [],
              }));
    });

    const [essayAnswers, setEssayAnswers] = useState<EssayAnswer[]>(() => {
        const saved = localStorage.getItem("essayAnswers");
        return saved && saved !== "[]"
            ? JSON.parse(saved)
            : questionnaire.questions.map((q, index) => ({
                  index,
                  questionId: q.id,
                  essay: "<p><br></p>",
              }));
    });

    const [currentQuestion, setCurrentQuestion] = useState(() => {
        const saved = localStorage.getItem("currentQuestion");
        return saved ? Number(saved) : 0;
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem("timeLeft");
        return saved && saved !== "0"
            ? Number(saved)
            : (setting?.questionnary_time ?? 10) * 60;
    });

    useEffect(() => {
        localStorage.setItem("currentQuestion", String(currentQuestion));
        localStorage.setItem("choiceAnswers", JSON.stringify(choiceAnswers));
        localStorage.setItem("essayAnswers", JSON.stringify(essayAnswers));
        localStorage.setItem("timeLeft", String(timeLeft));
    }, [currentQuestion, choiceAnswers, essayAnswers, timeLeft]);

    useEffect(() => {
        if (flash?.success) BlastToaster("success", flash.success);
        else if (flash?.error) BlastToaster("error", flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (typeof window !== "undefined") removeLocalStorage("current_role");
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
            if (timeLeft === 0) handleAnswer();
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const activeQuestion = questionnaire.questions[currentQuestion];
    const maxChoiceByQuestion = activeQuestion.choices.filter(
        (choice) => Number(choice.point) == 1
    ).length;

    const toggleSelectChoice = (index: number, choiceId: number) => {
        setChoiceAnswers((prev) =>
            prev.map((ans) =>
                ans.index === index
                    ? {
                          ...ans,
                          choices: ans.choices.includes(choiceId)
                              ? ans.choices.filter((id) => id !== choiceId)
                              : ans.choices.length < maxChoiceByQuestion
                              ? [...ans.choices, choiceId]
                              : ans.choices,
                      }
                    : ans
            )
        );
    };

    const handleEssayChange = (index: number, content: string) => {
        setEssayAnswers((prev) =>
            prev.map((ans) =>
                ans.index === index ? { ...ans, essay: content } : ans
            )
        );
    };

    const answeredQuestions: number[] = questionnaire.questions
        .map((q, index) => {
            const choiceAns = choiceAnswers[index];
            const essayAns = essayAnswers[index];

            const hasChoice = (choiceAns?.choices?.length ?? 0) > 0;
            const hasEssay = essayAns
                ? stripHtml(essayAns.essay).length > 0
                : false;

            return hasChoice || hasEssay ? index + 1 : null; // 1-based untuk grid
        })
        .filter(Boolean) as number[];

    const goNext = () => {
        if (currentQuestion < questionnaire.questions.length - 1)
            setCurrentQuestion(currentQuestion + 1);
    };

    const goBack = () => {
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    };

    const handleAnswer = () => {
        const payload = {
            questionnaire_id: questionnaire.id,
            choices: JSON.stringify(
                choiceAnswers.map(({ questionId, choices }) => ({
                    questionId,
                    choices,
                }))
            ),
            essays: JSON.stringify(
                essayAnswers.map(({ questionId, essay }) => ({
                    questionId,
                    essay,
                }))
            ),
            timeLeft,
        };

        router.post(`/questionnaire/in-progress`, payload, {
            preserveScroll: true,
            onError: (errors) => {
                return BlastToaster("error", errors.message);
            },
            onSuccess: () => {
                setCurrentQuestion(0);
                setChoiceAnswers([]);
                setEssayAnswers([]);
                setCurrentQuestion(0);
                setTimeLeft(0);

                localStorage.removeItem("timeLeft");
                localStorage.removeItem("choiceAnswers");
                localStorage.removeItem("essayAnswers");
                localStorage.removeItem("currentQuestion");

                setTimeout(() => {
                    router.post(
                        "/auth/unregister",
                        {},
                        {
                            preserveScroll: true,
                            onError: (errors) => {
                                BlastToaster("error", errors.message);
                            },
                            onSuccess: () => {
                                BlastToaster("success", "Berhasil keluar");
                            },
                        }
                    );
                }, 1000);
            },
        });
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div className="grid grid-cols-12 h-screen bg-gray-50 dark:bg-background p-4 gap-4 overflow-hidden">
            <Toaster position={"bottom-right"} reverseOrder={false} />

            <Card className="col-span-12 md:col-span-2 shadow-md flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 rounded-md py-1">
                        <Timer className="text-amber-600 w-10 h-10" />
                        <div className="flex flex-col">
                            <h2 className="font-semibold text-sm">
                                Sisa Waktu
                            </h2>
                            <div className="text-2xl font-bold text-amber-600">
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-md bg-emerald-400 border border-emerald-500"></span>
                            <span>Terjawab</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-md bg-blue-400 border border-blue-500"></span>
                            <span>Aktif</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-md bg-gray-200 border border-gray-300"></span>
                            <span>Belum</span>
                        </div>
                    </div>

                    <h2 className="text-sm font-semibold mb-2">Nomor Soal</h2>
                    <NumberGrid
                        total={questionnaire.questions.length}
                        selected={currentQuestion + 1}
                        onSelect={(num) => setCurrentQuestion(num - 1)}
                        answered={answeredQuestions}
                    />
                </CardContent>
            </Card>

            <Card className="col-span-12 md:col-span-10 shadow-md flex flex-col overflow-y-auto h-screen">
                <CardHeader>
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3 flex items-start gap-3">
                        <ClipboardList className="text-amber-600 w-7 h-7 flex-shrink-0" />
                        <div className="flex flex-col">
                            <h3 className="text-amber-600 font-semibold text-lg">
                                {questionnaire.name || "Judul Tes"}
                            </h3>
                            <p className="text-sm text-amber-600">
                                {questionnaire.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <ListTodo className="text-amber-500 w-6 h-6 flex-shrink-0" />
                        <div className="flex items-start gap-2 flex-1">
                            <span className="font-semibold text-lg">
                                {currentQuestion + 1}.
                            </span>
                            <div
                                className="text-lg"
                                dangerouslySetInnerHTML={{
                                    __html: activeQuestion.question,
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1">
                            Jawaban Tier 1 (max {maxChoiceByQuestion})
                        </label>
                        <div className="flex flex-col gap-2">
                            {activeQuestion.choices.map((choice, index) => {
                                const selected = choiceAnswers
                                    .find(
                                        (a) =>
                                            a.questionId === activeQuestion.id
                                    )
                                    ?.choices.includes(choice.id);
                                return (
                                    <ChoiceItem
                                        key={choice.id}
                                        index={index}
                                        text={choice.choice}
                                        selected={selected ?? false}
                                        onSelect={() =>
                                            toggleSelectChoice(
                                                currentQuestion,
                                                choice.id
                                            )
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1">Jawaban Tier 2</label>
                        <RichTextEditorInput
                            height={300}
                            content={
                                essayAnswers.find(
                                    (a) => a.index === currentQuestion
                                )?.essay ?? ""
                            }
                            onChange={(content) =>
                                handleEssayChange(currentQuestion, content)
                            }
                        />
                    </div>

                    <div className="flex justify-between">
                        <Button
                            variant={"yellow"}
                            className={`flex items-center gap-2 ${
                                currentQuestion == 0 ? "invisible" : ""
                            }`}
                            type="button"
                            onClick={goBack}
                        >
                            Back
                        </Button>

                        {currentQuestion ===
                        questionnaire.questions.length - 1 ? (
                            <ConfirmDialog
                                title="Submit Kuis"
                                description="Yakin akan melakukan submit ?"
                                triggerNode={
                                    <Button
                                        variant="green"
                                        className="flex items-center gap-2"
                                        type="button"
                                    >
                                        Submit
                                    </Button>
                                }
                                confirmAction={handleAnswer}
                                type="success"
                            />
                        ) : (
                            <Button
                                variant="blue"
                                className="flex items-center gap-2"
                                type="button"
                                onClick={goNext}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
