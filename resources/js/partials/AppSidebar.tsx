import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getLocalStorage } from "@/lib/local_storage";
import { adminSidebarNavs, penelitiSidebarNavs } from "@/lib/sidebar-navs";
import { Link } from "@inertiajs/react";
import { ArrowBigRightDash } from "lucide-react";

export default function AppSidebar() {
    const currentRole: "ADMIN" | "PENELITI" = getLocalStorage(
        "current_role"
    ) as "ADMIN" | "PENELITI";
    const items =
        currentRole == "ADMIN" ? adminSidebarNavs : penelitiSidebarNavs;
    const pathname = window.location.pathname;
    return (
        <Sidebar>
            <SidebarContent className="bg-amber-200 min-h-full relative h-full flex flex-col">
                <SidebarHeader className="mt-3 ms-3 gap-0">
                    <span className="text-black/80 font-bold">
                        Mathematic Creative
                    </span>
                    <span className="text-black/60 text-sm font-normal">
                        Problem Solving
                    </span>
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index: number) => {
                                if (item.type === "splitter") {
                                    return (
                                        <SidebarMenuItem
                                            className="border-b border-slate-700 mt-2"
                                            key={item.title}
                                        >
                                            <SidebarMenuButton
                                                disabled
                                                className="text-black uppercase text-xs"
                                            >
                                                <ArrowBigRightDash />
                                                {item.title}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                } else {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem
                                            className={`text-black/80 transition-all mb-0.5`}
                                            key={item.title}
                                        >
                                            <SidebarMenuButton
                                                isActive={
                                                    pathname == item.url ||
                                                    pathname.includes(item.url)
                                                }
                                                className="transition-all"
                                                asChild
                                            >
                                                <Link
                                                    href={
                                                        item.url == pathname
                                                            ? "#"
                                                            : item.url
                                                    }
                                                    className="flex items-center gap-2"
                                                >
                                                    {Icon && <Icon />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                }
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
