# Grocery Receipt App Research - What to Eat Plus Analysis

## Project Overview
This document contains research material for developing a grocery receipt scanning and meal planning application, based on analysis of the "What to Eat Plus" app demo by Lily McCoubrey.

**Source Video:** WhatToEat+ AI Web App Demo – ENTI 333/633 - YouTube  
**Presenter:** Lily McCoubrey  
**Analysis Date:** September 13, 2025

## Executive Summary

What to Eat Plus is an AI-powered web application that addresses food waste and meal planning challenges by converting grocery receipts into actionable data. The app combines receipt scanning, inventory management, recipe suggestions, and spending tracking into a comprehensive food management system.

## Key Features Summary

### Core Functionality
- **Receipt Scanning & Analysis**: Upload receipts (including AI-generated ones for demo), extract items, prices, and totals
- **Inventory Management**: Automatic population from receipts, expiration date tracking, item removal capabilities
- **Recipe Recommendations**: AI-powered suggestions based on inventory, meal type filtering, serving size adjustment
- **Spending Analytics**: Categorized spending reports, food vs. non-food separation, downloadable reports
- **Meal Planning**: Integration of inventory with recipe suggestions to reduce waste

### User Experience Features
- **Allergy Management**: Filter recipes based on user allergies/dietary restrictions
- **"I Feel Lucky"**: Random recipe generator for indecisive users
- **Favorites System**: Save and manage preferred recipes
- **Accessibility Options**: Dark mode, high contrast mode for better visibility
- **Multi-format Reports**: PDF, Excel, CSV export options

## Technical Stack
- **Frontend**: React, TypeScript
- **AI Integration**: Gemini API for recipe generation and analysis
- **Architecture**: Modern web stack with secure API integration

## Feature Analysis

### 1. Receipt Processing
**How it works:**
- Users upload receipt images through dashboard
- AI analyzes and extracts structured data (items, prices, totals)
- Data automatically populates inventory system
- Differentiates between food and household items

**Key Benefits:**
- Eliminates manual entry
- Reduces human error
- Provides spending categorization

### 2. Inventory Management
**Capabilities:**
- Auto-population from receipts
- Manual expiration date entry
- Priority-based recipe suggestions (items expiring soonest)
- Easy item removal system

**Smart Features:**
- Expiration-aware recipe recommendations
- Visual inventory tracking
- Simple add/remove interface

### 3. Recipe Engine
**Filtering Options:**
- Meal type (breakfast, lunch, dinner, dessert, snack)
- Serving size adjustment
- Inventory-based vs. general suggestions
- Allergy exclusions

**User Experience:**
- Random recipe generation ("I Feel Lucky")
- Detailed recipe information (calories, prep time, cook time)
- Favorites management
- Clear nutritional data

### 4. Analytics & Reporting
**Spending Tracking:**
- Total spending vs. food-only spending
- Tax separation
- Category-based analysis (food vs. household)

**Report Generation:**
- Multiple format options (PDF, Excel, CSV)
- Date range selection
- Downloadable reports

### 5. Accessibility & Customization
**Options Available:**
- Dark mode toggle
- High contrast mode
- User preference persistence
- Clean, intuitive interface

## Development Insights

### Architecture Considerations
- Modern React/TypeScript stack suggests scalable, maintainable codebase
- AI integration through established APIs (Gemini)
- Secure API handling for sensitive financial data
- Responsive design principles

### User Flow Design
1. **Entry Point**: Landing page with clear navigation options
2. **Receipt Upload**: Simple drag-and-drop or file selection
3. **Data Review**: User can verify extracted data before adding to inventory
4. **Inventory Management**: Central hub for food tracking
5. **Recipe Discovery**: Multiple pathways to find suitable recipes
6. **Analytics**: Optional deep dive into spending patterns

### Key UX Decisions
- **Progressive Enhancement**: Features build on each other logically
- **Flexibility**: Multiple ways to discover recipes (filtered, random, favorites)
- **Accessibility First**: High contrast and dark mode options
- **Data Transparency**: Users can see and modify all extracted data

## Potential Improvements & Extensions

### Additional Features to Consider
- **Meal Calendar**: Weekly/monthly meal planning interface
- **Shopping List Generation**: Based on planned meals and current inventory
- **Nutrition Tracking**: Comprehensive nutritional analysis
- **Family Sharing**: Multi-user household management
- **Smart Notifications**: Expiration alerts, recipe suggestions
- **Integration Options**: Calendar apps, grocery store APIs
- **Barcode Scanning**: Direct product entry without receipts
- **Recipe Scaling**: Automatic ingredient adjustment for different serving sizes

### Technical Enhancements
- **Offline Functionality**: Basic features without internet connection
- **Mobile App**: Native iOS/Android versions
- **Voice Integration**: "What can I cook?" voice commands
- **Machine Learning**: Personalized recipe recommendations based on usage patterns
- **API Integrations**: Grocery store prices, nutritional databases

## Full Video Transcript

Hi everyone, my name is Lily and I'm going to be walking through my group's web app that we made in our NT33 class. So, welcome to What to Eat Plus, an AI powered web application designed to reduce food waste, simplify meal planning, and bring structure to the way we manage groceries. So, my group noticed a common issue. People often forgot what they've bought, don't know what to cook with what they have, or end up wasting food. What to eat plus solves this by turning grocery receipts into useful data that powers your fridge, spending reports, and meal plans. 

So, initially when you open the app, you get taken to this landing page that gives the option to go to the dashboard, scan a receipt, view scanned receipts, track inventory, or find recipes. So, we're going to go to our dashboard and it takes us here. You get this option right now to upload your receipt. So, we're going to hit those buttons and for the sake of the demonstration, we'll be uploading a AI generated receipt. So now we click analyze image and this is going to pull all the data out. Perfect. So we get steak, potatoes with prices, etc. total of 3877. So we're going to click add to inventory and we're going to go into our inventory. And we can see that all populated up here. 

So, users have the option to click this to add expiration dates at your leisure, which allows the program to generate recipes, recipe suggestions based off of what food is it going to be expiring the soonest. You can also click this red trash can to remove anything from your inventory that you might not want there or used up. All right, so we can go into recipes and you can see here you can toggle between different meal types. Breakfast, lunch, dinner, dessert, snack. We're just going to leave it on all meal types for now. You can change serving size and you can also toggle on and off this use my inventory items. So when it's off, that just allows you to get different suggestions than what you might have in your inventory. So for the sake of the demonstration, we will keep it on. 

Okay, there we go. So here you can also users have the option to add in allergies. So let's say we want to add in chicken. Add chicken. It takes out the chicken recipes that populated in the bottom. So, we'll remove it and the chicken comes back. We also put in this option to click I feel lucky, which generates a random recipe if you're not sure what to cook or feeling a little bit confused. So, there it is. We can also add this to our favorites. And you can see it pops up here into our favorites. It provides calorie calorie information, prep time, cook time, and serving size. 

So, also when we go into our receipts, this app gives you the option to track spending. So, let's go to this receipt that we just recently added in of a total of $38.77. So, once we click on this particular receipt, we can go back to dashboard and it sticks them into these boxes here. It gives you your total spent and it gives you the price you spent on food. So, the difference between those two would just be the food section removes the tax. So with this what Plus can also generate you a chart based off of your spending or report gives you the option to choose the months that you want in the report and report format can be PDF, Excel or CSV and then it will just populate down here in this bottom right corner and you can download your report. 

So let's go back into our receipts and pick a different one with some household items on it. So let's click this one, view details. So here you can see this has a bunch of household items on it. Now that we clicked on it, we can go to dashboard and it switches them out here. So household items were a total of $15 and total spent was $1575. So we also added in some settings for the user. You can go to settings and you can toggle between dark mode, whichever is your preference. We also added a high contrast option to be more accessible to allow better visibility. So that just highlights everything on the outside to make it easier to see. 

And then in your favorites, you can see that populates in there when you click it. You can also remove it and then it's gone. So, what to eat plus is built on a modern stack using React, TypeScript, and a couple other different programs that allow it to securely integrate with Gemini and certain APIs to populate the recipes that it so easily pulls from the internet. What Plus is more than just a receipt scanner. It's a complete AI powered food management tool that helps us to plan smarter, waste less, and cook with confidence. Thank you for joining me and thank you for watching.

## Next Steps for Development

### Phase 1: Core Functionality
1. Set up React/TypeScript project structure
2. Implement basic receipt upload and display
3. Create simple inventory management system
4. Integrate OCR/AI for receipt text extraction

### Phase 2: Recipe Integration
1. Research and integrate recipe APIs
2. Implement basic recipe search and filtering
3. Create inventory-based recipe matching
4. Add favorites system

### Phase 3: Analytics & Enhancement
1. Implement spending tracking and categorization
2. Add report generation capabilities
3. Create user preference system
4. Implement accessibility features

### Phase 4: Polish & Advanced Features
1. Add expiration tracking and notifications
2. Implement advanced filtering (allergies, dietary restrictions)
3. Create meal planning calendar
4. Add data export/import capabilities

## Resources for Implementation

### Potential APIs & Services
- **OCR Services**: Google Cloud Vision, Amazon Textract, Azure Computer Vision
- **Recipe APIs**: Spoonacular, Edamam, TheMealDB
- **AI Services**: OpenAI GPT, Google Gemini, Anthropic Claude
- **Chart/Report Libraries**: Chart.js, D3.js, React-PDF

### Design Considerations
- Mobile-first responsive design
- Clear information hierarchy
- Intuitive navigation patterns
- Fast loading and smooth interactions
- Comprehensive error handling
- Data privacy and security measures

---

*This research document is intended to guide the development of a grocery receipt scanning and meal planning application. Use it as a reference for feature planning, technical decisions, and user experience design.*