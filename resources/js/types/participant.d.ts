import { PageTitleProps, PaginationData } from "./global";
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
