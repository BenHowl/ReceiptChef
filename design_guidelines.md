# Recipe Generator Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern food and productivity apps like Notion (for clean data organization) and Whisk/Yummly (for recipe presentation). This utility-focused application prioritizes efficiency and clarity while maintaining visual appeal through food-focused imagery.

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 46 69% 42% (Forest green - representing fresh ingredients)
- Secondary: 35 25% 25% (Warm charcoal for text)
- Background: 0 0% 98% (Off-white)
- Accent: 25 85% 60% (Warm orange for CTAs)

**Dark Mode:**
- Primary: 46 45% 65% (Lighter forest green)
- Secondary: 0 0% 85% (Light gray text)
- Background: 220 13% 12% (Deep navy-black)
- Accent: 25 70% 55% (Muted orange)

### Typography
- **Primary:** Inter (Google Fonts) - clean, readable for ingredient lists
- **Headers:** Inter Bold/Semi-bold for section titles
- **Body:** Inter Regular for recipes and instructions

### Layout System
**Tailwind Spacing:** Consistent use of 4, 6, 8, and 12 units (p-4, m-6, h-8, gap-12) for clean, predictable spacing throughout the interface.

### Component Library

**Navigation:**
- Clean top navigation with logo and minimal menu items
- Subtle shadows and rounded corners (rounded-lg)

**Receipt Upload Zone:**
- Large, prominent drag-and-drop area with dashed border
- Camera icon and clear upload instructions
- Visual feedback on hover/drag states

**Ingredient Cards:**
- Grid layout with ingredient images (when available)
- Quantity and expiration indicators
- Clean card design with subtle shadows

**Recipe Display:**
- Card-based layout for generated recipes
- Cooking time, difficulty, and servings prominently displayed
- Expandable recipe instructions

**Meal Plan Calendar:**
- Weekly grid view with assigned recipes
- Color-coded meal types (breakfast, lunch, dinner)
- Drag-and-drop functionality for rearranging

### Images
**Hero Section:** Medium-sized hero (not full viewport) featuring a beautifully arranged flat-lay of fresh ingredients and a grocery receipt, positioned above the upload zone to immediately communicate the app's purpose.

**Recipe Cards:** High-quality food photography thumbnails for each generated recipe, sourced from recipe APIs or placeholder food images.

**Empty States:** Friendly illustrations showing the receipt-to-meal transformation process.

### Key Interactions
- Smooth transitions between upload, processing, and results states
- Progress indicators during AI processing
- Hover states on recipe cards revealing quick actions
- Minimal, purposeful animations focused on state changes

### Mobile Considerations
- Touch-friendly upload zone sizing
- Stacked card layouts for mobile viewing
- Collapsible navigation for smaller screens
- Optimized image sizes for faster loading

This design balances the utility-focused nature of receipt processing with the inspirational aspects of meal planning, creating an efficient yet engaging experience for users transforming their grocery purchases into actionable meal plans.