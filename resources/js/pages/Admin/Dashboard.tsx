import DynamicCard from "@/components/custom/DynamicCard";
import { existLocalStorage, saveLocalStorage } from "@/lib/local_storage";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { AdminDashboardProps } from "@/types/dashboard";
import { GraduationCap, School, UserRound } from "lucide-react";
import React, { useEffect } from "react";

const AdminDashboard = ({
    title,
    description,
    data_count,
}: AdminDashboardProps) => {
    useEffect(() => {
        saveLocalStorage("current_role", "ADMIN");
    }, []);
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <div className="mt-4">
                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <DynamicCard
                        value={data_count.school}
                        icon={<School className="w-28 h-28 text-green-200" />}
                        title="Jumlah Sekolah"
                        color="green"
                    />
                    <DynamicCard
                        value={data_count.participant}
                        icon={
                            <GraduationCap className="w-28 h-28 text-blue-200" />
                        }
                        title="Jumlah Siswa"
                        color="blue"
                    />
                    <DynamicCard
                        value={data_count.researcher}
                        icon={
                            <UserRound className="w-28 h-28 text-yellow-200" />
                        }
                        title="Jumlah Peneliti"
                        color="yellow"
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default AdminDashboard;
