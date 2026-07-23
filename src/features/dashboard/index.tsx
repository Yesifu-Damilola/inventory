"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardCards from "./DashboardCards";
import {
  QUICK_ACTIONS,
} from "@/components/constant/dashboard";
import RecentStockMovements from "./RecentStockMovements";
import TopCategories from "./TopCategories";
import InventoryByCategory from "./InventoryByCategory";



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
      <InventoryByCategory />
    </div>
  );
};

export default Dashboard;

