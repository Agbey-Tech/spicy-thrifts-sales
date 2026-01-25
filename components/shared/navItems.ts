import {
  LayoutDashboard,
  Layers,
  Package,
  Boxes,
  ShoppingBag,
  BarChart3,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Variants",
    href: "/admin/variants",
    icon: Boxes,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];
