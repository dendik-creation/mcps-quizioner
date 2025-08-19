import {
    GraduationCap,
    Grid2X2,
    LaptopMinimalCheck,
    ListTodo,
    LucideProps,
    School,
    UserStar,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItem = {
    type: "item" | "splitter";
    title: string;
    url: string;
    icon?: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
};

export type NavItems = NavItem[];

const adminSidebarNavs: NavItems = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Grid2X2,
        type: "item",
    },
    {
        title: "Master Data",
        type: "splitter",
        url: "#",
    },
    {
        title: "Sekolah",
        url: "/admin/school",
        icon: School,
        type: "item",
    },
    {
        title: "Siswa",
        url: "/admin/student",
        icon: GraduationCap,
        type: "item",
    },
    {
        title: "User",
        url: "/admin/user",
        icon: UserStar,
        type: "item",
    },
    {
        title: "Kuis & Pertanyaan",
        url: "/admin/questionnaire",
        icon: ListTodo,
        type: "item",
    },
    {
        title: "Hasil Kuisioner",
        type: "splitter",
        url: "#",
    },
    {
        title: "Hasil Kuis",
        url: "/admin/questionnaire-result",
        icon: LaptopMinimalCheck,
        type: "item",
    },
];

const penelitiSidebarNavs: NavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Grid2X2,
        type: "item",
    },
    {
        title: "Master Data",
        type: "splitter",
        url: "#",
    },
];

export { adminSidebarNavs, penelitiSidebarNavs };
