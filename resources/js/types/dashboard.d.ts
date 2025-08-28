import { PageTitleProps } from "@/types/global";

export type AdminDashboardProps = PageTitleProps & {
    data_count: {
        school: number;
        participant: number;
        researcher: number;
    };
    data_chart: {
        school_participants: {
            label: string;
            value: number;
        }[];
    };
    data_table: {
        latest_questionnaries: {
            participant_name: string;
            school: string;
            questionnaire: string;
            submitted_at: string;
        }[];
    };
};
