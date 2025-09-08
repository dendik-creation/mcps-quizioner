import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { Participant, ParticipantIndexProps } from "@/types/participant";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import NotFoundInTable from "@/components/custom/NotFoundInTable";
import { PaginatorBuilder, SearchInput } from "@/components/custom/FormElement";
import { Link, router } from "@inertiajs/react";
import { inputDebounce } from "@/components/helper/input_debounce";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/custom/ConfirmDialog";

const ParticipantIndex = ({
    title,
    description,
    participants,
    search,
}: ParticipantIndexProps) => {
    const [searchValue, setSearchValue] = useState<string>(search || "");
    const [participantData, setParticipantData] = useState(participants.data);
    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/admin/participant",
            { search: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setParticipantData(
                        page.props.participants as Participant[]
                    );
                },
            }
        );
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    const handleDeleteParticipant = (id: number) => {
        router.delete(`/admin/participant/${id}`);
    };
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <div className="mb-4">
                <SearchInput
                    placeholder={`Cari nama, nisn, hingga nama sekolah`}
                    className="lg:max-w-sm w-full"
                    onChange={handleSearch}
                    value={searchValue || ""}
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-amber-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                NISN
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Nama Siswa
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Asal Sekolah
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Kelas
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participants.data.length ? (
                            participants.data.map((participant, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{participant.nisn}</TableCell>
                                    <TableCell>
                                        {participant.fullname}
                                    </TableCell>
                                    <TableCell>
                                        {participant.school?.name}
                                    </TableCell>
                                    <TableCell>{participant.class}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/participant/${participant.id}/edit`}
                                            >
                                                <Button
                                                    variant={"blue"}
                                                    size={"icon"}
                                                    type="button"
                                                >
                                                    <Pencil />
                                                </Button>
                                            </Link>
                                            <ConfirmDialog
                                                title="Hapus Siswa"
                                                description={`Menghapus siswa menyebabkan hilangnya histori jawaban kuis/tes yang telah ada. Apakah yakin?`}
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
                                                    handleDeleteParticipant(
                                                        participant.id as number
                                                    )
                                                }
                                            />
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
            {participants.total > participants.per_page && (
                <PaginatorBuilder
                    prevUrl={participants.prev_page_url ?? "#"}
                    nextUrl={participants.next_page_url ?? "#"}
                    currentPage={participants.current_page}
                    totalPage={participants.last_page}
                />
            )}
        </AppLayout>
    );
};

export default ParticipantIndex;
