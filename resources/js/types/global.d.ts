export type PageTitleProps = {
    title?: string;
    description?: string;
};

interface PaginationLink {
    url: string;
    label: string;
    active: boolean;
}
type AppSetting = {
    id?: number;
    app_name?: string;
    questionnary_time?: number;
};

interface PaginationData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

interface SelectOption {
    value: string;
    label: string;
}
