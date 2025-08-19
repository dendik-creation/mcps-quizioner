import { PageTitleProps } from "./global";

export type User = {
    id?: number;
    name: string;
    username: string;
    role: "PENELITI" | "ADMIN";
};
export type UserFormProps = {
    id?: number | null;
    username?: string | null;
    name?: string | null;
    role?: "PENELITI" | "ADMIN" | string | null;
    password?: string | null;
};

export type UserIndexProps = PageTitleProps & {
    users: User[];
};

export type UserEditProps = PageTitleProps & {
    user: UserFormProps;
};
