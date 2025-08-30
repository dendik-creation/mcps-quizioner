import { PageTitleProps } from "@/types/global";

export type AdminDashboardProps = PageTitleProps & {
    data_count: {
        school: number;
        participant: number;
        researcher: number;
    };
};
