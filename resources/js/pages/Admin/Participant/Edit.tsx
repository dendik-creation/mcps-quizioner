import { ErrorInput, SelectSearchInput } from "@/components/custom/FormElement";
import { generateRandomString } from "@/components/helper/rand_string";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import {
    ParticipantEditProps,
    ParticipantFormProps,
} from "@/types/participant";
import { UserEditProps, UserFormProps } from "@/types/user";
import { useForm } from "@inertiajs/react";
import { Dices, Loader, Save } from "lucide-react";
import React from "react";

const ParticipantEdit = ({
    title,
    description,
    participant,
    schools,
}: ParticipantEditProps) => {
    const {
        data,
        setData,
        errors,
        setError,
        put,
        processing,
        clearErrors,
        reset,
    } = useForm<ParticipantFormProps>({
        nisn: participant.nisn || null,
        fullname: participant.fullname || null,
        class: participant.class || null,
        school_id: participant.school_id || null,
    });

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as keyof ParticipantFormProps, e.target.value);
    };

    const handleChangeSelect = (value: string) => {
        setData("school_id", Number(value));
    };

    const validateForm = (): boolean => {
        let valid = true;
        clearErrors();

        if (!data.nisn || data.nisn.trim() === "") {
            setError("nisn", "NISN wajib diisi");
            valid = false;
        }
        if (!data.fullname || data.fullname.trim() === "") {
            setError("fullname", "Nama wajib diisi");
            valid = false;
        }
        if (!data.class) {
            setError("class", "Kelas wajib dipilih");
            valid = false;
        }
        if (!data.school_id) {
            setError("school_id", "Sekolah wajib dipilih");
            valid = false;
        }

        return valid;
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        put(`/admin/participant/${participant?.id}`, {
            replace: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            NISN
                        </label>
                        <Input
                            type="text"
                            name="nisn"
                            id="nisn"
                            placeholder="Masukkan NISN"
                            value={data.nisn ?? ""}
                            onChange={handleChangeInput}
                            className={cn(errors.nisn && "border-red-500")}
                        />
                        {errors.nisn && <ErrorInput error={errors.nisn} />}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Nama Lengkap
                        </label>
                        <Input
                            type="text"
                            name="fullname"
                            id="fullname"
                            placeholder="Masukkan Nama Lengkap"
                            value={data.fullname ?? ""}
                            onChange={handleChangeInput}
                            className={cn(errors.fullname && "border-red-500")}
                        />
                        {errors.fullname && (
                            <ErrorInput error={errors.fullname} />
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Sekolah
                        </label>
                        <SelectSearchInput
                            placeholder="Pilih Sekolah"
                            options={schools}
                            className="h-9"
                            removeValue={() => setData("school_id", "")}
                            onChange={(value) =>
                                handleChangeSelect(value.toString())
                            }
                            value={(data.school_id as string) ?? ""}
                        />
                        {errors.school_id && (
                            <ErrorInput error={errors.school_id} />
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Kelas
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                name="class"
                                id="class"
                                placeholder="Masukkan Kelas"
                                value={data.class ?? ""}
                                onChange={handleChangeInput}
                                className={cn(errors.class && "border-red-500")}
                            />
                        </div>
                        {errors.class && <ErrorInput error={errors.class} />}
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

export default ParticipantEdit;
