import { format } from "date-fns";
import { id } from "date-fns/locale";

export const dateParserId = (
    dateString: string | null | undefined,
    withTime: boolean = false,
    timeOnly: boolean = false,
    withDay: boolean = false
) => {
    if (!dateString) return null;
    const parsedDate = new Date(dateString as string);

    if (timeOnly) {
        return format(parsedDate, "HH:mm", { locale: id });
    }

    const formatString = withDay
        ? withTime
            ? "EEEE, d MMMM yyyy - HH:mm"
            : "EEEE, d MMMM yyyy"
        : withTime
        ? "d MMMM yyyy - HH:mm"
        : "d MMMM yyyy";

    return format(parsedDate, formatString, { locale: id });
};
