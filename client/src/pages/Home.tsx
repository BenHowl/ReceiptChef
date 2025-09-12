import { useState } from 'react';
import { ChefHat, Upload, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReceiptUpload from '@/components/ReceiptUpload';
import IngredientsList from '@/components/IngredientsList';
import RecipeCard from '@/components/RecipeCard';
import MealPlanCard from '@/components/MealPlanCard';
import RecipeModal from '@/components/RecipeModal';
import ThemeToggle from '@/components/ThemeToggle';
import type { Recipe, MealPlan } from '@shared/schema';
import heroImage from '@assets/generated_images/Hero_ingredients_with_receipt_ecfb1571.png';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    
    // todo: remove mock functionality - Simulate processing
    setTimeout(() => {
      setIngredients([
        'Chicken breast',
        'Cherry tomatoes',
        'Fresh basil',
        'Olive oil',
        'Garlic',
        'Pasta',
        'Parmesan cheese',
        'Bell peppers',
        'Onions',
        'Mushrooms'
      ]);
      
      setRecipes([
        {
          id: '1',
          title: 'Mediterranean Chicken Pasta',
          description: 'A delicious pasta dish with grilled chicken, cherry tomatoes, and fresh basil in olive oil',
          ingredients: ['Chicken breast', 'Pasta', 'Cherry tomatoes', 'Fresh basil', 'Olive oil', 'Garlic'],
          instructions: [
            'Cook pasta according to package directions',
            'Season and grill chicken breast, then slice',
            'Sauté garlic in olive oil',
            'Add cherry tomatoes and cook until soft',
            'Toss pasta with chicken and vegetables',
            'Garnish with fresh basil'
          ],
          cookingTime: 25,
          servings: 4,
          difficulty: 'medium',
          mealType: 'dinner'
        },
        {
          id: '2',
          title: 'Stuffed Bell Peppers',
          description: 'Bell peppers stuffed with a savory mixture of vegetables and cheese',
          ingredients: ['Bell peppers', 'Onions', 'Mushrooms', 'Garlic', 'Parmesan cheese'],
          instructions: [
            'Preheat oven to 375°F',
            'Cut tops off peppers and remove seeds',
            'Sauté onions, mushrooms, and garlic',
            'Stuff peppers with vegetable mixture',
            'Top with Parmesan cheese',
            'Bake for 25-30 minutes'
          ],
          cookingTime: 35,
          servings: 4,
          difficulty: 'easy',
          mealType: 'lunch'
        },
        {
          id: '3',
          title: 'Garlic Roasted Chicken',
          description: 'Tender roasted chicken with aromatic garlic and herbs',
          ingredients: ['Chicken breast', 'Garlic', 'Olive oil', 'Fresh basil'],
          instructions: [
            'Preheat oven to 400°F',
            'Rub chicken with olive oil and minced garlic',
            'Season with salt and pepper',
            'Roast for 20-25 minutes',
            'Garnish with fresh basil'
          ],
          cookingTime: 30,
          servings: 2,
          difficulty: 'easy',
          mealType: 'dinner'
        }
      ]);

      setMealPlans([
        {
          id: '1',
          day: 'Monday',
          generatedAt: new Date().toISOString(),
          recipes: [
            {
              id: '4',
              title: 'Garlic Mushroom Breakfast',
              description: 'Sautéed mushrooms with garlic served with toast',
              ingredients: ['Mushrooms', 'Garlic', 'Olive oil'],
              instructions: ['Sauté mushrooms with garlic', 'Serve with toast'],
              cookingTime: 15,
              servings: 1,
              difficulty: 'easy',
              mealType: 'breakfast'
            }
          ]
        },
        {
          id: '2',
          day: 'Tuesday',
          generatedAt: new Date().toISOString(),
          recipes: [
            {
              id: '5',
              title: 'Tomato Basil Salad',
              description: 'Fresh cherry tomatoes with basil and olive oil dressing',
              ingredients: ['Cherry tomatoes', 'Fresh basil', 'Olive oil'],
              instructions: ['Slice tomatoes', 'Mix with basil and olive oil'],
              cookingTime: 10,
              servings: 2,
              difficulty: 'easy',
              mealType: 'lunch'
            }
          ]
        }
      ]);
      
      setIsProcessing(false);
    }, 3000);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setIngredients([]);
    setRecipes([]);
    setMealPlans([]);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const generateMoreRecipes = () => {
    console.log('Generate more recipes clicked');
    // todo: remove mock functionality - In real app, this would call API
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold" data-testid="text-app-title">Recipe Generator</h1>
                <p className="text-xs text-muted-foreground">Transform receipts into meal plans</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="relative aspect-[16/9] max-w-4xl mx-auto mb-8 rounded-xl overflow-hidden">
            <img 
              src={heroImage}
              alt="Fresh ingredients with grocery receipt"
              className="w-full h-full object-cover"
              data-testid="img-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">
                  Turn Receipts into Recipes
                </h2>
                <p className="text-lg md:text-xl max-w-2xl">
                  Upload your grocery receipt and let AI create personalized meal plans based on what you've purchased
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="mb-12">
          <ReceiptUpload 
            onImageUpload={handleImageUpload}
            isProcessing={isProcessing}
            uploadedImage={uploadedImage}
            onRemoveImage={handleRemoveImage}
          />
        </section>

        {/* Results Section */}
        {(ingredients.length > 0 || isProcessing) && (
          <section className="space-y-8">
            {/* Ingredients */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <IngredientsList 
                  ingredients={ingredients}
                  onIngredientsChange={setIngredients}
                />
              </div>

              {/* Generated Recipes */}
              <div className="lg:col-span-2 space-y-6">
                {recipes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold flex items-center gap-2" data-testid="text-recipes-title">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Generated Recipes
                      </h2>
                      <Button 
                        onClick={generateMoreRecipes}
                        variant="outline"
                        data-testid="button-generate-more"
                      >
                        Generate More
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recipes.map((recipe) => (
                        <RecipeCard 
                          key={recipe.id}
                          recipe={recipe}
                          onViewDetails={handleViewRecipe}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Meal Plans */}
                {mealPlans.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6" data-testid="text-meal-plans-title">
                      <Calendar className="h-6 w-6 text-primary" />
                      Weekly Meal Plans
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mealPlans.map((mealPlan) => (
                        <MealPlanCard 
                          key={mealPlan.id}
                          mealPlan={mealPlan}
                          onRecipeClick={(recipeId) => {
                            const recipe = [...recipes, ...mealPlans.flatMap(mp => mp.recipes)]
                              .find(r => r.id === recipeId);
                            if (recipe) handleViewRecipe(recipe);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!uploadedImage && !isProcessing && (
          <section className="text-center py-16 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="p-6">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Upload Receipt</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a photo or upload an image of your grocery receipt
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">AI Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI extracts ingredients and generates personalized recipes
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Get Meal Plans</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive complete meal plans with cooking instructions
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      {/* Recipe Modal */}
      <RecipeModal 
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}