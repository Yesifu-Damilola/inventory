import { AlertCircle, Package, ShoppingCart, TrendingUp } from "lucide-react";

// Dashboard mock data used by the dashboard UI.
export const MOCK_STATS = {
  total_products: 24,
  total_stock_value: 27200,
  low_stock_count: 3,
  total_quantity: 855,
} as const;

export const MOCK_RECENT_ACTIVITY = [
  { date: "Jan 15", count: 12 },
  { date: "Jan 16", count: 8 },
  { date: "Jan 17", count: 15 },
  { date: "Jan 18", count: 10 },
  { date: "Jan 19", count: 14 },
  { date: "Jan 20", count: 18 },
] ;

export const MOCK_TOP_CATEGORIES = [
  { category: "Vegetables", value: 3500, percentage: 12.9 },
  { category: "Fruits", value: 4200, percentage: 15.4 },
  { category: "Meat", value: 8500, percentage: 31.2 },
  { category: "Dairy", value: 5000, percentage: 18.4 },
  { category: "Grains", value: 6000, percentage: 22.1 },
] ;

export const QUICK_ACTIONS = [
  { label: "Add Product", href: "/products", icon: Package },
  {
    label: "Record Movement",
    href: "/stock-movements",
    icon: ShoppingCart,
  },
  { label: "View Reports", href: "/reports", icon: TrendingUp },
  // {
  //   label: "Low Stock Alerts",
  //   href: "/low-stock",
  //   icon: AlertCircle,
  // },
] ;

