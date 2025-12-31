import { AffiliateLink, Product } from '@/types';
import { mockProducts, mockCampaigns } from './mockData';

// Generate mock affiliate links with realistic data
export const generateMockAffiliateLinks = (count: number = 30): (AffiliateLink & { product?: Product })[] => {
  const channels = [
    { id: 'facebook_page_1', name: 'Facebook Page' },
    { id: 'instagram_1', name: 'Instagram' },
    { id: 'line_oa_1', name: 'LINE OA' },
    { id: 'telegram_1', name: 'Telegram' },
    { id: 'website_1', name: 'Website' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const product = mockProducts[i % mockProducts.length];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const hasCampaign = Math.random() > 0.4;
    const campaign = hasCampaign ? mockCampaigns[Math.floor(Math.random() * mockCampaigns.length)] : null;
    
    const clicks = Math.floor(Math.random() * 5000) + 100;
    const conversions = Math.floor(clicks * (Math.random() * 0.08 + 0.01));
    const revenue = conversions * (product.price * 0.8);
    const commission = revenue * (product.commission_rate / 100);

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));

    return {
      id: i + 1,
      product_id: product.id,
      short_link: `https://invol.co/${Math.random().toString(36).substring(2, 8)}`,
      full_link: `https://invol.co/aff_m?offer_id=${Math.random().toString(36).substring(2, 10)}&aff_id=${channel.id}`,
      property_id: channel.id,
      property_name: channel.name,
      sub_id: `sub_${Math.random().toString(36).substring(2, 6)}`,
      campaign_id: campaign?.id,
      click_count: clicks,
      conversion_count: conversions,
      revenue: Math.round(revenue * 100) / 100,
      commission: Math.round(commission * 100) / 100,
      created_at: createdDate.toISOString(),
      updated_at: new Date().toISOString(),
      product,
    };
  });
};

export const mockAffiliateLinks = generateMockAffiliateLinks(30);

// Calculate link stats summary
export const calculateLinkStats = (links: typeof mockAffiliateLinks) => {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
  const totalConversions = links.reduce((sum, link) => sum + link.conversion_count, 0);
  const totalCommission = links.reduce((sum, link) => sum + link.commission, 0);
  const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  return {
    totalLinks,
    totalClicks,
    totalConversions,
    totalCommission: Math.round(totalCommission * 100) / 100,
    avgConversionRate: Math.round(avgConversionRate * 100) / 100,
  };
};
