'use client';

import { useMarkNotificationRead, useNotifications } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();

  if (isLoading || !data) {
    return <GroupLoading />;
  }

  if (!data.length) {
    return (
      <EmptyState
        title="No notifications yet"
        description="Order updates, payouts, reviews, and system alerts will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Notifications"
        title="Cross-role notifications"
        description="Notifications are shared because both buyers and vendors need them, but they still do not inherit buyer or vendor layout chrome."
      />
      <Card>
        <CardHeader>
          <CardTitle>Recent alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((notification) => (
            <div key={notification.id} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-foreground">{notification.title}</p>
                <span className="text-sm text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{notification.body}</p>
              {!notification.isRead ? (
                <Button
                  className="mt-4"
                  variant="outline"
                  size="sm"
                  onClick={() => void markAsRead.mutateAsync(notification.id)}
                >
                  Mark as read
                </Button>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
