import {
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  Percent,
  Sparkles,
  Link2,
  FileText,
  Megaphone,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { ClicksTrendChart } from '@/components/dashboard/ClicksTrendChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { ChannelPieChart } from '@/components/dashboard/ChannelPieChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import {
  mockProducts,
  mockAnalytics,
  mockDashboardStats,
  recentActivities,
  channelPerformance,
} from '@/data/mockData';

export default function Dashboard() {
  const stats = mockDashboardStats;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your affiliate performance overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Discover Products
          </Button>
          <Button className="gap-2">
            <Link2 className="h-4 w-4" />
            Generate Link
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks.month.toLocaleString()}
          subtitle={`Today: ${stats.totalClicks.today.toLocaleString()} | Week: ${stats.totalClicks.week.toLocaleString()}`}
          icon={MousePointerClick}
          variant="primary"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Conversions"
          value={stats.totalConversions.toLocaleString()}
          subtitle="Total successful orders"
          icon={ShoppingCart}
          variant="success"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Generated from affiliate sales"
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatCard
          title="Commission Earned"
          value={formatCurrency(stats.totalCommission)}
          subtitle={`Conversion Rate: ${stats.conversionRate}%`}
          icon={Percent}
          variant="warning"
          trend={{ value: 5.7, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
          <a href="/products">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-medium">Discover Products</span>
            <span className="text-xs text-muted-foreground">Find trending products</span>
          </a>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <Link2 className="h-6 w-6 text-secondary" />
          <span className="font-medium">Generate Link</span>
          <span className="text-xs text-muted-foreground">Create affiliate link</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <FileText className="h-6 w-6 text-success" />
          <span className="font-medium">Create Content</span>
          <span className="text-xs text-muted-foreground">Post to social media</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <Megaphone className="h-6 w-6 text-warning" />
          <span className="font-medium">New Campaign</span>
          <span className="text-xs text-muted-foreground">Start promotion campaign</span>
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ClicksTrendChart data={mockAnalytics} />
        <TopProductsChart products={mockProducts} />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivities activities={recentActivities} />
        <ChannelPieChart data={channelPerformance} />
      </div>
    </div>
  );
}
