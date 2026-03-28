import { notificationsFeed } from '@/shared/constants/route-fixtures';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function NotificationsPage() {
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
          {notificationsFeed.map((notification) => (
            <div key={notification.id} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-foreground">{notification.title}</p>
                <span className="text-sm text-muted-foreground">{notification.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{notification.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
