import { PageTitleProps } from "./global";

export type Setting = {
    id?: number;
    app_name: string;
    questionnary_time: number;
};

export type SettingIndexProps = PageTitleProps & {
    setting?: Setting;
};
