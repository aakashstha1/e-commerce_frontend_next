"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types/user.type";

/** Wrap any page/layout that requires a logged-in user (optionally admin-only). */
export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (requireAdmin && user && user.role !== UserRole.ADMIN) {
      router.replace("/");
    }
  }, [hasHydrated, accessToken, user, requireAdmin, router]);

  if (
    !hasHydrated ||
    !accessToken ||
    isLoading ||
    (requireAdmin && user?.role !== UserRole.ADMIN)
  ) {
    return (
      <div className="container py-12 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
