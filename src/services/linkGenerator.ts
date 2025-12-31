import { Product, AffiliateLink, DailyAnalytics } from '@/types';
import { mockProducts } from '@/data/mockData';

// Simulated cache for generated links
const linkCache = new Map<string, AffiliateLink>();

// Generate cache key
const getCacheKey = (productId: number, propertyId: string, campaignId?: number) => {
  return `link:${productId}:${propertyId}:${campaignId || 'none'}`;
};

// Simulate Involve Asia API response
const simulateInvolveAsiaResponse = (productUrl: string, propertyId: string, subId?: string) => {
  const randomId = Math.random().toString(36).substring(2, 8);
  return {
    status: 'success',
    data: {
      tracking_link: `https://invol.co/aff_m?offer_id=${randomId}&aff_id=${propertyId}${subId ? `&sub=${subId}` : ''}`,
      short_link: `https://invol.co/${randomId}`,
    },
  };
};

// Generate QR code data URL (simulated)
const generateQRCode = (link: string): string => {
  // In production, use a QR code library like qrcode
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
};

// Parse sub ID pattern
const parseSubIdPattern = (
  pattern: string,
  product: Product,
  campaignName?: string
): string => {
  const date = new Date().toISOString().split('T')[0];
  return pattern
    .replace('{product_id}', product.id.toString())
    .replace('{category}', product.category.toLowerCase().replace(/\s+/g, '_'))
    .replace('{date}', date)
    .replace('{campaign}', campaignName?.toLowerCase().replace(/\s+/g, '_') || 'none');
};

export interface GenerateLinkRequest {
  productId: number;
  propertyId: string;
  propertyName: string;
  campaignId?: number;
  campaignName?: string;
  subId?: string;
  customAlias?: string;
}

export interface GenerateLinkResponse {
  id: number;
  product: Product;
  shortLink: string;
  fullLink: string;
  qrCode: string;
  propertyId: string;
  propertyName: string;
  campaignId?: number;
  campaignName?: string;
  subId?: string;
  createdAt: string;
}

export interface BatchGenerateRequest {
  productIds: number[];
  propertyId: string;
  propertyName: string;
  campaignId?: number;
  campaignName?: string;
  subIdPattern?: string;
}

export interface BatchGenerateResult {
  productId: number;
  productName: string;
  linkId: number;
  shortLink: string;
  status: 'success' | 'failed';
  error?: string;
}

export interface BatchJobStatus {
  jobId: string;
  total: number;
  completed: number;
  failed: number;
  status: 'processing' | 'completed' | 'failed';
  results: BatchGenerateResult[];
}

export interface LinkStats {
  linkId: number;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  conversionRate: number;
  dailyData: {
    date: string;
    clicks: number;
    conversions: number;
    commission: number;
  }[];
}

// Simulated link generation service
export const linkGeneratorService = {
  // Generate a single affiliate link
  async generateLink(request: GenerateLinkRequest): Promise<GenerateLinkResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));

    const product = mockProducts.find((p) => p.id === request.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check cache
    const cacheKey = getCacheKey(request.productId, request.propertyId, request.campaignId);
    const cachedLink = linkCache.get(cacheKey);
    if (cachedLink) {
      return {
        id: cachedLink.id,
        product,
        shortLink: cachedLink.short_link,
        fullLink: cachedLink.full_link,
        qrCode: generateQRCode(cachedLink.short_link),
        propertyId: request.propertyId,
        propertyName: request.propertyName,
        campaignId: request.campaignId,
        campaignName: request.campaignName,
        subId: request.subId,
        createdAt: cachedLink.created_at,
      };
    }

    // Generate new link via "Involve Asia API"
    const apiResponse = simulateInvolveAsiaResponse(
      product.product_url,
      request.propertyId,
      request.subId
    );

    const newLinkId = Date.now();
    const newLink: AffiliateLink = {
      id: newLinkId,
      product_id: product.id,
      short_link: request.customAlias
        ? `https://invol.co/${request.customAlias}`
        : apiResponse.data.short_link,
      full_link: apiResponse.data.tracking_link,
      property_id: request.propertyId,
      property_name: request.propertyName,
      sub_id: request.subId || '',
      campaign_id: request.campaignId,
      click_count: 0,
      conversion_count: 0,
      revenue: 0,
      commission: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Cache the link
    linkCache.set(cacheKey, newLink);

    return {
      id: newLink.id,
      product,
      shortLink: newLink.short_link,
      fullLink: newLink.full_link,
      qrCode: generateQRCode(newLink.short_link),
      propertyId: request.propertyId,
      propertyName: request.propertyName,
      campaignId: request.campaignId,
      campaignName: request.campaignName,
      subId: request.subId,
      createdAt: newLink.created_at,
    };
  },

  // Batch generate links
  async batchGenerate(
    request: BatchGenerateRequest,
    onProgress?: (completed: number, total: number) => void
  ): Promise<BatchJobStatus> {
    const jobId = `batch_${Date.now()}`;
    const results: BatchGenerateResult[] = [];
    let failed = 0;

    for (let i = 0; i < request.productIds.length; i++) {
      const productId = request.productIds[i];
      const product = mockProducts.find((p) => p.id === productId);

      if (!product) {
        results.push({
          productId,
          productName: 'Unknown',
          linkId: 0,
          shortLink: '',
          status: 'failed',
          error: 'Product not found',
        });
        failed++;
        continue;
      }

      try {
        // Simulate rate limiting delay (20 calls/min = 3 seconds between calls)
        await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

        const subId = request.subIdPattern
          ? parseSubIdPattern(request.subIdPattern, product, request.campaignName)
          : undefined;

        const response = await this.generateLink({
          productId,
          propertyId: request.propertyId,
          propertyName: request.propertyName,
          campaignId: request.campaignId,
          campaignName: request.campaignName,
          subId,
        });

        results.push({
          productId,
          productName: product.name,
          linkId: response.id,
          shortLink: response.shortLink,
          status: 'success',
        });
      } catch (error) {
        results.push({
          productId,
          productName: product.name,
          linkId: 0,
          shortLink: '',
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        failed++;
      }

      onProgress?.(i + 1, request.productIds.length);
    }

    return {
      jobId,
      total: request.productIds.length,
      completed: request.productIds.length - failed,
      failed,
      status: 'completed',
      results,
    };
  },

  // Get link statistics
  async getLinkStats(linkId: number, startDate: string, endDate: string): Promise<LinkStats> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock daily data
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const dailyData: LinkStats['dailyData'] = [];
    let totalClicks = 0;
    let totalConversions = 0;
    let totalCommission = 0;

    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      const clicks = Math.floor(Math.random() * 100) + 10;
      const conversions = Math.floor(clicks * (Math.random() * 0.08 + 0.02));
      const commission = conversions * (Math.random() * 100 + 50);

      totalClicks += clicks;
      totalConversions += conversions;
      totalCommission += commission;

      dailyData.push({
        date: date.toISOString().split('T')[0],
        clicks,
        conversions,
        commission: Math.round(commission * 100) / 100,
      });
    }

    const revenue = totalCommission * 10; // Assume 10% commission rate

    return {
      linkId,
      clicks: totalClicks,
      conversions: totalConversions,
      revenue: Math.round(revenue * 100) / 100,
      commission: Math.round(totalCommission * 100) / 100,
      conversionRate: Math.round((totalConversions / totalClicks) * 100 * 100) / 100,
      dailyData,
    };
  },
};

// Properties/Channels available
export const availableProperties = [
  { id: 'facebook_page_1', name: 'Facebook Page', icon: 'facebook' },
  { id: 'instagram_1', name: 'Instagram', icon: 'instagram' },
  { id: 'line_oa_1', name: 'LINE Official Account', icon: 'line' },
  { id: 'telegram_1', name: 'Telegram Channel', icon: 'telegram' },
  { id: 'website_1', name: 'Main Website', icon: 'globe' },
  { id: 'tiktok_1', name: 'TikTok', icon: 'tiktok' },
];

// Export to CSV
export const exportLinksToCSV = (links: AffiliateLink[], products: Product[]): string => {
  const headers = ['Product Name', 'Short Link', 'Full Link', 'Channel', 'Campaign', 'Clicks', 'Conversions', 'Commission', 'Created'];
  
  const rows = links.map((link) => {
    const product = products.find((p) => p.id === link.product_id);
    return [
      product?.name || 'Unknown',
      link.short_link,
      link.full_link,
      link.property_name,
      link.campaign_id || '-',
      link.click_count,
      link.conversion_count,
      link.commission,
      new Date(link.created_at).toLocaleDateString(),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
