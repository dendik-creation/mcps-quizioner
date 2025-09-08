import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import {
    QuestionnaireAnswerList,
    QuestionnaireResultIndexProps,
} from "@/types/questionnaire";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import NotFoundInTable from "@/components/custom/NotFoundInTable";
import { PaginatorBuilder, SearchInput } from "@/components/custom/FormElement";
import { inputDebounce } from "@/components/helper/input_debounce";

const QuestionnaireResultIndex = ({
    title,
    description,
    answers,
    search,
}: QuestionnaireResultIndexProps) => {
    const [searchValue, setSearchValue] = useState<string>(search || "");
    const [answersData, setAnswersData] = useState<QuestionnaireAnswerList[]>(
        answers.data
    );
    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/admin/result",
            { search: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setAnswersData(
                        page.props.answers as QuestionnaireAnswerList[]
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
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <div className="flex justify-between items-center mb-4">
                <SearchInput
                    placeholder={`Cari nama siswa, sekolah, atau kuisioner...`}
                    className="lg:max-w-sm w-full"
                    onChange={handleSearch}
                    value={searchValue || ""}
                />
                <Button
                    disabled={answers.total == 0}
                    variant={"green"}
                    className="flex items-center gap-2"
                    onClick={() => {
                        window.open(
                            `/admin/result/print-all?search=${searchValue}`,
                            "_blank"
                        );
                    }}
                >
                    <Printer />
                    <span>Print semua yang ditemukan</span>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-amber-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Nama Siswa
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Asal Sekolah
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Kuisioner
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Poin Terbaru
                            </TableHead>
                            <TableHead className="bg-amber-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {answers.data.length > 0 ? (
                            answers.data.map((answer, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {answer.participant_name || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {answer.school_name || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {answer.questionnaire_name || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {answer.latest_point || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/result/${answer.questionnaire_id}/${answer.participant_id}`}
                                            >
                                                <Button
                                                    variant={"blue"}
                                                    size={"icon"}
                                                >
                                                    <Eye />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant={"green"}
                                                size={"icon"}
                                                onClick={() => {
                                                    window.open(
                                                        `/admin/result/print/${answer.questionnaire_id}/${answer.participant_id}`,
                                                        "_blank"
                                                    );
                                                }}
                                            >
                                                <Printer />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <NotFoundInTable colSpan={6} />
                        )}
                    </TableBody>
                </Table>
            </div>
            {answers.total > answers.per_page && (
                <PaginatorBuilder
                    prevUrl={answers.prev_page_url ?? "#"}
                    nextUrl={answers.next_page_url ?? "#"}
                    currentPage={answers.current_page}
                    totalPage={answers.last_page}
                />
            )}
        </AppLayout>
    );
};

export default QuestionnaireResultIndex;
