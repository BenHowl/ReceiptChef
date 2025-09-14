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
import { useToast } from '@/hooks/use-toast';
import type { Recipe, MealPlan } from '@shared/schema';
import heroImage from '@assets/generated_images/hero_image_cutting_board.png';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    
    try {
      // Check file size (mobile browsers have stricter limits)
      const maxSizeMB = 10; // 10MB limit
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File too large. Please use an image smaller than ${maxSizeMB}MB.`);
      }

      console.log('Processing file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        isMobile: /Mobi|Android/i.test(navigator.userAgent)
      });

      // Convert file to base64 and process directly
      const reader = new FileReader();

      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          try {
            const result = reader.result as string;
            if (!result || typeof result !== 'string') {
              reject(new Error('Failed to read file as data URL'));
              return;
            }
            // Remove data URL prefix to get just the base64 string
            const base64 = result.split(',')[1];
            if (!base64) {
              reject(new Error('Failed to extract base64 from data URL'));
              return;
            }
            console.log('Base64 conversion successful, length:', base64.length);
            resolve(base64);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(new Error('Failed to read file'));
        };
      });

      reader.readAsDataURL(file);
      const base64Image = await base64Promise;

      console.log('Sending request to /api/process-base64...');

      // Process receipt directly with base64 image
      const processResponse = await fetch('/api/process-base64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image })
      });

      console.log('Response status:', processResponse.status);

      if (!processResponse.ok) {
        const errorText = await processResponse.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to process receipt: ${errorText}`);
      }

      const processedReceipt = await processResponse.json();
      console.log('Processing successful:', processedReceipt);
      
      // Update UI with real data
      setIngredients(processedReceipt.ingredients || []);
      setMealPlans(processedReceipt.mealPlans || []);
      
      // Extract all recipes from meal plans
      const allRecipes: Recipe[] = [];
      processedReceipt.mealPlans?.forEach((mealPlan: MealPlan) => {
        allRecipes.push(...mealPlan.recipes);
      });
      setRecipes(allRecipes);
      
      toast({
        title: "Receipt processed successfully!",
        description: `Found ${processedReceipt.ingredients?.length || 0} ingredients and generated ${allRecipes.length} recipes.`
      });
      
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast({
        title: "Error processing receipt",
        description: "Please try again with a clear receipt image.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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
      {/* Header - Mobile First */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <img src="/icons/icon-optimized.svg" alt="ReceiptChef" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold" data-testid="text-app-title">ReceiptChef</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Transform receipts into meal plans</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 md:py-8 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
        {/* Hero Section - Mobile First */}
        <section className="text-center mb-6 md:mb-12">
          <div className="relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] md:max-w-4xl mx-auto mb-6 md:mb-8 rounded-lg md:rounded-xl overflow-hidden">
            <img 
              src={heroImage}
              alt="Fresh ingredients with grocery receipt"
              className="w-full h-full object-cover"
              data-testid="img-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-white p-4">
              <div className="text-center space-y-2 md:space-y-4 max-w-sm sm:max-w-lg md:max-w-2xl">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl font-bold drop-shadow-lg">
                  Turn Receipts into Recipes
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-md">
                  Upload your grocery receipt and let AI create personalized meal plans based on what you've purchased
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="mb-8 md:mb-12">
          <ReceiptUpload 
            onImageUpload={handleImageUpload}
            isProcessing={isProcessing}
            uploadedImage={uploadedImage}
            onRemoveImage={handleRemoveImage}
          />
        </section>

        {/* Results Section - Mobile First */}
        {(ingredients.length > 0 || isProcessing) && (
          <section className="space-y-6 md:space-y-8">
            {/* Mobile: Stack all components, Desktop: 1/3 - 2/3 layout */}
            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8">
              <div className="order-1 lg:order-1 lg:col-span-1">
                <IngredientsList 
                  ingredients={ingredients}
                  onIngredientsChange={setIngredients}
                />
              </div>

              {/* Generated Recipes */}
              <div className="order-2 lg:order-2 lg:col-span-2 space-y-6">
                {recipes.length > 0 && (
                  <div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2" data-testid="text-recipes-title">
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        Generated Recipes
                      </h2>
                      <Button 
                        onClick={generateMoreRecipes}
                        variant="outline"
                        className="w-full sm:w-auto"
                        size="default"
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
                    <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 mb-6" data-testid="text-meal-plans-title">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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

        {/* Empty State - Mobile First */}
        {!uploadedImage && !isProcessing && (
          <section className="text-center py-8 md:py-16 space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:max-w-4xl md:mx-auto">
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