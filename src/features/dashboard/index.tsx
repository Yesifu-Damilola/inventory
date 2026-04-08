"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, AlertCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  MOCK_RECENT_ACTIVITY,
  MOCK_STATS,
  MOCK_TOP_CATEGORIES,
  QUICK_ACTIONS,
} from "@/components/constant/dashboard";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your inventory overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">
                Total Products
              </p>
              <p className="text-3xl font-bold">{MOCK_STATS.total_products}</p>
              <p className="text-xs text-muted-foreground mt-2">In inventory</p>
            </div>
            <Package className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Stock Value</p>
              <p className="text-3xl font-bold">
                ${(MOCK_STATS.total_stock_value / 1000).toFixed(1)}k
              </p>
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
              <p className="text-3xl font-bold text-red-500">
                {MOCK_STATS.low_stock_count}
              </p>
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
              <p className="text-3xl font-bold">{MOCK_STATS.total_quantity}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Units in stock
              </p>
            </div>
            <ShoppingCart className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Stock Movements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...MOCK_RECENT_ACTIVITY]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#7c3aed"
                strokeWidth={2}
                name="Movements"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Top Categories by Value
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[...MOCK_TOP_CATEGORIES]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" name="Value ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Inventory Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Inventory Breakdown by Category
        </h3>
        <div className="space-y-3">
          {MOCK_TOP_CATEGORIES.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{cat.category}</span>
                <span className="text-sm text-muted-foreground">
                  ${cat.value.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {cat.percentage}% of total
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
