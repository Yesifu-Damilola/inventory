"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardInventoryByCategoryQueryOptions } from "@/query/queryOptions/dashboard/getDashboardInventoryByCategory";
import { Skeleton } from "@/components/ui/skeleton";

const InventoryByCategory = () => {
    const { data, isPending, error } = useQuery(
        getDashboardInventoryByCategoryQueryOptions()
    );

    const categories = data?.data || [];
    const totalValue = categories.reduce((sum, cat) => sum + cat.total_value, 0);

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
                Inventory Breakdown by Category
            </h3>
            <div className="space-y-3">
                {isPending ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="space-y-2 py-1">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                    ))
                ) : error ? (
                    <div className="py-8 text-center text-sm text-destructive">
                        Failed to load inventory breakdown.
                    </div>
                ) : categories.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No inventory data available.
                    </div>
                ) : (
                    categories.map((cat) => {
                        const percentage = totalValue > 0 ? (cat.total_value / totalValue) * 100 : 0;
                        return (
                            <div key={cat.id}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{cat.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                        ${cat.total_value.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${percentage.toFixed(1)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {percentage.toFixed(1)}% of total
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
};

export default InventoryByCategory;
