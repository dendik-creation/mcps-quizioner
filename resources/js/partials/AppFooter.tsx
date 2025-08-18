import { dateParserId } from "@/components/helper/date_parser";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

const AppFooter = () => {
    const [dateTime, setDateTime] = useState(
        dateParserId(new Date().toISOString(), true, false, true)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(
                dateParserId(new Date().toISOString(), true, false, true)
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="w-full h-12 flex items-center justify-start bg-white border-t border-slate-200 shadow-inner text-slate-600">
            <div className="flex items-center ms-4 gap-4">
                <Calendar className="text-slate-500" />
                <p className="">{dateTime}</p>
            </div>
        </footer>
    );
};

export default AppFooter;
