import { ErrorInput } from "@/components/custom/FormElement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { SettingIndexProps } from "@/types/setting";
import { useForm } from "@inertiajs/react";
import { Loader, Save } from "lucide-react";
import React from "react";

const SettingIndex = ({ title, description, setting }: SettingIndexProps) => {
    const { data, setData, errors, clearErrors, setError, put, processing } =
        useForm({
            id: setting?.id,
            app_name: setting?.app_name,
            questionnary_time: setting?.questionnary_time,
        });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as keyof typeof data, e.target.value);
    };
    const validateForm = (): boolean => {
        clearErrors();
        let isValid = true;

        if (!data.app_name) {
            setError("app_name", "Nama aplikasi harus diisi");
            isValid = false;
        }

        if (!data.questionnary_time) {
            setError("questionnary_time", "Durasi waktu kuesioner harus diisi");
            isValid = false;
        }

        return isValid;
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        put("/admin/setting", {
            replace: true,
            preserveState: true,
        });
    };
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Nama Aplikasi
                        </label>
                        <Input
                            type="text"
                            name="app_name"
                            id="app_name"
                            placeholder="Masukkan Nama Aplikasi"
                            value={data.app_name ?? ""}
                            onChange={handleChange}
                            className={cn(errors.app_name && "border-red-500")}
                        />
                        {errors.app_name && (
                            <ErrorInput error={errors.app_name} />
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Durasi Waktu Kuesioner (menit)
                        </label>
                        <Input
                            type="number"
                            name="questionnary_time"
                            id="questionnary_time"
                            placeholder="Masukkan durasi waktu"
                            value={data.questionnary_time ?? ""}
                            onChange={handleChange}
                            className={cn(
                                errors.questionnary_time && "border-red-500"
                            )}
                        />
                        {errors.questionnary_time && (
                            <ErrorInput error={errors.questionnary_time} />
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                    variant={"green"}
                    className="w-full mt-4 p-3"
                    disabled={processing}
                >
                    {processing ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save />
                            <span>Simpan</span>
                        </span>
                    )}
                </Button>
            </form>
        </AppLayout>
    );
};

export default SettingIndex;
