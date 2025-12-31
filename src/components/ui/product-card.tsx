import { Star, Flame, Zap, ExternalLink, Link2 } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Badge } from './badge';
import { Checkbox } from './checkbox';

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onGenerateLink?: (product: Product) => void;
  onCreateContent?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({
  product,
  isSelected = false,
  onSelect,
  onGenerateLink,
  onCreateContent,
  viewMode = 'grid',
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-medium',
          isSelected && 'border-primary bg-primary/5'
        )}
      >
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(product.id)}
            className="shrink-0"
          />
        )}
        
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.is_flash_sale && (
            <div className="absolute left-1 top-1">
              <Badge variant="destructive" className="gap-1 px-1.5 py-0.5 text-[10px]">
                <Zap className="h-2.5 w-2.5" />
                Flash
              </Badge>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.shop_name}</p>
            </div>
            <div className="flex items-center gap-2">
              {product.is_trending && (
                <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning">
                  <Flame className="h-3 w-3" />
                  Trending
                </Badge>
              )}
              {renderRating(product.rating)}
            </div>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
              <Badge variant="destructive" className="text-xs">
                -{product.discount_percent}%
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="font-semibold text-success">
                  {product.commission_rate}% ({formatPrice(product.estimated_commission)})
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerateLink?.(product)}
                  className="gap-1"
                >
                  <Link2 className="h-4 w-4" />
                  Link
                </Button>
                <Button
                  size="sm"
                  onClick={() => onCreateContent?.(product)}
                  className="gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-large',
        isSelected && 'border-primary ring-2 ring-primary/20'
      )}
    >
      {onSelect && (
        <div className="absolute left-3 top-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(product.id)}
            className="border-2 bg-background/80 backdrop-blur-sm"
          />
        </div>
      )}

      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_urls[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {product.is_flash_sale && (
            <Badge variant="destructive" className="gap-1">
              <Zap className="h-3 w-3" />
              Flash Sale
            </Badge>
          )}
          {product.is_trending && (
            <Badge className="gap-1 bg-warning text-warning-foreground">
              <Flame className="h-3 w-3" />
              Trending
            </Badge>
          )}
        </div>

        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
            -{product.discount_percent}%
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          {renderRating(product.rating)}
        </div>

        <h3 className="mb-1 line-clamp-2 flex-1 text-sm font-medium leading-tight text-foreground">
          {product.name}
        </h3>
        
        <p className="mb-3 text-xs text-muted-foreground">{product.shop_name}</p>

        <div className="mb-3 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{product.sold_count.toLocaleString()} sold</span>
            <span className="font-medium text-success">
              {product.commission_rate}% • {formatPrice(product.estimated_commission)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1"
            onClick={() => onGenerateLink?.(product)}
          >
            <Link2 className="h-3.5 w-3.5" />
            Generate Link
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1"
            onClick={() => onCreateContent?.(product)}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Content
          </Button>
        </div>
      </div>
    </div>
  );
}
