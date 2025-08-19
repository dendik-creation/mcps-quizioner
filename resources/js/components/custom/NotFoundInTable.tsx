import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { SearchXIcon } from "lucide-react";

type NotFoundInTableProps = {
    message?: string;
    colSpan: number;
};

export default function NotFoundInTable({
    message,
    colSpan,
}: NotFoundInTableProps) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center">
                <div className="w-full flex flex-col items-center justify-center h-full gap-2">
                    <SearchXIcon width={64} className="text-red-400" />
                    <span>{message || "Data tidak ada"}</span>
                </div>
            </TableCell>
        </TableRow>
    );
}
