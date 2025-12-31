import { useState } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface FilterBarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  filters: {
    category: string;
    priceRange: [number, number];
    commissionRange: [number, number];
    minRating: number;
    trendingOnly: boolean;
    flashSaleOnly: boolean;
  };
  onFiltersChange: (filters: FilterBarProps['filters']) => void;
}

const categories = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Sports',
  'Toys',
  'Food',
  'Health',
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'commission-high', label: 'Commission: High to Low' },
  { value: 'rating-high', label: 'Rating: High to Low' },
  { value: 'sold-high', label: 'Most Sold' },
];

export function FilterBar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFiltersChange,
}: FilterBarProps) {
  const [tempFilters, setTempFilters] = useState(filters);
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = [
    filters.category !== 'All Categories',
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000,
    filters.commissionRange[0] > 0 || filters.commissionRange[1] < 20,
    filters.minRating > 0,
    filters.trendingOnly,
    filters.flashSaleOnly,
  ].filter(Boolean).length;

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: 'All Categories',
      priceRange: [0, 10000] as [number, number],
      commissionRange: [0, 20] as [number, number],
      minRating: 0,
      trendingOnly: false,
      flashSaleOnly: false,
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Quick Filter */}
        <Select
          value={filters.category}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Narrow down products with specific criteria
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range (฿)</Label>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={tempFilters.priceRange}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, priceRange: value as [number, number] })
                  }
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>฿{tempFilters.priceRange[0].toLocaleString()}</span>
                  <span>฿{tempFilters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              {/* Commission Range */}
              <div className="space-y-3">
                <Label>Commission Rate (%)</Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={tempFilters.commissionRange}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, commissionRange: value as [number, number] })
                  }
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{tempFilters.commissionRange[0]}%</span>
                  <span>{tempFilters.commissionRange[1]}%</span>
                </div>
              </div>

              <Separator />

              {/* Minimum Rating */}
              <div className="space-y-3">
                <Label>Minimum Rating</Label>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[tempFilters.minRating]}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, minRating: value[0] })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {tempFilters.minRating > 0 ? `${tempFilters.minRating}+ stars` : 'Any rating'}
                </p>
              </div>

              <Separator />

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="trending-only">Trending Products Only</Label>
                  <Switch
                    id="trending-only"
                    checked={tempFilters.trendingOnly}
                    onCheckedChange={(checked) =>
                      setTempFilters({ ...tempFilters, trendingOnly: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="flash-sale-only">Flash Sale Only</Label>
                  <Switch
                    id="flash-sale-only"
                    checked={tempFilters.flashSaleOnly}
                    onCheckedChange={(checked) =>
                      setTempFilters({ ...tempFilters, flashSaleOnly: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button className="flex-1" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
