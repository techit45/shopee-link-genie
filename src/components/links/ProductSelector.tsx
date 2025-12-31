import { useState, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelect: (product: Product) => void;
}

export function ProductSelector({ products, selectedProduct, onSelect }: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shop_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products by name..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedCategory === null ? 'secondary' : 'ghost'}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'secondary' : 'ghost'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products List */}
      <ScrollArea className="h-[400px] rounded-lg border">
        <div className="space-y-2 p-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={cn(
                'flex cursor-pointer items-center gap-4 rounded-lg border p-3 transition-all hover:border-primary/50 hover:bg-accent',
                selectedProduct?.id === product.id && 'border-primary bg-primary/5'
              )}
              onClick={() => onSelect(product)}
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.image_urls[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {selectedProduct?.id === product.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                    <Check className="h-6 w-6 text-primary-foreground" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.shop_name}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="font-semibold text-primary">{formatPrice(product.price)}</span>
                  <Badge variant="outline" className="text-xs">
                    -{product.discount_percent}%
                  </Badge>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <Badge variant="secondary" className="mb-1">
                  {product.category}
                </Badge>
                <p className="text-sm font-medium text-success">
                  {product.commission_rate}% • {formatPrice(product.estimated_commission)}
                </p>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <p className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
      </p>
    </div>
  );
}
