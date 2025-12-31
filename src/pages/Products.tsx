import { useState, useMemo } from 'react';
import { Link2, Trash2, FolderPlus } from 'lucide-react';
import { FilterBar } from '@/components/products/FilterBar';
import { ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/data/mockData';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 12;

export default function Products() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    priceRange: [0, 10000] as [number, number],
    commissionRange: [0, 20] as [number, number],
    minRating: 0,
    trendingOnly: false,
    flashSaleOnly: false,
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shop_name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== 'All Categories') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range filter
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Commission range filter
    result = result.filter(
      (p) =>
        p.commission_rate >= filters.commissionRange[0] &&
        p.commission_rate <= filters.commissionRange[1]
    );

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Trending filter
    if (filters.trendingOnly) {
      result = result.filter((p) => p.is_trending);
    }

    // Flash sale filter
    if (filters.flashSaleOnly) {
      result = result.filter((p) => p.is_flash_sale);
    }

    // Sorting
    switch (sortBy) {
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'commission-high':
        result.sort((a, b) => b.commission_rate - a.commission_rate);
        break;
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'sold-high':
        result.sort((a, b) => b.sold_count - a.sold_count);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [searchQuery, sortBy, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const handleGenerateLink = (product: Product) => {
    toast({
      title: 'Link Generated',
      description: `Affiliate link created for "${product.name}"`,
    });
  };

  const handleCreateContent = (product: Product) => {
    toast({
      title: 'Content Editor',
      description: `Opening content editor for "${product.name}"`,
    });
  };

  const handleBulkGenerateLinks = () => {
    toast({
      title: 'Bulk Links Generated',
      description: `Created ${selectedProducts.length} affiliate links`,
    });
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Discover and manage affiliate products from Shopee
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredProducts.length} products found
        </Badge>
      </div>

      {/* Filter Bar */}
      <FilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
          <span className="text-sm font-medium">
            {selectedProducts.length} products selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSelectAll}>
              {selectedProducts.length === paginatedProducts.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button size="sm" className="gap-1" onClick={handleBulkGenerateLinks}>
              <Link2 className="h-4 w-4" />
              Generate Links
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <FolderPlus className="h-4 w-4" />
              Add to Campaign
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => setSelectedProducts([])}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'space-y-4'
        }
      >
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            isSelected={selectedProducts.includes(product.id)}
            onSelect={handleSelectProduct}
            onGenerateLink={handleGenerateLink}
            onCreateContent={handleCreateContent}
          />
        ))}
      </div>

      {/* Empty State */}
      {paginatedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

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
    </div>
  );
}
