import { ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AppHeader from "@/partials/AppHeader";
import AppFooter from "@/partials/AppFooter";
import AppSidebar from "@/partials/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import BlastToaster from "@/components/custom/BlastToaster";

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export default function AppLayout({
    children,
    title,
    className,
}: AppLayoutProps) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.success) {
            BlastToaster("success", flash.success);
        } else if (flash.error) {
            BlastToaster("error", flash.error);
        }
    }, []);

    return (
        <SidebarProvider>
            <Toaster position={"bottom-right"} />
            <div className={`flex min-h-screen w-full ${className}`}>
                <AppSidebar />
                <div className="flex flex-col w-full">
                    <AppHeader />
                    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                        {children}
                    </main>
                    <AppFooter />
                </div>
            </div>
        </SidebarProvider>
    );
}
