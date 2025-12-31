import { MousePointerClick, ShoppingCart, Link2, Megaphone, Package, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const activityIcons: Record<string, React.ElementType> = {
  click: MousePointerClick,
  conversion: ShoppingCart,
  link: Link2,
  campaign: Megaphone,
  product: Package,
  post: Send,
};

const activityColors: Record<string, string> = {
  click: 'text-primary bg-primary/10',
  conversion: 'text-success bg-success/10',
  link: 'text-secondary bg-secondary/10',
  campaign: 'text-warning bg-warning/10',
  product: 'text-muted-foreground bg-muted',
  post: 'text-primary bg-primary/10',
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest events across your affiliate operations</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type] || Package;
              const colorClass = activityColors[activity.type] || 'text-muted-foreground bg-muted';
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className={cn('rounded-lg p-2', colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
