import {
    GraduationCap,
    Grid2X2,
    LaptopMinimalCheck,
    ListTodo,
    LucideProps,
    School,
    UserStar,
    Wrench,
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
        url: "/admin/participant",
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
        title: "Lainnya",
        type: "splitter",
        url: "#",
    },
    {
        title: "Hasil Kuis",
        url: "/admin/result",
        icon: LaptopMinimalCheck,
        type: "item",
    },
    {
        title: "Pengaturan Aplikasi",
        url: "/admin/setting",
        icon: Wrench,
        type: "item",
    },
];

const penelitiSidebarNavs: NavItems = [
    {
        title: "Dashboard",
        url: "/peneliti/dashboard",
        icon: Grid2X2,
        type: "item",
    },
    {
        title: "Kuisioner",
        type: "splitter",
        url: "#",
    },
    {
        title: "Siswa",
        url: "/peneliti/participant",
        icon: GraduationCap,
        type: "item",
    },
    {
        title: "Hasil Kuis",
        url: "/peneliti/result",
        icon: LaptopMinimalCheck,
        type: "item",
    },
];

export { adminSidebarNavs, penelitiSidebarNavs };
