import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { SchoolShowProps } from "@/types/school";
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

const SchoolShow = ({ title, description, school }: SchoolShowProps) => {
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
                                Kelas
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {school?.participants?.length ? (
                            school?.participants.map((participant, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{participant.nisn}</TableCell>
                                    <TableCell>
                                        {participant.full_name}
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
        </AppLayout>
    );
};

export default SchoolShow;
