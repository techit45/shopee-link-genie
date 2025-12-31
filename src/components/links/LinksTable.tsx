import { useState } from 'react';
import { Search, Copy, Check, ExternalLink, MoreHorizontal, BarChart3, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AffiliateLink, Product } from '@/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LinksTableProps {
  links: (AffiliateLink & { product?: Product })[];
  selectedIds: number[];
  onSelectChange: (ids: number[]) => void;
  onViewStats: (link: AffiliateLink) => void;
  onEdit: (link: AffiliateLink) => void;
  onDelete: (link: AffiliateLink) => void;
}

export function LinksTable({
  links,
  selectedIds,
  onSelectChange,
  onViewStats,
  onEdit,
  onDelete,
}: LinksTableProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (link: string, id: number) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast({
      title: 'Copied!',
      description: 'Link copied to clipboard',
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === links.length) {
      onSelectChange([]);
    } else {
      onSelectChange(links.map((l) => l.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getConversionRateColor = (rate: number) => {
    if (rate >= 5) return 'text-success';
    if (rate >= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getChannelIcon = (propertyId: string) => {
    if (propertyId.includes('facebook')) return '📘';
    if (propertyId.includes('instagram')) return '📸';
    if (propertyId.includes('line')) return '💬';
    if (propertyId.includes('telegram')) return '✈️';
    if (propertyId.includes('tiktok')) return '🎵';
    return '🌐';
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === links.length && links.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="min-w-[250px]">Product</TableHead>
            <TableHead className="min-w-[180px]">Short Link</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead className="text-right">Clicks</TableHead>
            <TableHead className="text-right">Conv.</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => {
            const conversionRate = link.click_count > 0
              ? (link.conversion_count / link.click_count) * 100
              : 0;

            return (
              <TableRow key={link.id} className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(link.id)}
                    onCheckedChange={() => handleSelectOne(link.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {link.product?.image_urls[0] && (
                        <img
                          src={link.product.image_urls[0]}
                          alt={link.product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{link.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(link.product?.price || 0)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="max-w-[140px] truncate rounded bg-muted px-2 py-1 text-xs">
                      {link.short_link}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => handleCopy(link.short_link, link.id)}
                    >
                      {copiedId === link.id ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => window.open(link.short_link, '_blank')}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {link.campaign_id ? (
                    <Badge variant="secondary" className="text-xs">
                      Campaign #{link.campaign_id}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span>{getChannelIcon(link.property_id)}</span>
                    <span className="text-sm">{link.property_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {link.click_count.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {link.conversion_count.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium text-success">
                  {formatCurrency(link.commission)}
                </TableCell>
                <TableCell className={cn('text-right font-medium', getConversionRateColor(conversionRate))}>
                  {conversionRate.toFixed(2)}%
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCopy(link.short_link, link.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewStats(link)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(link)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(link)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">No links found</p>
          <p className="text-muted-foreground">Generate your first affiliate link to get started</p>
        </div>
      )}
    </div>
  );
}
