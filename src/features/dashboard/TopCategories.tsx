"use client";

import { Card } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getDashboardTopCategoriesQueryOptions } from "@/query/queryOptions/dashboard/getDashboardTopCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    total_value: {
        label: "Total Value",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

const TopCategories = () => {
    const { data: topCategories, isPending, error } = useQuery(
        getDashboardTopCategoriesQueryOptions()
    );

    const categories = topCategories?.data || [];

    return (
        <Card className="p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">
                Top Categories by Value
            </h3>
            <div className="flex-1 min-h-[300px]">
                {isPending ? (
                    <div className="h-[300px] flex flex-col gap-4 justify-end pb-4">
                        <div className="flex items-end justify-between px-6 gap-4 h-full">
                            <Skeleton className="h-[40%] w-[15%]" />
                            <Skeleton className="h-[80%] w-[15%]" />
                            <Skeleton className="h-[60%] w-[15%]" />
                            <Skeleton className="h-[95%] w-[15%]" />
                            <Skeleton className="h-[70%] w-[15%]" />
                        </div>
                        <div className="h-[1px] w-full bg-border" />
                    </div>
                ) : error ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-destructive">
                        Failed to load top categories.
                    </div>
                ) : categories.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                        No category data available.
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                        <BarChart data={categories} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8}
                                tickFormatter={(value) => `$${Number(value).toLocaleString()}`} 
                            />
                            <ChartTooltip 
                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                content={
                                    <ChartTooltipContent
                                        formatter={(value) => (
                                            <span className="font-mono font-medium text-foreground">
                                                ${Number(value).toLocaleString()}
                                            </span>
                                        )}
                                    />
                                }
                            />
                            <Bar 
                                dataKey="total_value" 
                                fill="url(#barGradient)" 
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </Card>
    );
};

export default TopCategories;
