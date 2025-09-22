import { ShoppingBag, ChefHat } from 'lucide-react';
import AffiliateCard, { type AffiliateProduct } from './AffiliateCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface AffiliateRecommendationsProps {
  context?: 'recipe' | 'ingredients' | 'meal-plan' | 'general';
  recipeType?: string;
  ingredients?: string[];
  recipes?: any[];
  maxItems?: number;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function AffiliateRecommendations({
  context = 'general',
  recipeType,
  ingredients = [],
  recipes = [],
  maxItems = 2,
  title,
  subtitle,
  className = ''
}: AffiliateRecommendationsProps) {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load affiliate preferences from localStorage
    const hideAds = localStorage.getItem('hideAffiliateAds') === 'true';
    setIsVisible(!hideAds);

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({
          context,
          ...(recipeType && { recipeType }),
          ...(ingredients.length > 0 && { ingredients: ingredients.join(',') }),
          maxItems: maxItems.toString(),
        });

        // Include recipes in the request body for dynamic analysis
        const requestBody = {
          ...(recipes.length > 0 && { recipes })
        };

        const hasBody = Object.keys(requestBody).length > 0;

        const response = await fetch(`/api/affiliate/products?${params}`, {
          method: hasBody ? 'POST' : 'GET',
          ...(hasBody && {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          })
        });
        if (response.ok) {
          const apiProducts = await response.json();
          setProducts(apiProducts);
          return;
        }
      } catch (error) {
        console.error('Error fetching affiliate products:', error);
      }

      // Fallback to mock products with real Amazon affiliate links
      const mockProducts: AffiliateProduct[] = [
      {
        id: 'amz-knife-set',
        title: 'Cuisinart 15-Piece Knife Set',
        description: 'Professional-grade stainless steel knives with block',
        price: '$79.99',
        originalPrice: '$159.99',
        discount: '50% OFF',
        imageUrl: 'https://m.media-amazon.com/images/I/81cV-pZPTCL._AC_SL160_.jpg',
        affiliateLink: 'https://www.amazon.com/dp/B00GIBKC3K?tag=receiptchef-20',
        category: 'kitchen-tool',
        relevance: 'high'
      },
      {
        id: 'amz-cookbook',
        title: 'Salt, Fat, Acid, Heat',
        description: 'Master the elements of good cooking',
        price: '$19.99',
        originalPrice: '$35.00',
        discount: '43% OFF',
        imageUrl: 'https://m.media-amazon.com/images/I/91wY-IcZPgL._AC_SL160_.jpg',
        affiliateLink: 'https://www.amazon.com/dp/B01HMXV0UQ?tag=receiptchef-20',
        category: 'cookbook',
        relevance: 'medium'
      },
      {
        id: 'amz-instant-pot',
        title: 'Instant Pot Duo 7-in-1',
        description: 'Electric pressure cooker, slow cooker, rice cooker & more',
        price: '$89.95',
        originalPrice: '$119.99',
        discount: '25% OFF',
        imageUrl: 'https://m.media-amazon.com/images/I/71V1LrY1MSL._AC_SL160_.jpg',
        affiliateLink: 'https://www.amazon.com/dp/B06Y1YD5W7?tag=receiptchef-20',
        category: 'appliance',
        relevance: 'high'
      },
      {
        id: 'amz-spice-set',
        title: 'McCormick Gourmet Spice Set',
        description: '12 essential spices for cooking',
        price: '$39.99',
        imageUrl: 'https://m.media-amazon.com/images/I/91gO5PwGYJL._AC_SL160_.jpg',
        affiliateLink: 'https://www.amazon.com/dp/B07BNQSFB7?tag=receiptchef-20',
        category: 'ingredient',
        relevance: 'medium'
      },
      {
        id: 'amz-mixing-bowls',
        title: 'Stainless Steel Mixing Bowl Set',
        description: 'Set of 6 nesting bowls with lids',
        price: '$29.99',
        originalPrice: '$49.99',
        discount: '40% OFF',
        imageUrl: 'https://m.media-amazon.com/images/I/71Uu52vLXSL._AC_SL160_.jpg',
        affiliateLink: 'https://www.amazon.com/dp/B01HTYH8YA?tag=receiptchef-20',
        category: 'kitchen-tool',
        relevance: 'low'
      }
    ];

    // Filter and sort products based on context and relevance
    let filteredProducts = [...mockProducts];

    if (context === 'recipe' && recipeType) {
      // Prioritize cooking tools and relevant cookbooks
      filteredProducts = filteredProducts.filter(
        p => p.category === 'kitchen-tool' || p.category === 'cookbook'
      );
    } else if (context === 'ingredients' && ingredients.length > 0) {
      // Prioritize ingredients and kitchen tools
      filteredProducts = filteredProducts.filter(
        p => p.category === 'ingredient' || p.category === 'kitchen-tool'
      );
    } else if (context === 'meal-plan') {
      // Show appliances and cookbooks for meal planning
      filteredProducts = filteredProducts.filter(
        p => p.category === 'appliance' || p.category === 'cookbook'
      );
    }

    // Sort by relevance
    filteredProducts.sort((a, b) => {
      const relevanceOrder = { high: 3, medium: 2, low: 1 };
      return (relevanceOrder[b.relevance || 'low'] - relevanceOrder[a.relevance || 'low']);
    });

      // Limit the number of items
      setProducts(filteredProducts.slice(0, maxItems));
    };

    fetchProducts();
  }, [context, recipeType, ingredients, recipes, maxItems]);

  if (!isVisible || products.length === 0) {
    return null;
  }

  const defaultTitle = context === 'recipe'
    ? 'Recommended for this recipe'
    : context === 'ingredients'
    ? 'Complete your shopping'
    : context === 'meal-plan'
    ? 'Meal prep essentials'
    : 'Kitchen recommendations';

  const defaultSubtitle = 'Carefully selected products to enhance your cooking';

  return (
    <Card className={`bg-accent/5 border-accent/10 ${className}`}>
      <CardHeader className="pb-3 md:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground/70" />
            <span>{title || defaultTitle}</span>
          </CardTitle>
          <button
            onClick={() => {
              setIsVisible(false);
              localStorage.setItem('hideAffiliateAds', 'true');
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Hide recommendations"
          >
            Hide
          </button>
        </div>
        {(subtitle || defaultSubtitle) && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {subtitle || defaultSubtitle}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => {
              // Track click
              fetch('/api/affiliate/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id, context })
              }).catch(err => console.error('Failed to track click:', err));
            }}
          >
            <AffiliateCard
              product={product}
              variant="compact"
            />
          </div>
        ))}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ChefHat className="h-3 w-3" />
            <span>
              ReceiptChef earns commissions from qualifying purchases.{' '}
              <a
                href="#affiliate-disclosure"
                className="underline hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Show affiliate disclosure modal
                  alert('Affiliate Disclosure: We earn a small commission when you make purchases through our partner links. This helps us keep the app free while providing you with quality recommendations.');
                }}
              >
                Learn more
              </a>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}