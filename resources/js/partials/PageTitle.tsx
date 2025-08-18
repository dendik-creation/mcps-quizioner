import { Button } from "@/components/ui/button";
import { PageTitleProps } from "@/types/global";
import { ChevronLeftIcon } from "lucide-react";
import { useEffect } from "react";

export const PageTitle = ({ title, description }: PageTitleProps) => {
    const pathname = window.location.pathname;
    useEffect(() => {
        document.title = `${title} | MCPS`;
    }, [title]);
    return (
        <>
            <div className="flex justify-start items-center gap-5 mb-5">
                {!pathname.includes("dashboard") &&
                    pathname.split("/").length > 2 && (
                        <Button
                            onClick={() => window.history.back()}
                            className="h-full py-5"
                            size={"icon"}
                            variant={"outline"}
                        >
                            <ChevronLeftIcon className="text-gray-800" />
                        </Button>
                    )}
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-2xl">{title}</h2>
                    <span className="text-slate-700">{description}</span>
                </div>
            </div>
        </>
    );
};
