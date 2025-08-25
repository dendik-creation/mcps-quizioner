import * as React from "react";
import { cn } from "@/lib/utils";
type NumberGridProps = {
    total: number;
    selected: number;
    answered?: number[];
    onSelect?: (num: number) => void;
};

export function NumberGrid({
    total,
    selected,
    answered = [],
    onSelect,
}: NumberGridProps) {
    return (
        <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: total }, (_, idx) => {
                const number = idx + 1;
                const isActive = selected === number;
                const isAnswered = answered.includes(number);

                return (
                    <button
                        key={number}
                        onClick={() => onSelect && onSelect(number)}
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors",
                            isActive
                                ? "bg-blue-400 text-white border-blue-500"
                                : isAnswered
                                ? "bg-emerald-400 text-white border-emerald-500"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        )}
                    >
                        {number}
                    </button>
                );
            })}
        </div>
    );
}
