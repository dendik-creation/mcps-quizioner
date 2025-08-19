import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { SchoolIndexProps } from "@/types/school";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import NotFoundInTable from "@/components/custom/NotFoundInTable";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ErrorInput } from "@/components/custom/FormElement";
import { cn } from "@/lib/utils";

const SchoolIndex = ({ title, description, schools }: SchoolIndexProps) => {
    const [formMode, setFormMode] = useState<"CREATE" | "EDIT" | null>(null);
    const { data, setData, post, put, errors, setError, clearErrors } =
        useForm<{
            id: number | null;
            name: string;
        }>({
            id: null,
            name: "",
        });

    const handleFormMode = React.useCallback(
        (mode: "CREATE" | "EDIT" | null) => {
            setFormMode(mode);
        },
        []
    );

    const handleEdit = React.useCallback(
        (school: { id: number; name: string }) => {
            setFormMode("EDIT");
            setData({
                id: school.id,
                name: school.name,
            });
        },
        [setData]
    );

    const handleDestroy = React.useCallback((schoolId: number) => {
        router.delete(`/admin/school/${schoolId}`);
    }, []);

    const validateForm = React.useCallback((): boolean => {
        clearErrors();
        let isValid = true;

        if (!data.name) {
            setError("name", "Nama sekolah harus diisi");
            isValid = false;
        }

        return isValid;
    }, [data.name, setError, clearErrors]);

    const handleSubmit = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!validateForm()) return;

            if (formMode === "CREATE") {
                post("/admin/school", {
                    onSuccess: () => {
                        setData({ id: null, name: "" });
                        setFormMode(null);
                    },
                });
            } else if (formMode === "EDIT") {
                put(`/admin/school/${data.id}`, {
                    onSuccess: () => {
                        setData({ id: null, name: "" });
                        setFormMode(null);
                    },
                });
            }
        },
        [validateForm, formMode, post, put, data.id, setData]
    );

    return (
        <AppLayout>
            <div className="flex justify-between items-center">
                <PageTitle title={title} description={description} />
                {formMode != null ? (
                    <Button
                        variant={"red"}
                        onClick={() => handleFormMode(null)}
                        className="flex items-center gap-2"
                    >
                        <X />
                        <span>Batalkan</span>
                    </Button>
                ) : (
                    <Button
                        variant={"green"}
                        onClick={() => handleFormMode("CREATE")}
                        className="flex items-center gap-2"
                    >
                        <Plus />
                        <span>Tambah Sekolah</span>
                    </Button>
                )}
            </div>

            {formMode != null && (
                <form
                    onSubmit={handleSubmit}
                    className="flex items-end mb-4 gap-2"
                >
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-2">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                Nama Sekolah
                            </label>
                            <span className="mb-2">
                                {errors.name && (
                                    <ErrorInput error={errors.name} />
                                )}
                            </span>
                        </div>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            placeholder="Masukkan nama sekolah"
                            value={data.name ?? ""}
                            onChange={(e) => setData("name", e.target.value)}
                            className={cn(errors.name && "border-red-500")}
                        />
                    </div>
                    <Button
                        variant={"green"}
                        type="submit"
                        className="flex items-center w-1/6 gap-2"
                    >
                        <Save />
                        <span>Simpan</span>
                    </Button>
                </form>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-amber-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Nama Sekolah
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Jumlah Siswa
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.length ? (
                            schools.map((school, idx) => (
                                <TableRow key={school.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{school.name}</TableCell>
                                    <TableCell>
                                        {school?.participants?.length ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/school/${school.id}`}
                                            >
                                                <Button
                                                    variant={"blue"}
                                                    size={"icon"}
                                                    type="button"
                                                >
                                                    <Eye />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant={"yellow"}
                                                size={"icon"}
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(school)
                                                }
                                            >
                                                <Pencil />
                                            </Button>
                                            <ConfirmDialog
                                                title="Hapus User"
                                                description={`Apakah Anda yakin ingin menghapus school ${school.name}?`}
                                                triggerNode={
                                                    <span>
                                                        <Button
                                                            type="button"
                                                            variant={"red"}
                                                            size={"icon"}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </span>
                                                }
                                                type="danger"
                                                confirmAction={() =>
                                                    handleDestroy(
                                                        school.id as number
                                                    )
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <NotFoundInTable colSpan={4} />
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

export default SchoolIndex;
