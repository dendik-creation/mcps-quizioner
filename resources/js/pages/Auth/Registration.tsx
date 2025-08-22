import { useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ErrorInput, SelectSearchInput } from "@/components/custom/FormElement";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import { DoorOpen, FilePen, GraduationCap, IdCard, Key, Loader, LogIn, User } from "lucide-react";
import { useEffect } from "react";
import { removeLocalStorage } from "@/lib/local_storage";

export default function Registration({ app_name, schools }: { app_name: string, schools: any[] }) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, setError } = useForm({
        fullname: "",
        nisn: "",
        class: "",
        school_id: "",
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.fullname) setError("fullname", "Masukkan nama lengkap");
        if (!data.nisn) setError("nisn", "Masukkan nisn");
        if (!data.school_id) setError("school_id", "Pilih sekolah");
        if (!data.class) setError("class", "Masukkan kelas");
        if (!data.fullname || !data.nisn || !data.class || !data.school_id) return;

        post("/auth/register", {
            preserveScroll: true,
            replace: true,
            onError: (errors) => {
                return BlastToaster("error", errors.message);
            },
        });
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-background">
            <Toaster position={"bottom-right"} reverseOrder={false} />
            <Card className="w-full max-w-7xl shadow-md mx-4 flex flex-col md:flex-row">
                <div className="w-full flex flex-col justify-center p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-center font-bold text-2xl">
                            Registration
                        </CardTitle>
                        <CardDescription className="text-center">
                            Masukkan data diri anda untuk menjawab Kuisoner
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <User />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        autoFocus={true}
                                        value={data.fullname}
                                        onChange={(e) =>
                                            setData("fullname", e.target.value)
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.fullname
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.fullname && (
                                    <ErrorInput error={errors.fullname} />
                                )}
                            </div>
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <IdCard />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="NISN"
                                        value={data.nisn}
                                        onChange={(e) =>
                                            setData("nisn", e.target.value)
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.nisn
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.nisn && (
                                    <ErrorInput error={errors.nisn} />
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <GraduationCap />
                                    </span>
                                    <SelectSearchInput
                                        placeholder="Pilih Sekolah"
                                        options={schools}
                                        value={data.school_id}
                                        removeValue={() => setData("school_id", "")}
                                        onChange={(value) =>
                                            setData("school_id", String(value))
                                        }
                                        className={`pl-10 py-3 ${
                                            errors.school_id
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.school_id && (
                                    <ErrorInput error={errors.school_id} />
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <DoorOpen />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Kelas"
                                        value={data.class}
                                        onChange={(e) =>
                                            setData("class", e.target.value)
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.class
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.class && (
                                    <ErrorInput error={errors.class} />
                                )}
                            </div>
                            <Button
                                type="submit"
                                variant={"yellow"}
                                className="w-full p-6"
                                disabled={processing}
                            >
                                {processing ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span>Register</span>
                                        <LogIn />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}
