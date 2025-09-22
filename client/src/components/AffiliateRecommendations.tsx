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

      // Analyze recipes for dynamic recommendations (client-side fallback)
      const getDynamicProducts = () => {
        if (context === 'recipe' && recipes.length > 0) {
          const needs: string[] = [];

          for (const recipe of recipes) {
            const instructions = recipe.instructions?.join(' ').toLowerCase() || '';
            const title = recipe.title?.toLowerCase() || '';
            const description = recipe.description?.toLowerCase() || '';
            const allText = `${title} ${description} ${instructions}`;

            // Detect cooking methods
            if (allText.includes('bake') || allText.includes('oven')) needs.push('baking');
            if (allText.includes('pressure cook') || allText.includes('instant pot')) needs.push('pressure-cook');
            if (allText.includes('air fry') || allText.includes('crispy')) needs.push('air-fry');
            if (allText.includes('mix') || allText.includes('whisk')) needs.push('mixing');
            if (allText.includes('cut') || allText.includes('chop') || allText.includes('slice')) needs.push('knives');
            if (allText.includes('spice') || allText.includes('season')) needs.push('spices');
          }

          // Create dynamic product recommendations
          const dynamicProducts: AffiliateProduct[] = [];

          if (needs.includes('pressure-cook')) {
            dynamicProducts.push({
              id: 'amz-instant-pot',
              title: 'Instant Pot Duo 7-in-1',
              description: 'Perfect for the pressure cooking mentioned in your recipes',
              price: '$89.95',
              originalPrice: '$119.99',
              discount: '25% OFF',
              imageUrl: 'https://m.media-amazon.com/images/I/71V1LrY1MSL._AC_SL160_.jpg',
              affiliateLink: 'https://www.amazon.com/dp/B06Y1YD5W7?tag=receiptchef-20',
              category: 'appliance' as const,
              relevance: 'high' as const
            });
          }

          if (needs.includes('air-fry')) {
            dynamicProducts.push({
              id: 'amz-air-fryer',
              title: 'COSORI Air Fryer',
              description: 'Perfect for making the crispy dishes in your meal plan',
              price: '$99.99',
              originalPrice: '$129.99',
              discount: '23% OFF',
              imageUrl: 'https://m.media-amazon.com/images/I/71qBMnFrdTL._AC_SL160_.jpg',
              affiliateLink: 'https://www.amazon.com/dp/B07FDJMC9Q?tag=receiptchef-20',
              category: 'appliance' as const,
              relevance: 'high' as const
            });
          }

          if (needs.includes('knives')) {
            dynamicProducts.push({
              id: 'amz-knife-set',
              title: 'Cuisinart 15-Piece Knife Set',
              description: 'Essential for all the chopping and slicing in your recipes',
              price: '$79.99',
              originalPrice: '$159.99',
              discount: '50% OFF',
              imageUrl: 'https://m.media-amazon.com/images/I/81cV-pZPTCL._AC_SL160_.jpg',
              affiliateLink: 'https://www.amazon.com/dp/B00GIBKC3K?tag=receiptchef-20',
              category: 'kitchen-tool' as const,
              relevance: 'high' as const
            });
          }

          if (needs.includes('mixing')) {
            dynamicProducts.push({
              id: 'amz-mixing-bowls',
              title: 'Stainless Steel Mixing Bowl Set',
              description: 'Essential for the mixing and whisking in your recipes',
              price: '$29.99',
              originalPrice: '$49.99',
              discount: '40% OFF',
              imageUrl: 'https://m.media-amazon.com/images/I/71Uu52vLXSL._AC_SL160_.jpg',
              affiliateLink: 'https://www.amazon.com/dp/B01HTYH8YA?tag=receiptchef-20',
              category: 'kitchen-tool' as const,
              relevance: 'high' as const
            });
          }

          if (needs.includes('baking')) {
            dynamicProducts.push({
              id: 'amz-baking-set',
              title: 'Complete Baking Set',
              description: 'Everything needed for the baking recipes you\'re making',
              price: '$45.99',
              originalPrice: '$65.99',
              discount: '30% OFF',
              imageUrl: 'https://m.media-amazon.com/images/I/81dBwXNGgUL._AC_SL160_.jpg',
              affiliateLink: 'https://www.amazon.com/dp/B08XYZ123?tag=receiptchef-20',
              category: 'kitchen-tool' as const,
              relevance: 'high' as const
            });
          }

          if (needs.includes('spices')) {
            dynamicProducts.push({
              id: 'amz-spice-set',
              title: 'McCormick Gourmet Spice Set',
              description: 'Complete your spice collection for these recipes',
              price: '$39.99',
              imageUrl: 'https://m.media-amazon.com/images/I/91gO5PwGYJL._AC_SL160_.jpg',
              affiliateLink: 'https://www.amazon.com/dp/B07BNQSFB7?tag=receiptchef-20',
              category: 'ingredient' as const,
              relevance: 'medium' as const
            });
          }

          if (dynamicProducts.length > 0) {
            return dynamicProducts;
          }
        }

        // Fallback to general products
        return [
          {
            id: 'amz-knife-set',
            title: 'Cuisinart 15-Piece Knife Set',
            description: 'Professional-grade stainless steel knives with block',
            price: '$79.99',
            originalPrice: '$159.99',
            discount: '50% OFF',
            imageUrl: 'https://m.media-amazon.com/images/I/81cV-pZPTCL._AC_SL160_.jpg',
            affiliateLink: 'https://www.amazon.com/dp/B00GIBKC3K?tag=receiptchef-20',
            category: 'kitchen-tool' as const,
            relevance: 'high' as const
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
            category: 'appliance' as const,
            relevance: 'high' as const
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
            category: 'kitchen-tool' as const,
            relevance: 'medium' as const
          }
        ];
      };

      const mockProducts = getDynamicProducts();

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
      const relevanceOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
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