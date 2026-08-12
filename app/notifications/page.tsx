"use client";
import { ProtectedRoute } from "@/components/common/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications";
import { formatDate } from "@/utils/date-format";

function NotificationsContent() {
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  if (isLoading) {
    return (
      <div className="container py-8 space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {data && data.some((n) => !n.isRead) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {!data || data.length === 0 ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <div className="space-y-2">
          {data.map((n) => (
            <Card
              key={n._id}
              className={cn(
                "cursor-pointer",
                !n.isRead && "border-primary/50 bg-primary/5",
              )}
              onClick={() => !n.isRead && markAsRead.mutate(n._id)}
            >
              <CardContent className="p-4">
                <p className="text-sm">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(n.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
