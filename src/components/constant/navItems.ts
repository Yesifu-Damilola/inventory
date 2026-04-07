import {
  LayoutDashboard,
  Package,
  Truck,
  UtensilsCrossed,
  TrendingUp,
  AlertCircle,
  User,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Package,
    adminOnly: true,
  },
  {
    label: "Units of Measure",
    href: "/units",
    icon: UtensilsCrossed,
    adminOnly: true,
  },
  {
    label: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    adminOnly: true,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    adminOnly: true,
  },
  {
    label: "Stock Movements",
    href: "/stock-movements",
    icon: TrendingUp,
    adminOnly: false,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: TrendingUp,
    adminOnly: true,
  },
  // {
  //   label: "Low Stock Alerts",
  //   href: "/low-stock",
  //   icon: AlertCircle,
  //   adminOnly: false,
  // },
];

export const accountItems = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    adminOnly: false,
  },
];
