import * as React from "react";
import { cn } from "@/lib/utils";

type ChoiceItemProps = {
    index: number;
    text: string;
    selected?: boolean;
    onSelect?: () => void;
    className?: string;
};

const ChoiceItem = React.forwardRef<HTMLLabelElement, ChoiceItemProps>(
    ({ index, text, selected, onSelect, className }, ref) => {
        return (
            <label
                ref={ref}
                onClick={onSelect}
                className={cn(
                    "flex items-center w-full rounded-md border border-gray-200 cursor-pointer overflow-hidden",
                    selected ? "ring-2 ring-amber-400" : "",
                    className
                )}
            >
                <span
                    className={cn(
                        "flex items-center justify-center w-10 h-10 font-semibold",
                        selected
                            ? "bg-amber-400 text-black"
                            : "bg-amber-200 text-black"
                    )}
                >
                    {String.fromCharCode(65 + index)}
                </span>

                <span className="flex-1 px-3 py-2 text-sm">{text}</span>
            </label>
        );
    }
);
ChoiceItem.displayName = "ChoiceItem";

export { ChoiceItem };
