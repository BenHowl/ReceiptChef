# Quick Start: Adding Affiliate Links to ReceiptChef

## Top Affiliate Programs for Recipe Apps

### 1. **Amazon Associates** ⭐ BEST TO START
- **Sign up:** https://affiliate-program.amazon.com/
- **Why:** Easiest setup, huge product selection, trusted brand
- **Commission:** 4% for kitchen items
- **Setup time:** 1-3 days for approval

### 2. **ShareASale** (Premium Brands)
- **Sign up:** https://www.shareasale.com/
- **Brands:** Williams-Sonoma, Sur La Table, Crate & Barrel
- **Commission:** 4-8%
- **Better for:** High-end kitchen tools

### 3. **Walmart Affiliate**
- **Sign up:** https://affiliates.walmart.com/
- **Best for:** Groceries and budget items
- **Commission:** 1-4%

## How to Add Your Affiliate IDs

### Step 1: Get Your Amazon Associate ID
1. Sign up at https://affiliate-program.amazon.com/
2. Get your tracking ID (e.g., "receiptchef-20")
3. Add to `.env` file:
```bash
AMAZON_PARTNER_TAG=your-tracking-id-here
```

### Step 2: Add Products to Your App

Edit `/server/services/affiliateService.ts`:

```typescript
// Find this section and add your products:
const amazonProducts = [
  {
    id: 'amz-product-1',
    title: 'Product Name from Amazon',
    description: 'Product description',
    price: '$29.99',
    affiliateLink: this.buildAmazonLink('AMAZON_ASIN_HERE'),
    category: 'kitchen-tool',
    relevance: 'high'
  }
];
```

To find the ASIN:
1. Go to any Amazon product page
2. Look in the URL or product details
3. It's a 10-character code like "B08N5WRWNW"

### Step 3: Test Your Setup

1. Start the app:
```bash
npm run dev
```

2. Upload a receipt or scan your fridge
3. Look for the "Essential kitchen tools" section
4. Click on products - they should open Amazon with your tracking ID

## Where Ads Appear

The app shows affiliate products in 3 strategic places:

1. **After recipes** - Kitchen tools related to cooking
2. **In meal plans** - Meal prep essentials
3. **With ingredients** - Missing items you might need

Users can:
- Hide ads with the settings button (gear icon)
- Control where ads appear
- See clear disclosure about affiliate links

## Expected Earnings

With 1,000 monthly users:
- **20-50 clicks** on affiliate links
- **2-5 purchases** per month
- **$10-50** monthly earnings
- Scales up with more traffic!

## Legal Requirements

✅ **Already included in the app:**
- FTC disclosure on all affiliate sections
- User control over ads
- Clear labeling of affiliate links

## Need Help?

- Full setup guide: See `AFFILIATE_SETUP.md`
- Amazon help: https://affiliate-program.amazon.com/help
- Code issues: Check `/server/services/affiliateService.ts`