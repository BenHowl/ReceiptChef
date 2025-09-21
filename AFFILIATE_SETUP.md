# Affiliate Program Setup Guide for ReceiptChef

This guide explains how to set up and integrate various affiliate programs into your ReceiptChef app.

## Overview

The app supports multiple affiliate programs to monetize recipe and cooking-related product recommendations. The integration is designed to be non-obtrusive while providing value to users.

## Supported Affiliate Programs

### 1. **Amazon Associates** (Recommended)
- **Best for:** Kitchen tools, appliances, cookbooks, pantry items
- **Commission:** 1-10% (4% for kitchen & dining)
- **Cookie Duration:** 24 hours
- **Payment Threshold:** $10
- **Sign up:** https://affiliate-program.amazon.com/

### 2. **Walmart Affiliate Program**
- **Best for:** Groceries, budget kitchen items
- **Commission:** 1-4%
- **Cookie Duration:** 3 days
- **Payment Threshold:** $50
- **Sign up:** https://affiliates.walmart.com/

### 3. **ShareASale** (Multiple Brands)
- **Best for:** Williams-Sonoma, Sur La Table, Crate & Barrel
- **Commission:** 4-8%
- **Cookie Duration:** 30-45 days
- **Payment Threshold:** $50
- **Sign up:** https://www.shareasale.com/

### 4. **Target Affiliates (via Impact)**
- **Best for:** Kitchen items, home goods
- **Commission:** 1-8%
- **Cookie Duration:** 7 days
- **Payment Threshold:** $50
- **Sign up:** https://partners.target.com/

### 5. **CJ Affiliate** (Commission Junction)
- **Best for:** Premium brands (KitchenAid, Cuisinart, etc.)
- **Commission:** 3-10%
- **Cookie Duration:** Varies by merchant
- **Payment Threshold:** $50
- **Sign up:** https://www.cj.com/

### 6. **Rakuten Advertising**
- **Best for:** Blue Apron, HelloFresh, meal kit services
- **Commission:** $15-35 per signup
- **Cookie Duration:** 7-30 days
- **Payment Threshold:** $50
- **Sign up:** https://rakutenadvertising.com/

## Setup Instructions

### Step 1: Sign Up for Programs

1. **Amazon Associates**
   - Go to https://affiliate-program.amazon.com/
   - Click "Sign up"
   - Fill in website details (use your deployed ReceiptChef URL)
   - Wait for approval (usually 1-3 days)
   - Get your tracking ID (e.g., "receiptchef-20")

2. **Walmart Affiliate**
   - Apply at https://affiliates.walmart.com/
   - Powered by Impact Radius
   - Provide website details and traffic information
   - Wait for approval (2-5 days)

3. **ShareASale**
   - Sign up at https://www.shareasale.com/
   - Apply to individual merchants after approval
   - Recommended merchants:
     - Williams-Sonoma (ID: 31717)
     - Sur La Table (ID: 47493)
     - The Container Store (ID: 15506)

### Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
# Amazon Associates
AMAZON_ASSOCIATE_ID=your-associate-id
AMAZON_PARTNER_TAG=receiptchef-20
AMAZON_ACCESS_KEY=your-access-key  # For Product API (optional)
AMAZON_SECRET_KEY=your-secret-key  # For Product API (optional)

# Walmart
WALMART_AFFILIATE_ID=your-publisher-id

# Target (via Impact)
TARGET_AFFILIATE_ID=your-impact-id

# ShareASale
SHAREASALE_AFFILIATE_ID=your-affiliate-id
SHAREASALE_TOKEN=your-api-token  # For API access (optional)

# Impact Radius (for multiple programs)
IMPACT_RADIUS_ACCOUNT_SID=your-account-sid
IMPACT_RADIUS_AUTH_TOKEN=your-auth-token

# CJ Affiliate
CJ_AFFILIATE_ID=your-publisher-id
CJ_DEVELOPER_ID=your-developer-id
```

### Step 3: Update Product Database

The affiliate service (`server/services/affiliateService.ts`) contains sample products. To use real products:

1. **Manual Method** (Recommended for starting):
   - Find products on affiliate sites
   - Copy product IDs/ASINs
   - Update the product arrays in `affiliateService.ts`

2. **API Method** (For automation):
   - Amazon Product Advertising API
   - Walmart Open API
   - ShareASale Product API
   - Requires additional API credentials

### Step 4: Customize Product Recommendations

Edit `server/services/affiliateService.ts` to add your products:

```typescript
// Example: Add a new Amazon product
const amazonProducts = [
  {
    id: 'amz-your-product',
    title: 'Product Name',
    description: 'Product description',
    price: '$99.99',
    originalPrice: '$149.99',
    discount: '33% OFF',
    imageUrl: 'https://image-url',
    affiliateLink: this.buildAmazonLink('ASIN_HERE'),
    category: 'kitchen-tool',
    relevance: 'high',
  },
];
```

### Step 5: Test Your Integration

1. **Check environment variables are loaded:**
   ```bash
   npm run dev
   ```
   Check console for any configuration errors

2. **Test API endpoint:**
   ```bash
   curl http://localhost:5000/api/affiliate/products?context=recipe
   ```

3. **Verify tracking:**
   - Click on affiliate links in your app
   - Check affiliate dashboards for click tracking

## Best Practices

### Content Guidelines

1. **Disclosure Requirements (FTC):**
   - Always include affiliate disclosure
   - Make it clear and conspicuous
   - Already implemented in `AffiliateRecommendations.tsx`

2. **Product Selection:**
   - Only recommend products relevant to recipes/cooking
   - Focus on quality over quantity
   - Update seasonal products regularly

3. **Link Placement:**
   - Don't overwhelm users with ads
   - Keep recommendations contextual
   - Allow users to hide ads (already implemented)

### Optimization Tips

1. **Track Performance:**
   - Monitor click-through rates
   - A/B test product placements
   - Track which contexts perform best

2. **Seasonal Updates:**
   - Holiday cooking items (November-December)
   - Grilling tools (May-August)
   - Baking supplies (September-December)

3. **User Experience:**
   - Load products asynchronously
   - Cache product data
   - Respect user preferences

## Monetization Strategy

### Recommended Approach

1. **Start with Amazon Associates**
   - Easiest to set up
   - Widest product selection
   - Good conversion rates

2. **Add ShareASale for Premium Brands**
   - Higher commissions
   - Longer cookie duration
   - Premium kitchen brands

3. **Include Walmart for Groceries**
   - Good for ingredient recommendations
   - Appeals to budget-conscious users

### Expected Revenue

Based on typical conversion rates:
- **Traffic:** 10,000 monthly users
- **Click Rate:** 2-5% click on affiliate links
- **Conversion:** 5-10% of clicks convert
- **Average Order:** $50-100
- **Commission:** 4% average
- **Monthly Revenue:** $40-200

Scale with traffic growth and optimization.

## Troubleshooting

### Common Issues

1. **Links not tracking:**
   - Verify tracking tags in URLs
   - Check cookie settings
   - Test in incognito mode

2. **Products not showing:**
   - Check environment variables
   - Verify API credentials
   - Check console for errors

3. **Low conversion:**
   - Improve product relevance
   - Test different placements
   - Update product descriptions

## Compliance

### Legal Requirements

1. **FTC Disclosure:**
   - Must disclose affiliate relationships
   - Already implemented in components

2. **Privacy Policy:**
   - Update to mention affiliate tracking
   - Explain data usage

3. **Terms of Service:**
   - Include affiliate disclaimer
   - Clarify third-party links

### Platform Rules

1. **Amazon Associates:**
   - No link cloaking
   - No misleading claims
   - Proper disclosure required

2. **ShareASale:**
   - Follow merchant-specific rules
   - No trademark bidding
   - Honest product descriptions

## API Integration (Advanced)

To fetch products dynamically via APIs:

### Amazon Product Advertising API

```typescript
// Install: npm install @aws-sdk/client-product-advertising
import { ProductAdvertisingClient } from '@aws-sdk/client-product-advertising';

const client = new ProductAdvertisingClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AMAZON_ACCESS_KEY,
    secretAccessKey: process.env.AMAZON_SECRET_KEY,
  },
});
```

### Walmart Open API

```typescript
// Install: npm install axios
import axios from 'axios';

const walmartAPI = axios.create({
  baseURL: 'https://developer.api.walmart.com/api-proxy/service',
  headers: {
    'WM_SEC.ACCESS_TOKEN': process.env.WALMART_API_KEY,
    'WM_QOS.CORRELATION_ID': Date.now().toString(),
  },
});
```

## Support

For questions about specific affiliate programs:
- Amazon: https://affiliate-program.amazon.com/help
- Walmart: https://affiliates.walmart.com/help
- ShareASale: https://support.shareasale.com/
- CJ Affiliate: https://support.cj.com/

For ReceiptChef integration issues:
- Check the console for error messages
- Review the affiliate service logs
- Test with sample products first