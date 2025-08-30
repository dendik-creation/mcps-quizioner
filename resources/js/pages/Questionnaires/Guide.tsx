import { useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import { Button } from "@/components/ui/button";
import { removeLocalStorage } from "@/lib/local_storage";
import { Info, CheckCircle2, Clock, Shield } from "lucide-react";

export default function Guide({ app_name }: { app_name: string }) {
    const { flash } = usePage().props as any;

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

    const handleStart = () => {
        router.get("/demo");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-white dark:bg-background">
            <Toaster position={"bottom-right"} reverseOrder={false} />
            <Card className="w-full max-w-4xl shadow-lg rounded-2xl border border-amber-200">
                <CardHeader className="px-6 py-5 border-b bg-amber-50 rounded-t-2xl">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold text-3xl text-amber-600">
                            Panduan Kuisioner
                        </h2>
                        <span className="text-slate-600">
                            Mohon baca instruksi berikut sebelum memulai
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="px-8 py-6 space-y-6 bg-white rounded-b-2xl">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <Info className="w-6 h-6 text-amber-500 mt-1" />
                            <p className="text-slate-700">
                                Kuis ini berfokus pada <b>materi Matematika</b>{" "}
                                untuk mengukur pemahaman dan kemampuan berhitung.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-amber-500 mt-1" />
                            <p className="text-slate-700">
                                Waktu pengerjaan maksimal <b>120 menit</b>.
                                Gunakan waktu dengan baik untuk menyelesaikan
                                soal perhitungan.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-amber-500 mt-1" />
                            <p className="text-slate-700">
                                Pastikan Anda menjawab{" "}
                                <b>seluruh soal</b>, termasuk soal
                                pilihan ganda dan esai perhitungan.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-amber-500 mt-1" />
                            <p className="text-slate-700">
                                Jawaban Anda akan digunakan hanya untuk
                                keperluan evaluasi <b>kemampuan matematika</b>.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <Button
                            size="lg"
                            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl shadow-md transition"
                            onClick={handleStart}
                        >
                            Mulai Demo
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
