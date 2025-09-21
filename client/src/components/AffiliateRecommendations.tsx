import { ShoppingBag, ChefHat } from 'lucide-react';
import AffiliateCard, { type AffiliateProduct } from './AffiliateCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface AffiliateRecommendationsProps {
  context?: 'recipe' | 'ingredients' | 'meal-plan' | 'general';
  recipeType?: string;
  ingredients?: string[];
  maxItems?: number;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function AffiliateRecommendations({
  context = 'general',
  recipeType,
  ingredients = [],
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

        const response = await fetch(`/api/affiliate/products?${params}`);
        if (response.ok) {
          const apiProducts = await response.json();
          setProducts(apiProducts);
          return;
        }
      } catch (error) {
        console.error('Error fetching affiliate products:', error);
      }

      // Fallback to mock products if API fails
      const mockProducts: AffiliateProduct[] = [
      {
        id: 'kt-001',
        title: 'Professional Chef Knife Set',
        description: 'Essential knives for meal prep with ergonomic handles',
        price: '$89.99',
        originalPrice: '$129.99',
        discount: '30% OFF',
        imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=200',
        affiliateLink: 'https://example.com/knife-set',
        category: 'kitchen-tool',
        relevance: 'high'
      },
      {
        id: 'cb-001',
        title: 'Quick & Easy Recipes Cookbook',
        description: '100+ recipes perfect for busy weeknights',
        price: '$19.99',
        originalPrice: '$29.99',
        discount: 'Save $10',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200',
        affiliateLink: 'https://example.com/cookbook',
        category: 'cookbook',
        relevance: 'medium'
      },
      {
        id: 'ap-001',
        title: 'Air Fryer Pro',
        description: 'Healthy cooking made easy - perfect for quick meals',
        price: '$79.99',
        originalPrice: '$119.99',
        discount: '33% OFF',
        imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=200',
        affiliateLink: 'https://example.com/air-fryer',
        category: 'appliance',
        relevance: 'high'
      },
      {
        id: 'ig-001',
        title: 'Premium Olive Oil Set',
        description: 'Cold-pressed extra virgin olive oils from Italy',
        price: '$34.99',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
        affiliateLink: 'https://example.com/olive-oil',
        category: 'ingredient',
        relevance: 'medium'
      },
      {
        id: 'kt-002',
        title: 'Silicone Spatula Set',
        description: 'Heat-resistant, dishwasher safe cooking utensils',
        price: '$14.99',
        originalPrice: '$24.99',
        discount: '40% OFF',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200',
        affiliateLink: 'https://example.com/spatulas',
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
  }, [context, recipeType, ingredients, maxItems]);

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