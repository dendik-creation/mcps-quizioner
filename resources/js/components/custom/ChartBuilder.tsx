import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const PieBuilder: React.FC<PieChartProps> = ({ title, data }) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: "pie",
            toolbar: {
                show: true,
                tools: {
                    download: true,
                },
            },
        },
        labels: data.map((item) => item.label),
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
        legend: {
            position: "bottom",
            horizontalAlign: "center",
        },
        colors: [
            "#10B981",
            "#3B82F6",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#F97316",
        ],
    };

    const series: number[] = data.map((item) => Number(item.value));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Chart
                    options={chartOptions}
                    series={series}
                    type="pie"
                    height={350}
                />
            </CardContent>
        </Card>
    );
};

export default PieBuilder;
