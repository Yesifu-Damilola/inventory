"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardCards from "./DashboardCards";
import {
  MOCK_TOP_CATEGORIES,
  QUICK_ACTIONS,
} from "@/components/constant/dashboard";
import RecentStockMovements from "./RecentStockMovements";
import TopCategories from "./TopCategories";



const Dashboard = () => {




  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your inventory overview.
        </p>
      </div>

      {/* dashboard cards */}
      <DashboardCards />

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
        <RecentStockMovements />

        {/* Top Categories */}
        <TopCategories />
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
