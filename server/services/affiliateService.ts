import type { AffiliateProduct } from '../../client/src/components/AffiliateCard';

interface AffiliateConfig {
  amazonAssociateId?: string;
  amazonAccessKey?: string;
  amazonSecretKey?: string;
  amazonPartnerTag?: string;

  walmartAffiliateId?: string;

  targetAffiliateId?: string;

  shareASaleId?: string;
  shareASaleToken?: string;

  impactRadiusAccountSid?: string;
  impactRadiusAuthToken?: string;

  cjAffiliateId?: string;
  cjDeveloperId?: string;
}

export class AffiliateService {
  private config: AffiliateConfig;

  constructor() {
    this.config = {
      // Amazon Associates
      amazonAssociateId: process.env.AMAZON_ASSOCIATE_ID,
      amazonAccessKey: process.env.AMAZON_ACCESS_KEY,
      amazonSecretKey: process.env.AMAZON_SECRET_KEY,
      amazonPartnerTag: process.env.AMAZON_PARTNER_TAG || 'receiptchef-20',

      // Walmart Affiliate Program
      walmartAffiliateId: process.env.WALMART_AFFILIATE_ID,

      // Target Affiliates (via Impact Radius)
      targetAffiliateId: process.env.TARGET_AFFILIATE_ID,

      // ShareASale (Williams-Sonoma, Sur La Table, etc.)
      shareASaleId: process.env.SHAREASALE_AFFILIATE_ID,
      shareASaleToken: process.env.SHAREASALE_TOKEN,

      // Impact Radius (multiple brands)
      impactRadiusAccountSid: process.env.IMPACT_RADIUS_ACCOUNT_SID,
      impactRadiusAuthToken: process.env.IMPACT_RADIUS_AUTH_TOKEN,

      // CJ Affiliate (formerly Commission Junction)
      cjAffiliateId: process.env.CJ_AFFILIATE_ID,
      cjDeveloperId: process.env.CJ_DEVELOPER_ID,
    };
  }

  /**
   * Build Amazon affiliate link
   */
  private buildAmazonLink(asin: string): string {
    return `https://www.amazon.com/dp/${asin}?tag=${this.config.amazonPartnerTag}`;
  }

  /**
   * Build Walmart affiliate link
   */
  private buildWalmartLink(productId: string): string {
    if (!this.config.walmartAffiliateId) return '';
    return `https://goto.walmart.com/c/${this.config.walmartAffiliateId}/product/${productId}`;
  }

  /**
   * Build ShareASale affiliate link
   */
  private buildShareASaleLink(merchantId: string, productUrl: string): string {
    if (!this.config.shareASaleId) return productUrl;
    return `https://shareasale.com/r.cfm?b=${merchantId}&u=${this.config.shareASaleId}&m=${merchantId}&urllink=${encodeURIComponent(productUrl)}`;
  }

  /**
   * Get kitchen tool recommendations
   */
  async getKitchenTools(category?: string): Promise<AffiliateProduct[]> {
    const products: AffiliateProduct[] = [];

    // Amazon Products
    if (this.config.amazonPartnerTag) {
      const amazonProducts = [
        {
          id: 'amz-knife-set',
          title: 'Cuisinart 15-Piece Knife Set',
          description: 'Professional-grade stainless steel knives with block',
          price: '$79.99',
          originalPrice: '$159.99',
          discount: '50% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/81cV-pZPTCL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B00GIBKC3K'),
          category: 'kitchen-tool' as const,
          relevance: 'high' as const,
        },
        {
          id: 'amz-instant-pot',
          title: 'Instant Pot Duo 7-in-1',
          description: 'Electric pressure cooker, slow cooker, rice cooker & more',
          price: '$89.95',
          originalPrice: '$119.99',
          discount: '25% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/71V1LrY1MSL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B06Y1YD5W7'),
          category: 'appliance' as const,
          relevance: 'high' as const,
        },
        {
          id: 'amz-mixing-bowls',
          title: 'Stainless Steel Mixing Bowl Set',
          description: 'Set of 6 nesting bowls with lids',
          price: '$29.99',
          imageUrl: 'https://m.media-amazon.com/images/I/71Uu52vLXSL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B01HTYH8YA'),
          category: 'kitchen-tool' as const,
          relevance: 'medium' as const,
        },
      ];
      products.push(...amazonProducts);
    }

    // Williams-Sonoma via ShareASale
    if (this.config.shareASaleId) {
      const williamsSonomaProducts = [
        {
          id: 'ws-mixer',
          title: 'KitchenAid Artisan Stand Mixer',
          description: 'Professional 5-qt mixer in various colors',
          price: '$449.95',
          originalPrice: '$549.95',
          discount: 'Save $100',
          imageUrl: 'https://assets.wsimgs.com/wsimgs/ab/images/dp/wcm/202349/0061/img38c.jpg',
          affiliateLink: this.buildShareASaleLink('31717', 'https://www.williams-sonoma.com/products/kitchenaid-artisan-stand-mixer'),
          category: 'appliance' as const,
          relevance: 'high' as const,
        },
      ];
      products.push(...williamsSonomaProducts);
    }

    return products;
  }

  /**
   * Get ingredient/grocery recommendations
   */
  async getIngredientProducts(ingredients: string[]): Promise<AffiliateProduct[]> {
    const products: AffiliateProduct[] = [];

    // Walmart Grocery
    if (this.config.walmartAffiliateId) {
      const walmartProducts = [
        {
          id: 'wm-olive-oil',
          title: 'Extra Virgin Olive Oil',
          description: 'Premium cold-pressed olive oil, 1 liter',
          price: '$12.98',
          imageUrl: 'https://i5.walmartimages.com/asr/placeholder.jpg',
          affiliateLink: this.buildWalmartLink('123456789'),
          category: 'ingredient' as const,
          relevance: 'high' as const,
        },
      ];
      products.push(...walmartProducts);
    }

    // Amazon Pantry items
    if (this.config.amazonPartnerTag) {
      const pantryProducts = [
        {
          id: 'amz-spice-set',
          title: 'McCormick Gourmet Spice Set',
          description: '12 essential spices for cooking',
          price: '$39.99',
          imageUrl: 'https://m.media-amazon.com/images/I/91gO5PwGYJL._AC_SY200_.jpg',
          affiliateLink: this.buildAmazonLink('B07BNQSFB7'),
          category: 'ingredient' as const,
          relevance: 'medium' as const,
        },
      ];
      products.push(...pantryProducts);
    }

    return products;
  }

  /**
   * Get cookbook recommendations
   */
  async getCookbooks(recipeType?: string): Promise<AffiliateProduct[]> {
    const products: AffiliateProduct[] = [];

    if (this.config.amazonPartnerTag) {
      const cookbooks = [
        {
          id: 'amz-cookbook-1',
          title: 'Salt, Fat, Acid, Heat',
          description: 'Master the elements of good cooking',
          price: '$19.99',
          originalPrice: '$35.00',
          discount: '43% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/91wY-IcZPgL._AC_SY200_.jpg',
          affiliateLink: this.buildAmazonLink('B01HMXV0UQ'),
          category: 'cookbook' as const,
          relevance: 'high' as const,
        },
        {
          id: 'amz-cookbook-2',
          title: 'The Complete America\'s Test Kitchen',
          description: '20 years of foolproof recipes',
          price: '$24.99',
          originalPrice: '$40.00',
          discount: '38% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/91kM+6NnXeL._AC_SY200_.jpg',
          affiliateLink: this.buildAmazonLink('B07BFPNLP7'),
          category: 'cookbook' as const,
          relevance: 'high' as const,
        },
      ];
      products.push(...cookbooks);
    }

    return products;
  }

  /**
   * Get dynamic product recommendations based on recipe analysis
   */
  private analyzeRecipeNeeds(recipes: any[]): string[] {
    const needs: string[] = [];

    for (const recipe of recipes) {
      // Analyze cooking methods
      const instructions = recipe.instructions?.join(' ').toLowerCase() || '';
      const title = recipe.title?.toLowerCase() || '';
      const description = recipe.description?.toLowerCase() || '';
      const allText = `${title} ${description} ${instructions}`;

      // Detect cooking methods and suggest tools
      if (allText.includes('bake') || allText.includes('oven')) needs.push('baking-tools');
      if (allText.includes('grill') || allText.includes('grilled')) needs.push('grilling-tools');
      if (allText.includes('fry') || allText.includes('sauté')) needs.push('frying-tools');
      if (allText.includes('blend') || allText.includes('smoothie')) needs.push('blender');
      if (allText.includes('mix') || allText.includes('whisk')) needs.push('mixing-tools');
      if (allText.includes('cut') || allText.includes('chop') || allText.includes('slice')) needs.push('knives');
      if (allText.includes('pressure cook') || allText.includes('instant pot')) needs.push('pressure-cooker');
      if (allText.includes('air fry') || allText.includes('crispy')) needs.push('air-fryer');
      if (allText.includes('slow cook') || allText.includes('simmer')) needs.push('slow-cooker');

      // Detect ingredient-specific needs
      if (allText.includes('spice') || allText.includes('season')) needs.push('spices');
      if (allText.includes('oil') || allText.includes('olive')) needs.push('cooking-oil');
      if (allText.includes('pasta') || allText.includes('noodle')) needs.push('pasta-tools');

      // Detect by meal complexity
      if (recipe.difficulty === 'hard' || recipe.cookingTime > 60) needs.push('advanced-tools');
      if (recipe.servings > 6) needs.push('large-cookware');
    }

    return Array.from(new Set(needs)); // Remove duplicates
  }

  /**
   * Get products based on analyzed recipe needs
   */
  private getProductsByNeeds(needs: string[]): AffiliateProduct[] {
    const productMap: Record<string, AffiliateProduct[]> = {
      'knives': [
        {
          id: 'amz-knife-set',
          title: 'Cuisinart 15-Piece Knife Set',
          description: 'Professional-grade stainless steel knives with block',
          price: '$79.99',
          originalPrice: '$159.99',
          discount: '50% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/81cV-pZPTCL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B00GIBKC3K'),
          category: 'kitchen-tool',
          relevance: 'high'
        }
      ],
      'pressure-cooker': [
        {
          id: 'amz-instant-pot',
          title: 'Instant Pot Duo 7-in-1',
          description: 'Perfect for the pressure cooking mentioned in your recipes',
          price: '$89.95',
          originalPrice: '$119.99',
          discount: '25% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/71V1LrY1MSL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B06Y1YD5W7'),
          category: 'appliance',
          relevance: 'high'
        }
      ],
      'air-fryer': [
        {
          id: 'amz-air-fryer',
          title: 'COSORI Air Fryer',
          description: 'Perfect for crispy recipes without excess oil',
          price: '$99.99',
          originalPrice: '$129.99',
          discount: '23% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/71qBMnFrdTL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B07FDJMC9Q'),
          category: 'appliance',
          relevance: 'high'
        }
      ],
      'mixing-tools': [
        {
          id: 'amz-mixing-bowls',
          title: 'Stainless Steel Mixing Bowl Set',
          description: 'Essential for the mixing and whisking in your recipes',
          price: '$29.99',
          originalPrice: '$49.99',
          discount: '40% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/71Uu52vLXSL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B01HTYH8YA'),
          category: 'kitchen-tool',
          relevance: 'high'
        }
      ],
      'baking-tools': [
        {
          id: 'amz-baking-set',
          title: 'Complete Baking Set',
          description: 'Everything needed for the baking recipes you\'re making',
          price: '$45.99',
          originalPrice: '$65.99',
          discount: '30% OFF',
          imageUrl: 'https://m.media-amazon.com/images/I/81dBwXNGgUL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B08XYZ123'),
          category: 'kitchen-tool',
          relevance: 'high'
        }
      ],
      'spices': [
        {
          id: 'amz-spice-set',
          title: 'McCormick Gourmet Spice Set',
          description: 'Complete your spice collection for these recipes',
          price: '$39.99',
          imageUrl: 'https://m.media-amazon.com/images/I/91gO5PwGYJL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B07BNQSFB7'),
          category: 'ingredient',
          relevance: 'medium'
        }
      ],
      'cooking-oil': [
        {
          id: 'amz-olive-oil',
          title: 'Premium Extra Virgin Olive Oil',
          description: 'High-quality oil for your cooking',
          price: '$24.99',
          imageUrl: 'https://m.media-amazon.com/images/I/71tFmSvCOtL._AC_SL160_.jpg',
          affiliateLink: this.buildAmazonLink('B07T8R5XYZ'),
          category: 'ingredient',
          relevance: 'medium'
        }
      ]
    };

    const recommendedProducts: AffiliateProduct[] = [];
    for (const need of needs) {
      if (productMap[need]) {
        recommendedProducts.push(...productMap[need]);
      }
    }

    return recommendedProducts;
  }

  /**
   * Main method to get affiliate products based on context
   */
  async getProducts(
    context: 'recipe' | 'ingredients' | 'meal-plan' | 'general',
    options?: {
      recipeType?: string;
      ingredients?: string[];
      recipes?: any[];
      maxItems?: number;
    }
  ): Promise<AffiliateProduct[]> {
    let products: AffiliateProduct[] = [];

    switch (context) {
      case 'recipe':
        if (options?.recipes && options.recipes.length > 0) {
          // Dynamic analysis based on actual recipes
          const analyzedNeeds = this.analyzeRecipeNeeds(options.recipes);
          const dynamicProducts = this.getProductsByNeeds(analyzedNeeds);

          if (dynamicProducts.length > 0) {
            products = dynamicProducts;
          } else {
            // Fallback to general tools and cookbooks
            const tools = await this.getKitchenTools();
            const cookbooks = await this.getCookbooks(options?.recipeType);
            products = [...tools, ...cookbooks];
          }
        } else {
          // No recipes provided, use general recommendations
          const tools = await this.getKitchenTools();
          const cookbooks = await this.getCookbooks(options?.recipeType);
          products = [...tools, ...cookbooks];
        }
        break;

      case 'ingredients':
        if (options?.ingredients) {
          const ingredientProducts = await this.getIngredientProducts(options.ingredients);
          const basicTools = await this.getKitchenTools();
          products = [...ingredientProducts, ...basicTools.slice(0, 2)];
        }
        break;

      case 'meal-plan':
        const appliances = await this.getKitchenTools('appliance');
        const mealPrepCookbooks = await this.getCookbooks('meal-prep');
        products = [...appliances, ...mealPrepCookbooks];
        break;

      case 'general':
      default:
        const generalTools = await this.getKitchenTools();
        const generalCookbooks = await this.getCookbooks();
        products = [...generalTools.slice(0, 3), ...generalCookbooks.slice(0, 2)];
        break;
    }

    // Sort by relevance
    products.sort((a, b) => {
      const relevanceOrder = { high: 3, medium: 2, low: 1 };
      return relevanceOrder[b.relevance || 'low'] - relevanceOrder[a.relevance || 'low'];
    });

    // Limit results
    const maxItems = options?.maxItems || 5;
    return products.slice(0, maxItems);
  }

  /**
   * Track affiliate clicks for analytics
   */
  async trackClick(productId: string, context: string): Promise<void> {
    // Log click for analytics
    console.log(`Affiliate click: ${productId} in ${context} context`);

    // In production, you would:
    // 1. Store in database for reporting
    // 2. Send to analytics service
    // 3. Update user engagement metrics
  }
}

export const affiliateService = new AffiliateService();