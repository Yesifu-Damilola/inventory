import { Card } from "@/components/ui/card";
import { TrendingUp, Package, AlertCircle, ShoppingCart } from "lucide-react";
import { getDashboardStatsQueryOptions } from "@/query/queryOptions/dashboard/getDashboardStats";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardCards = () => {
    const { data, isPending, error } = useQuery(getDashboardStatsQueryOptions())
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm mb-1">
                            Total Products
                        </p>
                        {isPending ? (
                            <Skeleton className="h-9 w-20 my-1" />
                        ) : error ? (
                            <p className="text-3xl font-bold text-muted-foreground">—</p>
                        ) : (
                            <p className="text-3xl font-bold">{data?.data?.total_products}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">In inventory</p>
                    </div>
                    <Package className="w-10 h-10 text-primary opacity-20" />
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm mb-1">Stock Value</p>
                        {isPending ? (
                            <Skeleton className="h-9 w-28 my-1" />
                        ) : error ? (
                            <p className="text-3xl font-bold text-muted-foreground">—</p>
                        ) : (
                            <p className="text-3xl font-bold">
                                ${data?.data?.total_stock_value?.toFixed(1)}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            Total inventory value
                        </p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-primary opacity-20" />
                </div>
            </Card>

            <Card className="p-6 border-red-900 bg-red-900/5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm mb-1">
                            Low Stock Items
                        </p>
                        {isPending ? (
                            <Skeleton className="h-9 w-16 my-1" />
                        ) : error ? (
                            <p className="text-3xl font-bold text-muted-foreground">—</p>
                        ) : (
                            <p className="text-3xl font-bold text-red-500">
                                {data?.data?.low_stock_items}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            Require attention
                        </p>
                    </div>
                    <AlertCircle className="w-10 h-10 text-red-500 opacity-20" />
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm mb-1">
                            Total Quantity
                        </p>
                        {isPending ? (
                            <Skeleton className="h-9 w-24 my-1" />
                        ) : error ? (
                            <p className="text-3xl font-bold text-muted-foreground">—</p>
                        ) : (
                            <p className="text-3xl font-bold">{data?.data?.total_quantity}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            Units in stock
                        </p>
                    </div>
                    <ShoppingCart className="w-10 h-10 text-primary opacity-20" />
                </div>
            </Card>
        </div>
    );
}

export default DashboardCards;