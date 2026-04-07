"use client";

import { useMe } from "@/hooks/auth/useMe";
import { Skeleton } from "@/components/ui/skeleton";
// import { useAuth } from "@/providers";

export function Navbar() {
  // const { user } = useAuth();
  const { data: user, isPending } = useMe();

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 pb-1.5">
      {isPending ? (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="flex-1 flex justify-end">
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
      ) : (
        user?.data && (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.data?.name}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {user?.data?.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
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
