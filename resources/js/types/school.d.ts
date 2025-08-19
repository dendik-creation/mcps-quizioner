import { Participant } from "@/types/participant";
import { PageTitleProps, PaginationData } from "./global";

export type School = {
    id: number;
    name: string;
    participants?: Participant[];
};

export type SchoolIndexProps = PageTitleProps & {
    schools: PaginationData<School>;
};

export type SchoolShowProps = PageTitleProps & {
    school: School;
};
