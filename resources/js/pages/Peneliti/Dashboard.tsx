import DynamicCard from "@/components/custom/DynamicCard";
import { saveLocalStorage } from "@/lib/local_storage";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { AdminDashboardProps } from "@/types/dashboard";
import { GraduationCap, School, UserRound } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieBuilder from "@/components/custom/ChartBuilder";
import React, { useEffect } from "react";
import { dateParserId } from "@/components/helper/date_parser";

const PenelitiDashboard = ({
    title,
    description,
    data_count,
    data_chart,
    data_table,
}: AdminDashboardProps) => {
    useEffect(() => {
        saveLocalStorage("current_role", "PENELITI");
    }, []);
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <div className="mt-4">
                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <DynamicCard
                        value={data_count.school}
                        icon={<School className="w-28 h-28 text-green-200" />}
                        title="Jumlah Sekolah"
                        color="green"
                    />
                    <DynamicCard
                        value={data_count.participant}
                        icon={
                            <GraduationCap className="w-28 h-28 text-blue-200" />
                        }
                        title="Jumlah Siswa"
                        color="blue"
                    />
                    <DynamicCard
                        value={data_count.researcher}
                        icon={
                            <UserRound className="w-28 h-28 text-yellow-200" />
                        }
                        title="Jumlah Peneliti"
                        color="yellow"
                    />
                </div>

                {/* PIE CHART & TABLE */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
                    <div className="lg:col-span-1">
                        <PieBuilder
                            title="Distribusi Siswa per Sekolah"
                            data={data_chart.school_participants}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    Aktivitas Kuesioner Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Siswa</TableHead>
                                            <TableHead>Sekolah</TableHead>
                                            <TableHead>Kuesioner</TableHead>
                                            <TableHead>Waktu Submit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data_table.latest_questionnaries
                                            .length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="text-center text-muted-foreground py-8"
                                                >
                                                    Belum ada data kuesioner
                                                    yang dikumpulkan
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            data_table.latest_questionnaries.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">
                                                            {
                                                                item.participant_name
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.school}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.questionnaire}
                                                        </TableCell>
                                                        <TableCell>
                                                            {dateParserId(
                                                                item.submitted_at,
                                                                true
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PenelitiDashboard;
