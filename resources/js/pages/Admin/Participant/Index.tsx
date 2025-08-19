import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { ParticipantIndexProps } from "@/types/participant";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";
import NotFoundInTable from "@/components/custom/NotFoundInTable";
import { PaginatorBuilder } from "@/components/custom/FormElement";

const ParticipantIndex = ({
    title,
    description,
    participants,
}: ParticipantIndexProps) => {
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

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
