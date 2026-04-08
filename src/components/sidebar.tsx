"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/providers";
import { cn } from "@/lib/utils";
import { accountItems, navItems } from "./constant/navItems";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const shellClass =
  "w-64 bg-card border-border h-screen flex flex-col shrink-0";

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout, isAdmin, isPending } = useAuth();

  return (
    <>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
            Inventory
          </h1>
          {isAdmin && (
            <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
              Admin
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Management System</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.adminOnly && !isActive && (
                  <span className="text-xs ml-auto px-2 py-0.5 bg-primary/20 text-primary rounded">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        {accountItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              void logout();
            }}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:pointer-events-none disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
            ) : (
              <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            )}
            <span>{isPending ? "Logging out…" : "Logout"}</span>
          </button>
        </div>
      </div>
    </>
  );
}

type SidebarProps = {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const closeIfDesktop = () => {
      if (mq.matches) onMobileOpenChange(false);
    };
    mq.addEventListener("change", closeIfDesktop);
    closeIfDesktop();
    return () => mq.removeEventListener("change", closeIfDesktop);
  }, [onMobileOpenChange]);

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className="p-0 gap-0 w-64 max-w-[85vw] border-r border-border bg-card [&>button]:text-foreground"
        >
          <SheetTitle className="sr-only">Main navigation</SheetTitle>
          <div className={cn(shellClass, "border-r-0 h-full")}>
            <SidebarInner
              onNavigate={() => {
                onMobileOpenChange(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      <aside className={cn(shellClass, "hidden md:flex border-r")}>
        <SidebarInner />
      </aside>
    </>
  );
}
