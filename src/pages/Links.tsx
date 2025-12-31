import { useState, useMemo } from 'react';
import { Plus, Link2, Download, Trash2, Copy, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatCard } from '@/components/ui/stat-card';
import { LinksTable } from '@/components/links/LinksTable';
import { LinkGeneratorDialog } from '@/components/links/LinkGeneratorDialog';
import { LinkStatsModal } from '@/components/links/LinkStatsModal';
import { mockAffiliateLinks, calculateLinkStats } from '@/data/linksData';
import { mockCampaigns } from '@/data/mockData';
import { AffiliateLink, Product } from '@/types';
import { toast } from '@/hooks/use-toast';
import { exportLinksToCSV, availableProperties } from '@/services/linkGenerator';
import { mockProducts } from '@/data/mockData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MousePointerClick, ShoppingCart, DollarSign, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

export default function Links() {
  const [links, setLinks] = useState(mockAffiliateLinks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [statsLink, setStatsLink] = useState<AffiliateLink | null>(null);
  const [deleteLink, setDeleteLink] = useState<AffiliateLink | null>(null);

  // Calculate stats
  const stats = useMemo(() => calculateLinkStats(links), [links]);

  // Filter and sort links
  const filteredLinks = useMemo(() => {
    let result = [...links];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (link) =>
          link.product?.name.toLowerCase().includes(query) ||
          link.short_link.toLowerCase().includes(query)
      );
    }

    // Channel filter
    if (filterChannel !== 'all') {
      result = result.filter((link) => link.property_id === filterChannel);
    }

    // Campaign filter
    if (filterCampaign !== 'all') {
      const campaignId = parseInt(filterCampaign);
      result = result.filter((link) => link.campaign_id === campaignId);
    }

    // Sorting
    switch (sortBy) {
      case 'clicks':
        result.sort((a, b) => b.click_count - a.click_count);
        break;
      case 'conversions':
        result.sort((a, b) => b.conversion_count - a.conversion_count);
        break;
      case 'commission':
        result.sort((a, b) => b.commission - a.commission);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [links, searchQuery, filterChannel, filterCampaign, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE);
  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewStats = (link: AffiliateLink) => {
    setStatsLink(link);
  };

  const handleEdit = (link: AffiliateLink) => {
    toast({
      title: 'Edit Link',
      description: `Editing link ${link.short_link}`,
    });
  };

  const handleDelete = (link: AffiliateLink) => {
    setDeleteLink(link);
  };

  const confirmDelete = () => {
    if (deleteLink) {
      setLinks((prev) => prev.filter((l) => l.id !== deleteLink.id));
      toast({
        title: 'Link Deleted',
        description: 'The affiliate link has been removed',
      });
      setDeleteLink(null);
    }
  };

  const handleBulkDelete = () => {
    setLinks((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
    toast({
      title: 'Links Deleted',
      description: `${selectedIds.length} links have been removed`,
    });
    setSelectedIds([]);
  };

  const handleBulkCopy = async () => {
    const selectedLinks = links.filter((l) => selectedIds.includes(l.id));
    const linksText = selectedLinks.map((l) => l.short_link).join('\n');
    await navigator.clipboard.writeText(linksText);
    toast({
      title: 'Copied!',
      description: `${selectedIds.length} links copied to clipboard`,
    });
  };

  const handleExport = () => {
    const csv = exportLinksToCSV(links as AffiliateLink[], mockProducts);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-links-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Exported!',
      description: 'Links exported to CSV file',
    });
  };

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Links</h1>
          <p className="text-muted-foreground">Manage and track all your affiliate links</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/links/bulk">
              <Layers className="mr-2 h-4 w-4" />
              Bulk Generate
            </Link>
          </Button>
          <Button onClick={() => setIsGeneratorOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate New Link
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Links"
          value={stats.totalLinks}
          icon={Link2}
          variant="primary"
        />
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={MousePointerClick}
        />
        <StatCard
          title="Total Commission"
          value={formatCurrency(stats.totalCommission)}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Avg. Conversion Rate"
          value={`${stats.avgConversionRate}%`}
          icon={Percent}
          variant="warning"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-3">
          <Input
            placeholder="Search by product or link..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {availableProperties.map((prop) => (
                <SelectItem key={prop.id} value={prop.id}>
                  {prop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCampaign} onValueChange={setFilterCampaign}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {mockCampaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id.toString()}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="clicks">Most Clicks</SelectItem>
              <SelectItem value="conversions">Most Conversions</SelectItem>
              <SelectItem value="commission">Highest Commission</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
          <span className="text-sm font-medium">{selectedIds.length} links selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Links Table */}
      <LinksTable
        links={paginatedLinks}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        onViewStats={handleViewStats}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modals */}
      <LinkGeneratorDialog
        open={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onLinkGenerated={(response) => {
          // Add the new link to the list
          const newLink = {
            id: response.id,
            product_id: response.product.id,
            short_link: response.shortLink,
            full_link: response.fullLink,
            property_id: response.propertyId,
            property_name: response.propertyName,
            sub_id: response.subId || '',
            campaign_id: response.campaignId,
            click_count: 0,
            conversion_count: 0,
            revenue: 0,
            commission: 0,
            created_at: response.createdAt,
            updated_at: response.createdAt,
            product: response.product,
          };
          setLinks((prev) => [newLink, ...prev]);
        }}
      />

      <LinkStatsModal
        link={statsLink}
        open={!!statsLink}
        onClose={() => setStatsLink(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteLink} onOpenChange={() => setDeleteLink(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Affiliate Link?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The link will stop working and all tracking data will be
              preserved for historical purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
