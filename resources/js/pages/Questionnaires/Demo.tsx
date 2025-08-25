import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RichTextEditorInput } from "@/components/custom/FormElement";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import { ListTodo } from "lucide-react";
import { removeLocalStorage } from "@/lib/local_storage";
import { ChoiceItem } from "@/components/ui/choice-item";
import { NumberGrid } from "@/components/ui/number-grid";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/custom/ConfirmDialog";

// data soal
const questions = [
    {
        id: 1,
        text: "Apakah anda memahami cara mengerjakan kuis ini?",
        choices: [
            "Tidak paham",
            "Cukup paham",
            "Paham",
            "Sangat paham",
            "Amat paham",
        ],
    },
    {
        id: 2,
        text: "Apakah anda sudah terbiasa menggunakan aplikasi berbasis web?",
        choices: [
            "Tidak terbiasa",
            "Kurang terbiasa",
            "Cukup terbiasa",
            "Terbiasa",
            "Sangat terbiasa",
        ],
    },
    {
        id: 3,
        text: "Seberapa yakin anda bisa menyelesaikan kuis ini?",
        choices: [
            "Tidak yakin",
            "Kurang yakin",
            "Cukup yakin",
            "Yakin",
            "Sangat yakin",
        ],
    },
];

export default function Registration({ app_name }: { app_name: string }) {
    const { flash } = usePage().props as any;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[][]>(
        Array(questions.length).fill([])
    );
    const [essayAnswers, setEssayAnswers] = useState<string[]>(
        Array(questions.length).fill("")
    );

    const maxChoice = 2;

    useEffect(() => {
        if (flash?.success) {
            BlastToaster("success", flash.success);
        } else if (flash?.error) {
            BlastToaster("error", flash.error);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            removeLocalStorage("current_role");
        }
    }, []);

    const toggleSelectChoice = (choiceIdx: number) => {
        const updated = [...answers];
        const selectedForCurrent = [...updated[currentQuestion]];

        if (selectedForCurrent.includes(choiceIdx)) {
            updated[currentQuestion] = selectedForCurrent.filter(
                (i) => i !== choiceIdx
            );
        } else {
            if (selectedForCurrent.length < maxChoice) {
                updated[currentQuestion] = [...selectedForCurrent, choiceIdx];
            }
        }

        setAnswers(updated);
    };

    const handleEssayChange = (content: string) => {
        const updated = [...essayAnswers];
        updated[currentQuestion] = content;
        setEssayAnswers(updated);
    };

    const answeredQuestions = questions
        .map((q, idx) => {
            const hasChoice = answers[idx]?.length > 0;
            const hasEssay = essayAnswers[idx]?.trim().length > 0;
            return hasChoice || hasEssay ? idx + 1 : null;
        })
        .filter(Boolean) as number[];

    const activeQuestion = questions[currentQuestion];

    const goNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const goBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-background">
            <Toaster position={"bottom-right"} reverseOrder={false} />
            <Card className="w-full max-w-7xl shadow-md mx-4 flex flex-col md:flex-col p-3">
                <CardHeader className="px-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold text-2xl">Demo</h2>
                        <span className="text-slate-700">
                            Demo mengerjakan kuis.
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="px-3">
                    <div className="flex items-center gap-3">
                        <ListTodo className="text-slate-400" />
                        <h3 className="font-semibold">
                            {currentQuestion + 1} - {activeQuestion.text}
                        </h3>
                    </div>

                    {/* pilihan */}
                    <div className="flex flex-col w-full mt-5 gap-4">
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1">
                                Pilihan Jawaban (max 2)
                            </label>
                            <div className="flex flex-col gap-2">
                                {activeQuestion.choices.map(
                                    (choice, choiceIdx) => (
                                        <ChoiceItem
                                            key={choiceIdx}
                                            index={choiceIdx}
                                            text={choice}
                                            selected={answers[
                                                currentQuestion
                                            ].includes(choiceIdx)}
                                            onSelect={() =>
                                                toggleSelectChoice(choiceIdx)
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>

                        {/* jawaban essai */}
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1">
                                Jawaban Essai
                            </label>
                            <div className="flex flex-col gap-2">
                                <RichTextEditorInput
                                    height={215}
                                    content={essayAnswers[currentQuestion]}
                                    onChange={handleEssayChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Button Navigasi */}
                    <div className="flex justify-between mt-3">
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

                        {currentQuestion === questions.length - 1 ? (
                            <ConfirmDialog
                                title="Demo Selesai"
                                description="Anda telah menyelesaikan demo, mengerjakan kuis sekarang ?"
                                triggerNode={
                                    <Button
                                        variant="green"
                                        className="flex items-center gap-2"
                                        type="button"
                                    >
                                        Submit
                                    </Button>
                                }
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

                    {/* navigasi soal */}
                    <div className="flex flex-col md:flex-col p-2 mt-8 border rounded-md gap-3">
                        {/* Legend */}
                        <div className="flex gap-4 text-sm">
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
                                <span>Belum Terjawab</span>
                            </div>
                        </div>
                        <h2 className="text-sm font-semibold">Nomor Soal</h2>
                        <NumberGrid
                            total={questions.length}
                            selected={currentQuestion + 1}
                            onSelect={(num) => setCurrentQuestion(num - 1)}
                            answered={answeredQuestions}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
