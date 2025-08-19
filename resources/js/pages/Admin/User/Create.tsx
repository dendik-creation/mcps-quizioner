import { ErrorInput, SelectSearchInput } from "@/components/custom/FormElement";
import { generateRandomString } from "@/components/helper/rand_string";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { PageTitleProps } from "@/types/global";
import { UserFormProps } from "@/types/user";
import { useForm } from "@inertiajs/react";
import { Dices, Loader, Save } from "lucide-react";
import React from "react";

const UserCreate = ({ title, description }: PageTitleProps) => {
    const {
        data,
        setData,
        errors,
        setError,
        post,
        processing,
        clearErrors,
        reset,
    } = useForm<UserFormProps>({
        username: "",
        name: "",
        role: "",
        password: "",
    });

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as keyof UserFormProps, e.target.value);
    };

    const handleChangeSelect = (value: string) => {
        setData("role", value);
    };

    const handleGeneratePassword = (length: number) => {
        const rand = generateRandomString(length);
        setData("password", rand);
    };

    const validateForm = (): boolean => {
        let valid = true;
        clearErrors();

        if (!data.username || data.username.trim() === "") {
            setError("username", "Username wajib diisi");
            valid = false;
        }
        if (!data.name || data.name.trim() === "") {
            setError("name", "Nama wajib diisi");
            valid = false;
        }
        if (!data.role || (data.role !== "ADMIN" && data.role !== "PENELITI")) {
            setError("role", "Role wajib dipilih");
            valid = false;
        }
        if (!data.password || data.password.trim() === "") {
            setError("password", "Password wajib diisi");
            valid = false;
        } else if (data.password.length < 6) {
            setError("password", "Password minimal 6 karakter");
            valid = false;
        }

        return valid;
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        post("/admin/user", {
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
                            Username
                        </label>
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Masukkan username"
                            value={data.username ?? ""}
                            onChange={handleChangeInput}
                            className={cn(errors.username && "border-red-500")}
                        />
                        {errors.username && (
                            <ErrorInput error={errors.username} />
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Nama Lengkap
                        </label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Masukkan name"
                            value={data.name ?? ""}
                            onChange={handleChangeInput}
                            className={cn(errors.name && "border-red-500")}
                        />
                        {errors.name && <ErrorInput error={errors.name} />}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Role
                        </label>
                        <SelectSearchInput
                            placeholder="Pilih role"
                            options={[
                                {
                                    label: "Admin",
                                    value: "ADMIN",
                                },
                                {
                                    label: "Peneliti",
                                    value: "PENELITI",
                                },
                            ]}
                            className="h-9"
                            removeValue={() => setData("role", "")}
                            onChange={(value) =>
                                handleChangeSelect(value.toString())
                            }
                            value={data.role ?? ""}
                        />
                        {errors.role && <ErrorInput error={errors.role} />}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                name="password"
                                id="password"
                                placeholder="Masukkan password"
                                value={data.password ?? ""}
                                onChange={handleChangeInput}
                                className={cn(
                                    errors.password && "border-red-500",
                                    "pr-36"
                                )}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                                <Button
                                    variant={"purple"}
                                    size={"sm"}
                                    type="button"
                                    className="pointer-events-auto"
                                    onClick={() => handleGeneratePassword(8)}
                                >
                                    <Dices />
                                    <span>Generate password</span>
                                </Button>
                            </div>
                        </div>
                        {errors.password && (
                            <ErrorInput error={errors.password} />
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

export default UserCreate;
