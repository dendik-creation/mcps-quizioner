import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import { router } from "@inertiajs/react";

interface AppHeaderProps {
    classNames?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ classNames }) => {
    const handleSignOut = () => {
        router.post(
            "/auth/signout",
            {},
            {
                replace: true,
                preserveState: true,
            }
        );
    };
    return (
        <header
            className={cn(
                "w-full h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm",
                classNames
            )}
        >
            <div className="flex items-center gap-4">
                <SidebarTrigger />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="border-2 border-solid transition-all border-blue-500">
                        <AvatarImage src="/assets/img/profile_icon.png" />
                        <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="me-5">
                    <DropdownMenuItem asChild>
                        <ConfirmDialog
                            triggerNode={
                                <div className="cursor-pointer relative select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 flex items-center w-full gap-2">
                                    <LogOut />
                                    <span>Log Out</span>
                                </div>
                            }
                            title="Log Out"
                            type="danger"
                            description="Apakah Anda yakin ingin keluar dari sistem?"
                            confirmAction={handleSignOut}
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};

export default AppHeader;
