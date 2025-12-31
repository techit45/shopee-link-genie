import { Product, AffiliateLink, Campaign, DailyAnalytics, DashboardStats } from '@/types';

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Toys', 'Food', 'Health'];

const shopNames = [
  'TechMaster Official', 'Fashion Hub', 'Home Essentials', 'Beauty Queen',
  'SportZone', 'KidWorld', 'FoodieParadise', 'HealthPlus Store'
];

const productNames = [
  'Wireless Bluetooth Earbuds Pro', 'Smart Watch Series X', 'Portable Power Bank 20000mAh',
  'Mechanical Gaming Keyboard RGB', 'Wireless Gaming Mouse', 'USB-C Hub Multiport Adapter',
  'LED Ring Light with Tripod', 'Webcam HD 1080p', 'Mini Portable Projector',
  'Noise Cancelling Headphones', 'Fitness Tracker Band', 'Bluetooth Speaker Waterproof',
  'Phone Gimbal Stabilizer', 'Laptop Stand Adjustable', 'Wireless Charging Pad',
  'Action Camera 4K', 'Smart Home Hub', 'Robot Vacuum Cleaner',
  'Air Purifier HEPA', 'Electric Kettle Smart', 'Coffee Maker Automatic',
  'Blender Portable USB', 'Hair Dryer Professional', 'Electric Toothbrush',
  'Massage Gun Deep Tissue', 'Yoga Mat Premium', 'Resistance Bands Set',
  'Dumbbell Adjustable Set', 'Jump Rope Smart', 'Foam Roller',
  'Running Shoes Ultra', 'Backpack Travel Large', 'Sunglasses Polarized',
  'Watch Band Silicone', 'Phone Case Premium', 'Screen Protector Tempered',
  'Cable Organizer Box', 'Desk Lamp LED', 'Monitor Light Bar',
  'Keyboard Wrist Rest', 'Mouse Pad XXL', 'Webcam Cover Privacy',
  'USB Flash Drive 128GB', 'Memory Card 256GB', 'External SSD 1TB',
  'Tablet Stand Holder', 'Car Phone Mount', 'Dash Cam 4K',
  'Tire Inflator Portable', 'Jump Starter Kit'
];

export const generateMockProducts = (count: number = 50): Product[] => {
  return Array.from({ length: count }, (_, i) => {
    const originalPrice = Math.floor(Math.random() * 5000) + 100;
    const discountPercent = Math.floor(Math.random() * 60) + 5;
    const price = originalPrice * (1 - discountPercent / 100);
    const commissionRate = Math.floor(Math.random() * 15) + 3;
    
    return {
      id: i + 1,
      shopee_id: `SHP${String(i + 1).padStart(8, '0')}`,
      name: productNames[i % productNames.length] + (i >= productNames.length ? ` V${Math.floor(i / productNames.length) + 1}` : ''),
      price: Math.round(price * 100) / 100,
      original_price: originalPrice,
      discount_percent: discountPercent,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      sold_count: Math.floor(Math.random() * 10000),
      stock: Math.floor(Math.random() * 500) + 10,
      category: categories[Math.floor(Math.random() * categories.length)],
      shop_id: `SHOP${String(Math.floor(Math.random() * 100)).padStart(4, '0')}`,
      shop_name: shopNames[Math.floor(Math.random() * shopNames.length)],
      image_urls: [`https://picsum.photos/seed/${i + 1}/400/400`],
      product_url: `https://shopee.co.th/product/${i + 1}`,
      commission_rate: commissionRate,
      estimated_commission: Math.round(price * commissionRate / 100 * 100) / 100,
      is_trending: Math.random() > 0.7,
      is_flash_sale: Math.random() > 0.8,
      flash_sale_end: Math.random() > 0.8 ? new Date(Date.now() + Math.random() * 86400000 * 3).toISOString() : undefined,
      last_scraped: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
};

export const generateMockLinks = (products: Product[]): AffiliateLink[] => {
  return products.slice(0, 15).map((product, i) => ({
    id: i + 1,
    product_id: product.id,
    short_link: `https://shp.ee/aff${String(i + 1).padStart(5, '0')}`,
    full_link: `https://shopee.co.th/product/${product.id}?affid=12345&sub=${i + 1}`,
    property_id: 'PROP001',
    property_name: 'Main Website',
    sub_id: `SUB${String(i + 1).padStart(3, '0')}`,
    campaign_id: Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : undefined,
    click_count: Math.floor(Math.random() * 5000),
    conversion_count: Math.floor(Math.random() * 200),
    revenue: Math.floor(Math.random() * 50000),
    commission: Math.floor(Math.random() * 5000),
    created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: '11.11 Big Sale Campaign',
    description: 'Major promotional campaign for Singles Day sale event',
    start_date: '2024-11-01T00:00:00Z',
    end_date: '2024-11-12T00:00:00Z',
    target_category: 'Electronics',
    target_commission_min: 8,
    auto_post: true,
    post_schedule: 'every_6h',
    channels: ['facebook', 'line', 'telegram'],
    status: 'active',
    created_at: '2024-10-25T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Fashion Week Promo',
    description: 'Fashion category focused campaign',
    start_date: '2024-10-15T00:00:00Z',
    end_date: '2024-10-25T00:00:00Z',
    target_category: 'Fashion',
    target_commission_min: 10,
    auto_post: false,
    channels: ['facebook', 'instagram'],
    status: 'completed',
    created_at: '2024-10-10T00:00:00Z',
    updated_at: '2024-10-25T00:00:00Z',
  },
  {
    id: 3,
    name: 'Tech Deals Weekly',
    description: 'Weekly electronics deals promotion',
    start_date: '2024-11-15T00:00:00Z',
    end_date: '2024-12-31T00:00:00Z',
    target_category: 'Electronics',
    target_commission_min: 5,
    auto_post: true,
    post_schedule: 'daily',
    channels: ['telegram'],
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const generateDailyAnalytics = (days: number = 30): DailyAnalytics[] => {
  const analytics: DailyAnalytics[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const clicks = Math.floor(Math.random() * 500) + 100;
    const conversions = Math.floor(clicks * (Math.random() * 0.08 + 0.02));
    const revenue = conversions * (Math.random() * 500 + 100);
    const commission = revenue * 0.08;
    
    analytics.push({
      id: days - i,
      date: date.toISOString().split('T')[0],
      clicks,
      conversions,
      revenue: Math.round(revenue * 100) / 100,
      commission: Math.round(commission * 100) / 100,
      conversion_rate: Math.round(conversions / clicks * 100 * 100) / 100,
    });
  }
  
  return analytics;
};

export const calculateDashboardStats = (analytics: DailyAnalytics[]): DashboardStats => {
  const today = analytics[analytics.length - 1];
  const weekData = analytics.slice(-7);
  const monthData = analytics;
  
  const todayClicks = today?.clicks || 0;
  const weekClicks = weekData.reduce((sum, d) => sum + d.clicks, 0);
  const monthClicks = monthData.reduce((sum, d) => sum + d.clicks, 0);
  const totalConversions = monthData.reduce((sum, d) => sum + d.conversions, 0);
  const totalRevenue = monthData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCommission = monthData.reduce((sum, d) => sum + d.commission, 0);
  
  return {
    totalClicks: {
      today: todayClicks,
      week: weekClicks,
      month: monthClicks,
    },
    totalConversions,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCommission: Math.round(totalCommission * 100) / 100,
    conversionRate: Math.round(totalConversions / monthClicks * 100 * 100) / 100,
  };
};

export const mockProducts = generateMockProducts(50);
export const mockLinks = generateMockLinks(mockProducts);
export const mockAnalytics = generateDailyAnalytics(30);
export const mockDashboardStats = calculateDashboardStats(mockAnalytics);

export const recentActivities = [
  { id: 1, type: 'click', message: 'Link clicked: Wireless Bluetooth Earbuds Pro', time: '2 mins ago' },
  { id: 2, type: 'conversion', message: 'New conversion: Smart Watch Series X (฿1,299)', time: '15 mins ago' },
  { id: 3, type: 'link', message: 'New affiliate link generated for Portable Power Bank', time: '1 hour ago' },
  { id: 4, type: 'campaign', message: 'Campaign "11.11 Big Sale" started', time: '2 hours ago' },
  { id: 5, type: 'product', message: '10 new trending products discovered', time: '3 hours ago' },
  { id: 6, type: 'click', message: 'Link clicked: Mechanical Gaming Keyboard RGB', time: '4 hours ago' },
  { id: 7, type: 'conversion', message: 'New conversion: Wireless Gaming Mouse (฿599)', time: '5 hours ago' },
  { id: 8, type: 'post', message: 'Content posted to Facebook: USB-C Hub Deal', time: '6 hours ago' },
];

export const channelPerformance = [
  { name: 'Facebook', value: 45, clicks: 5600, conversions: 280 },
  { name: 'LINE', value: 30, clicks: 3800, conversions: 190 },
  { name: 'Telegram', value: 15, clicks: 1900, conversions: 95 },
  { name: 'Website', value: 10, clicks: 1200, conversions: 60 },
];
