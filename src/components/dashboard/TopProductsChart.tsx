import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';

interface TopProductsChartProps {
  products: Product[];
}

export function TopProductsChart({ products }: TopProductsChartProps) {
  const chartData = products
    .sort((a, b) => b.estimated_commission - a.estimated_commission)
    .slice(0, 10)
    .map((product) => ({
      name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
      commission: product.estimated_commission,
      sales: product.sold_count,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Commission</CardTitle>
        <CardDescription>Products with highest earning potential</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `฿${value}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-md)',
                }}
                formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Commission']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar
                dataKey="commission"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
