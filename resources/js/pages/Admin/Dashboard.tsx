import { existLocalStorage, saveLocalStorage } from "@/lib/local_storage";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { AdminDashboardProps } from "@/types/dashboard";
import React, { useEffect } from "react";

const AdminDashboard = ({ title, description }: AdminDashboardProps) => {
    useEffect(() => {
        saveLocalStorage("current_role", "ADMIN");
    }, []);
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />
        </AppLayout>
    );
};

export default AdminDashboard;
