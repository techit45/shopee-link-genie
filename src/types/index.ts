export interface Product {
  id: number;
  shopee_id: string;
  name: string;
  price: number;
  original_price: number;
  discount_percent: number;
  rating: number;
  sold_count: number;
  stock: number;
  category: string;
  shop_id: string;
  shop_name: string;
  image_urls: string[];
  product_url: string;
  commission_rate: number;
  estimated_commission: number;
  is_trending: boolean;
  is_flash_sale: boolean;
  flash_sale_end?: string;
  last_scraped?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateLink {
  id: number;
  product_id: number;
  short_link: string;
  full_link: string;
  property_id: string;
  property_name: string;
  sub_id: string;
  campaign_id?: number;
  click_count: number;
  conversion_count: number;
  revenue: number;
  commission: number;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  target_category?: string;
  target_commission_min?: number;
  auto_post: boolean;
  post_schedule?: string;
  channels: string[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface DailyAnalytics {
  id: number;
  date: string;
  product_id?: number;
  link_id?: number;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  conversion_rate: number;
}

export interface ContentPost {
  id: number;
  product_id?: number;
  campaign_id?: number;
  content_type: 'text' | 'image' | 'video';
  title?: string;
  description?: string;
  image_urls: string[];
  hashtags: string[];
  affiliate_link?: string;
  channel: string;
  scheduled_at?: string;
  posted_at?: string;
  engagement_count: number;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalClicks: {
    today: number;
    week: number;
    month: number;
  };
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  conversionRate: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface ApiSettings {
  involve_asia_client_id?: string;
  involve_asia_client_secret?: string;
  facebook_token?: string;
  line_oa_token?: string;
  telegram_token?: string;
}
