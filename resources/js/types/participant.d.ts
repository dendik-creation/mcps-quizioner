import { PageTitleProps, PaginationData, SelectOption } from "./global";
import { School } from "./school";

export type Participant = {
    id: number;
    nisn: string;
    fullname: string;
    class: string;
    school_id: number;
    school: School;
};

export type ParticipantIndexProps = PageTitleProps & {
    participants: PaginationData<Participant>;
    search: string;
};

export type ParticipantEditProps = PageTitleProps & {
    participant: Participant;
    schools: SelectOption[];
};

export type ParticipantFormProps = {
    nisn: string | null;
    fullname: string | null;
    class: string | null;
    school_id: number | "" | null;
};
