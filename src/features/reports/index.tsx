"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Package } from "lucide-react";
import { getReportsInventorySummaryQueryOptions } from "@/query/queryOptions/getReportsInventorySummary";
import { useQuery } from "@tanstack/react-query";
import { getStockValueQueryOptions } from "@/query/queryOptions/getStockValue";

interface InventorySummary {
  category: string;
  productCount: number;
  estimatedValue: number;
}

interface StockValueItem {
  id: string;
  name: string;
  sku: string;
  cost_price: string;
  quantity_on_hand: string;
  total_value: string;
}

const COLORS = ["#7c3aed", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];

const Reports = () => {
  const { data: inventorySummary, isPending } = useQuery(
    getReportsInventorySummaryQueryOptions(),
  );

  const { data: stockValue, isPending: isPendingStockValue } = useQuery(
    getStockValueQueryOptions(),
  );

  const categoryData = inventorySummary?.data?.by_category ?? [];
  const stockValueItems: StockValueItem[] = stockValue?.data?.items ?? [];
  const totalValue = Number(stockValue?.data?.grand_total ?? 0);
  const totalQuantity = stockValueItems.reduce(
    (acc, item) => acc + Number(item.quantity_on_hand ?? 0),
    0,
  );
  const averageValuePerUnit = totalQuantity > 0 ? totalValue / totalQuantity : 0;
  const totalProducts = Number(inventorySummary?.data?.total_products ?? 0);
  const activeProducts = Number(inventorySummary?.data?.active_products ?? 0);
  const lowStockCount = Number(inventorySummary?.data?.low_stock_count ?? 0);
  const isLoading = isPending || isPendingStockValue;

  const inventorySummaryData: InventorySummary[] = categoryData.map(
    (category: { category: string; product_count: number }) => ({
      category: category.category,
      productCount: Number(category.product_count ?? 0),
      estimatedValue: stockValueItems
        .filter((item) => item.name === category.category)
        .reduce((sum, item) => sum + Number(item.total_value ?? 0), 0),
    }),
  );

  const stockValueChartData = stockValueItems.map((item) => ({
    name: item.name,
    value: Number(item.total_value ?? 0),
  }));

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">
            View detailed inventory and stock reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-32" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-[300px] w-full" />
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-[300px] w-full" />
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-[350px] w-full" />
        </Card>

        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">
          View detailed inventory and stock reports
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Total Value</p>
              <p className="text-3xl font-bold">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Total Quantity</p>
              <p className="text-3xl font-bold">{totalQuantity.toFixed(3)}</p>
            </div>
            <Package className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Total Products</p>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Active / Low Stock</p>
              <p className="text-3xl font-bold">
                {activeProducts} / {lowStockCount}
              </p>
            </div>
            <Package className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Value Trend */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Stock Value Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockValueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7c3aed"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventorySummaryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, productCount }) =>
                  `${category}: ${productCount}`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="productCount"
              >
                {inventorySummaryData.map(
                  (entry: InventorySummary, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ),
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Inventory by Category */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
          Inventory Summary by Category
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={inventorySummaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis
              yAxisId="left"
              label={{ value: "Quantity", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Value ($)", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="productCount"
              fill="#7c3aed"
              name="Product Count"
            />
            <Bar
              yAxisId="right"
              dataKey="estimatedValue"
              fill="#60a5fa"
              name="Estimated Value ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Details Table */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Category Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Product Count
                </th>
                <th className="px-6 py-3 text-left font-semibold">
                  Estimated Value
                </th>
                <th className="px-6 py-3 text-left font-semibold">
                  Avg Price per Unit
                </th>
                <th className="px-6 py-3 text-left font-semibold">
                  % of Total Value
                </th>
              </tr>
            </thead>
            <tbody>
              {inventorySummaryData.map((item: InventorySummary) => {
                const percentage =
                  totalValue > 0
                    ? ((item.estimatedValue / totalValue) * 100).toFixed(1)
                    : "0.0";
                const avgPrice =
                  item.productCount > 0
                    ? (item.estimatedValue / item.productCount).toFixed(2)
                    : "0.00";
                return (
                  <tr
                    key={item.category}
                    className="border-t border-border hover:bg-secondary/50"
                  >
                    <td className="px-6 py-4 font-medium">{item.category}</td>
                    <td className="px-6 py-4">{item.productCount}</td>
                    <td className="px-6 py-4">
                      ${item.estimatedValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">${avgPrice}</td>
                    <td className="px-6 py-4">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {inventorySummaryData.length === 0 && stockValueItems.length === 0 && (
        <p className="text-sm text-muted-foreground">No reports data available.</p>
      )}
    </div>
  );
};

export default Reports;
