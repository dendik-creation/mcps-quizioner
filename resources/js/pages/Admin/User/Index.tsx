import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { UserIndexProps } from "@/types/user";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import NotFoundInTable from "@/components/custom/NotFoundInTable";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import { Link, router } from "@inertiajs/react";
import React from "react";

const UserIndex = ({ title, description, users }: UserIndexProps) => {
    const handleDeleteUser = (userId: number) => {
        router.delete(`/admin/user/${userId}`);
    };
    return (
        <AppLayout>
            <div className="flex justify-between items-center">
                <PageTitle title={title} description={description} />
                <Link href={"/admin/user/create"}>
                    <Button
                        variant={"green"}
                        className="flex items-center gap-2"
                    >
                        <Plus />
                        <span>Tambah User</span>
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-amber-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Username
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Nama Lengkap
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Role
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length ? (
                            users.map((user, idx) => (
                                <TableRow key={user.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>
                                        {user.role.charAt(0).toUpperCase() +
                                            user.role.slice(1).toLowerCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/user/${user.id}/edit`}
                                            >
                                                <Button
                                                    variant={"blue"}
                                                    size={"icon"}
                                                    type="button"
                                                >
                                                    <Pencil />
                                                </Button>
                                            </Link>
                                            {user.role !== "ADMIN" && (
                                                <ConfirmDialog
                                                    title="Hapus User"
                                                    description={`Apakah Anda yakin ingin menghapus user ${user.name}?`}
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
                                                        handleDeleteUser(
                                                            user.id as number
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <NotFoundInTable colSpan={5} />
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

export default UserIndex;
