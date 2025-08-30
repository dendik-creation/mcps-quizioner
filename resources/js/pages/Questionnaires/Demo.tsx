import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RichTextEditorInput } from "@/components/custom/FormElement";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import { ListTodo, Timer } from "lucide-react";
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

export default function Demo({ app_name }: { app_name: string }) {
    const { flash } = usePage().props as any;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[][]>(
        Array(questions.length).fill([])
    );
    const [essayAnswers, setEssayAnswers] = useState<string[]>(
        Array(questions.length).fill("")
    );

    const maxChoice = 2;
    const [timeLeft, setTimeLeft] = useState(600);

    useEffect(() => {
        if (flash?.success) BlastToaster("success", flash.success);
        else if (flash?.error) BlastToaster("error", flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (typeof window !== "undefined") removeLocalStorage("current_role");
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

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
        if (currentQuestion < questions.length - 1)
            setCurrentQuestion(currentQuestion + 1);
    };

    const goBack = () => {
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    };

    const handleAnswer = () => {
        router.get(`/questionnaire/in-progress`);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div className="grid grid-cols-12 h-screen bg-gray-50 dark:bg-background p-4 gap-4">
            <Toaster position={"bottom-right"} reverseOrder={false} />

            <Card className="col-span-12 md:col-span-2 shadow-md flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-center gap-3 bg-amber-100 border border-amber-200 rounded-md py-1">
                        <Timer className="text-amber-500 w-10 h-10" />
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
                        total={questions.length}
                        selected={currentQuestion + 1}
                        onSelect={(num) => setCurrentQuestion(num - 1)}
                        answered={answeredQuestions}
                    />
                </CardContent>
            </Card>

            <Card className="col-span-12 md:col-span-10 shadow-md flex flex-col">
                <CardHeader>
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                        <h3 className="text-amber-700 font-semibold">Demo</h3>
                        <p className="text-sm text-amber-600">
                            Ini adalah demo kuis, silahkan coba ikuti demo.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ListTodo className="text-amber-500" />
                        <h3 className="font-semibold text-lg">
                            {currentQuestion + 1} - {activeQuestion.text}
                        </h3>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1">
                            Pilihan Jawaban (max 2)
                        </label>
                        <div className="flex flex-col gap-2">
                            {activeQuestion.choices.map((choice, choiceIdx) => (
                                <ChoiceItem
                                    key={choiceIdx}
                                    index={choiceIdx}
                                    text={choice}
                                    selected={answers[currentQuestion].includes(
                                        choiceIdx
                                    )}
                                    onSelect={() =>
                                        toggleSelectChoice(choiceIdx)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1">Jawaban Essai</label>
                        <RichTextEditorInput
                            height={300}
                            content={essayAnswers[currentQuestion]}
                            onChange={handleEssayChange}
                        />
                    </div>
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
