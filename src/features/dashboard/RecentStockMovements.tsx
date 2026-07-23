"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardRecentStockMovementsQueryOptions } from "@/query/queryOptions/dashboard/getDashboardRecentStockMovement";
import { Skeleton } from "@/components/ui/skeleton";
import { dateFormatter } from "@/utils/dateFormatter";
import Link from "next/link";
import {
    ArrowRight,
    ShoppingCart,
    Trash2,
    RefreshCw,
    ArrowLeftRight,
    CheckCircle2,
} from "lucide-react";

const getMovementTypeDetails = (type: string) => {
    switch (type.toLowerCase()) {
        case "purchase":
            return {
                label: "Purchase",
                color: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20",
                icon: ShoppingCart,
            };
        case "consumption":
            return {
                label: "Consumption",
                color: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20",
                icon: ArrowLeftRight,
            };
        case "waste":
            return {
                label: "Waste",
                color: "bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20",
                icon: Trash2,
            };
        case "adjustment":
            return {
                label: "Adjustment",
                color: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20",
                icon: RefreshCw,
            };
        case "return":
            return {
                label: "Return",
                color: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20",
                icon: ArrowLeftRight,
            };
        default:
            return {
                label: type.charAt(0).toUpperCase() + type.slice(1),
                color: "bg-slate-500/10 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-500/20",
                icon: CheckCircle2,
            };
    }
};

const formatMoney = (value: string | undefined | null) => {
    if (value == null || value === "") return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const RecentStockMovements = () => {
    const { data: recentMovementData, isPending, error } = useQuery(
        getDashboardRecentStockMovementsQueryOptions()
    );

    const movements = recentMovementData?.data || [];

    return (
        <Card className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Stock Movements</h3>
                <Link
                    href="/stock-movements"
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium transition-colors"
                >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="flex-1 overflow-auto h-[300px] pr-1">
                {isPending ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50">
                                <div className="space-y-1 flex-1">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <div className="space-y-1 flex-1 text-right flex flex-col items-end">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center text-sm text-destructive">
                        Failed to load stock movements.
                    </div>
                ) : movements.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                        No recent stock movements recorded.
                    </div>
                ) : (
                    <div className="min-w-full inline-block align-middle">
                        <table className="min-w-full table-fixed text-sm">
                            <thead>
                                <tr className="border-b border-border/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                                    <th className="text-left pb-2 font-medium w-[40%]">Product</th>
                                    <th className="text-left pb-2 font-medium w-[25%]">Type</th>
                                    <th className="text-right pb-2 font-medium w-[20%]">Quantity</th>
                                    <th className="text-right pb-2 font-medium w-[15%]">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {movements.map((movement) => {
                                    const details = getMovementTypeDetails(movement.type);
                                    const Icon = details.icon;
                                    return (
                                        <tr key={movement.id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="py-2.5 pr-2 font-medium truncate">
                                                <div className="font-semibold text-foreground truncate" title={movement.product?.name || "—"}>
                                                    {movement.product?.name || "—"}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground truncate font-mono" title={movement.product?.sku || undefined}>
                                                    {movement.product?.sku || "—"}
                                                </div>
                                            </td>
                                            <td className="py-2.5 pr-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${details.color}`}>
                                                    <Icon className="w-3 h-3" />
                                                    {details.label}
                                                </span>
                                            </td>
                                            <td className="py-2.5 pr-2 text-right tabular-nums">
                                                <div className="font-semibold text-foreground">
                                                    {movement.quantity}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {movement.quantity_before} → {movement.quantity_after}
                                                </div>
                                            </td>
                                            <td className="py-2.5 text-right tabular-nums">
                                                <div className="font-medium text-foreground text-xs">
                                                    ${formatMoney(movement.unit_cost)}
                                                </div>
                                                <div className="text-[9px] text-muted-foreground whitespace-nowrap">
                                                    {dateFormatter(movement.created_at)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default RecentStockMovements;

