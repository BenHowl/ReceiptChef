import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  imageUrl?: string;
  affiliateLink: string;
  category: 'kitchen-tool' | 'ingredient' | 'cookbook' | 'appliance';
  relevance?: 'high' | 'medium' | 'low';
}

interface AffiliateCardProps {
  product: AffiliateProduct;
  variant?: 'compact' | 'full';
  className?: string;
}

export default function AffiliateCard({ product, variant = 'compact', className = '' }: AffiliateCardProps) {
  const handleClick = () => {
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <Card
        className={`hover-elevate transition-all duration-200 cursor-pointer bg-accent/5 border-accent/10 ${className}`}
        onClick={handleClick}
        data-testid={`affiliate-card-${product.id}`}
      >
        <CardContent className="p-3 md:p-4">
          <div className="flex items-start gap-3">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-16 h-16 md:w-20 md:h-20 rounded-md object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-medium line-clamp-1 flex-1">
                  {product.title}
                </h4>
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2">
                {product.discount && (
                  <Badge variant="secondary" className="text-xs">
                    {product.discount}
                  </Badge>
                )}
                {product.price && (
                  <span className="text-sm font-semibold text-primary">
                    {product.price}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground">
              Partner offer · Commission may be earned
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`hover-elevate transition-all duration-200 cursor-pointer bg-accent/5 border-accent/10 ${className}`}
      onClick={handleClick}
      data-testid={`affiliate-card-full-${product.id}`}
    >
      <CardContent className="p-4 md:p-6">
        {product.imageUrl && (
          <div className="aspect-video rounded-md overflow-hidden mb-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base md:text-lg flex-1">
              {product.title}
            </h3>
            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-muted-foreground">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.discount && (
                <Badge variant="secondary">
                  {product.discount}
                </Badge>
              )}
              {product.price && (
                <span className="text-lg font-bold text-primary">
                  {product.price}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <div className="pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              Partner offer · Commission may be earned from purchases
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}