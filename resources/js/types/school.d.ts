import { Participant } from "@/types/participant";
import { PageTitleProps } from "./global";

export type School = {
    id: number;
    name: string;
    participants?: Participant[];
};

export type SchoolIndexProps = PageTitleProps & {
    schools: School[];
};

export type SchoolShowProps = PageTitleProps & {
    school: School;
};
