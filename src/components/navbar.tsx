"use client";

import { Menu } from "lucide-react";
import { useMe } from "@/hooks/auth/useMe";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/providers";

type NavbarProps = {
  onMenuClick?: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  // const { user } = useAuth();
  const { data: user, isPending } = useMe();

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between gap-3 px-4 pb-1.5 md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        aria-label="Open navigation menu"
        onClick={onMenuClick}
      >
        <Menu className="size-5" aria-hidden />
      </Button>
      {isPending ? (
        <div className="flex min-w-0 flex-1 items-center justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="text-right">
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          </div>
          <div className="flex flex-1 justify-end">
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
      ) : (
        user?.data && (
          <div className="flex min-w-0 flex-1 items-center justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-medium">
                  {user?.data?.name}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-medium">
                {user?.data?.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex flex-1 justify-end">
              <span className="shrink-0 rounded-full bg-primary/20 px-2 py-1 text-xs font-semibold text-primary">
                {user?.data?.role.charAt(0).toUpperCase() +
                  user?.data?.role.slice(1).toLowerCase()}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
