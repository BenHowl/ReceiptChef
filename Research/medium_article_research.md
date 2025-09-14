# Medium Article Research

## Source Article
**Title:** "What to Eat: Using AI to Turn Grocery Receipts into Recipes"
**Author:** Caitlin Heggerud
**URL:** https://medium.com/@caitlinheggerud/whatto-eat-using-ai-to-turn-grocery-receipts-into-recipes-0d259deeb9d0

## Access Status
- ✅ Article accessed and analyzed from PDF

## Key Insights from WhatToEat+ Project

### Problem Analysis
- **Decision fatigue**: People spend 2.5+ hours/week deciding what to eat
- **35,000 daily decisions** contribute to mental drain and poor food choices
- **Key pain points**: Time constraints, budget limitations, information overload, food allergies (33M Americans affected)
- **Cycle of unhealthy habits**: Stress → fast food → poor nutrition → decision fatigue

### Technical Architecture
- **OCR + AI Pipeline**: Used optical character recognition to extract receipt text, then Gemini Flash to process and clean data
- **Retrieval-Augmented Generation (RAG)**: Combined real receipt data with AI generative capabilities
- **Modular approach**: Avoided fine-tuning, used prompt engineering instead
- **Tech stack**: HTML/CSS/JavaScript frontend, built on Replit with AI agents

## Alternative Research Approaches

### Similar Applications to Study
- **Yuka** - Food scanning and analysis
- **Whisk** - Recipe discovery and meal planning
- **BigOven** - Recipe management with ingredient tracking
- **Mealime** - Meal planning based on ingredients

### Key Areas to Research Further
1. **OCR and Receipt Processing**
   - Best practices for receipt text extraction
   - Handling different receipt formats
   - Dealing with receipt image quality issues

2. **AI Prompt Engineering**
   - Optimizing ingredient extraction accuracy
   - Recipe generation that considers dietary restrictions
   - Meal planning algorithms

3. **User Experience Patterns**
   - Receipt upload workflows
   - Mobile camera integration
   - Recipe browsing and selection interfaces

4. **Data Management**
   - Ingredient categorization systems
   - Recipe storage and retrieval
   - User preference tracking

### Key Features Implemented in WhatToEat+
- **Receipt scanning**: Photo upload → OCR → ingredient extraction → digital inventory
- **Smart filtering**: Allergen filtering (dairy, gluten, nuts), meal type filtering
- **Serving size adjustment**: Scale recipes for different household sizes
- **Manual expiry tracking**: Users can input expiration dates
- **Recipe favorites**: Save preferred recipes for easy access
- **Budget tracking**: Analyze spending patterns from receipt data
- **"Feeling Lucky"**: Random recipe generator for variety
- **Grocery spending insights**: Cost analysis and budget management

### Prompt Engineering Lessons
- **Specificity wins**: Clear, task-based prompts work better than complex requests
- **Constraint setting**: Include "don't change X" instructions to prevent unwanted modifications
- **Visual context**: Use screenshots to clarify problems and debug issues
- **Iterative approach**: Use ChatGPT to help write better prompts for coding tools
- **Structured requests**: Layer prompts with clear context and examples

### Development Challenges & Solutions
- **OCR accuracy**: Works well with structured receipts, struggles with real-world variety
- **Expiry date limitation**: Most groceries don't print expiry dates on receipts
- **Pivot strategy**: Started with fridge photo scanning, pivoted to receipt scanning for reliability
- **API integration**: Required incremental testing and careful documentation reading

## Recommendations for ReceiptChef

### Immediate Improvements
1. **Enhanced OCR pipeline**: Implement similar OCR → AI processing workflow
2. **Better allergen support**: Add comprehensive allergen filtering system
3. **Budget tracking**: Analyze spending patterns from receipts
4. **Recipe randomization**: Add "surprise me" feature for meal variety
5. **Serving adjustment**: Allow users to scale recipes up/down

### Advanced Features to Consider
1. **E-receipt integration**: Auto-process emailed receipts
2. **Pre-shopping recommendations**: Generate shopping lists before store visits
3. **Nutritional analysis**: Track nutritional content of meal plans
4. **Waste reduction focus**: Prioritize recipes using items near expiry
5. **Smart grocery lists**: Generate intelligent shopping suggestions

### UI/UX Insights from Screenshots

**Landing Page Design:**
- **Clean three-step process**: "Scan Receipts" → "Track Inventory" → "Find Recipes"
- **Green accent color**: Consistent with food/freshness theme (similar to your forest green)
- **Clear value proposition**: "Transform your grocery receipts into delicious meals"
- **Simple CTA buttons**: "Get Started Now" and "Take a Receipt" options

**Recipe Interface:**
- **Filter sidebar**: Easy access to dietary restrictions and meal type filters
- **Recipe cards with images**: Visual recipe thumbnails with key stats
- **Quick stats display**: Prep time, cook time, servings clearly shown
- **"I Feel Lucky" button**: Prominent random recipe generator
- **"Use my inventory items" toggle**: Smart ingredient-based filtering

**Key UX Patterns:**
- **Progressive disclosure**: Don't overwhelm users with all options at once
- **Visual recipe browsing**: Large food images make recipes more appealing
- **Quick filtering**: Easy-to-use sidebar filters for common dietary needs
- **Status indicators**: Clear visual feedback on cooking time/difficulty

### Technical Architecture Insights
- **Prompt engineering over fine-tuning**: More cost-effective for smaller applications
- **Human-in-the-loop approach**: Keep users in control, avoid autonomous decisions
- **Modular design**: Build features incrementally and test often
- **Clear value proposition**: Ensure app provides unique value beyond direct AI chat

### Design Recommendations for ReceiptChef
1. **Simplify onboarding**: Use clear 3-step process like WhatToEat+
2. **Prominent filtering**: Make dietary restrictions easily accessible
3. **Visual recipe cards**: Use food images to make recipes more appealing
4. **Quick stats**: Show prep time, cook time, servings at a glance
5. **Smart toggles**: "Use available ingredients" filtering option
6. **Random generator**: Add playful "Surprise Me" feature for variety