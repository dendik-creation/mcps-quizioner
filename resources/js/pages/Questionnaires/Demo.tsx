import { useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ErrorInput, SelectSearchInput } from "@/components/custom/FormElement";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import {
    DoorOpen,
    FilePen,
    GraduationCap,
    IdCard,
    Key,
    Loader,
    LogIn,
    User,
} from "lucide-react";
import { useEffect } from "react";
import { removeLocalStorage } from "@/lib/local_storage";

export default function Registration({ app_name }: { app_name: string }) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            BlastToaster("success", flash.success);
        } else if (flash?.error) {
            BlastToaster("error", flash.error);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            removeLocalStorage("current_role");
        }
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-background">
            <Toaster position={"bottom-right"} reverseOrder={false} />
            <Card className="w-full max-w-7xl shadow-md mx-4 flex flex-col md:flex-row">
                <div className="w-full flex flex-col justify-center p-6">
                    <CardHeader className="p-0 mb-4"></CardHeader>
                    <CardContent className="p-0">Ini Adalah Demo</CardContent>
                </div>
            </Card>
        </div>
    );
}
