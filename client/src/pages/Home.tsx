import React, { useState } from 'react';
import { Upload, Sparkles, Calendar, Refrigerator, Loader2, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ReceiptUpload from '@/components/ReceiptUpload';
import IngredientsList from '@/components/IngredientsList';
import RecipeCard from '@/components/RecipeCard';
import MealPlanCard from '@/components/MealPlanCard';
import RecipeModal from '@/components/RecipeModal';
import ThemeToggle from '@/components/ThemeToggle';
import AffiliateSettings from '@/components/AffiliateSettings';
import AffiliateRecommendations from '@/components/AffiliateRecommendations';
import { useToast } from '@/hooks/use-toast';
import type { Recipe, MealPlan } from '@shared/schema';
import heroImage from '@assets/generated_images/hero_image_cutting_board.png';

const uploadModeConfig = {
  receipt: {
    endpoint: '/api/process-base64',
    detectionSuccessTitle: 'Receipt scanned',
    detectionSuccessDescription: (ingredientCount: number) =>
      `Found ${ingredientCount} ingredient${ingredientCount === 1 ? '' : 's'}. Review and confirm before generating recipes.`,
    detectionErrorTitle: 'Error processing receipt',
    detectionErrorDescription: 'Please try again with a clear receipt image.',
    noIngredientsTitle: 'No ingredients detected',
    noIngredientsDescription: 'Try capturing another photo with the entire receipt in focus and good lighting.',
    reviewMessage: 'Review the items we pulled from your receipt. Make any tweaks before generating meal plans.',
    confirmButtonLabel: 'Generate Meal Plans',
    generationSuccessTitle: 'Meal plans ready!',
    generationSuccessDescription: (recipeCount: number) =>
      `Generated ${recipeCount} recipe${recipeCount === 1 ? '' : 's'} from your receipt.`,
    generationErrorTitle: 'Meal plan generation failed',
    generationErrorDescription: 'Please try again after adjusting your ingredients.',
    processingText: 'Processing receipt...',
    uploadTitle: 'Upload Your Receipt',
    uploadDescription: 'Take a photo or upload an image of your grocery receipt',
    cameraButtonLabel: 'Take Photo with Camera',
    galleryButtonLabel: 'Choose from Gallery',
    frameGuideText: 'Center receipt in frame',
    cameraTip: 'On mobile, tap "Take Photo with Camera" to use your phone\'s camera',
    fileNamePrefix: 'receipt' as const,
  },
  fridge: {
    endpoint: '/api/fridge/scan',
    detectionSuccessTitle: 'Fridge scanned',
    detectionSuccessDescription: (ingredientCount: number) =>
      `Identified ${ingredientCount} ingredient${ingredientCount === 1 ? '' : 's'}. Review and confirm before generating recipes.`,
    detectionErrorTitle: 'Error scanning fridge',
    detectionErrorDescription: 'Try again with a well-lit photo of your fridge interior.',
    noIngredientsTitle: 'No items detected',
    noIngredientsDescription: 'Open the fridge and make sure the shelves are well lit before snapping another photo.',
    reviewMessage: 'Double-check the fridge items we spotted and make edits before generating meal plans.',
    confirmButtonLabel: 'Generate Meal Plans',
    generationSuccessTitle: 'Meal plans ready!',
    generationSuccessDescription: (recipeCount: number) =>
      `Suggested ${recipeCount} recipe${recipeCount === 1 ? '' : 's'} based on your fridge.`,
    generationErrorTitle: 'Meal plan generation failed',
    generationErrorDescription: 'Please try again after adjusting your ingredient list.',
    processingText: 'Analyzing fridge...',
    uploadTitle: 'Scan Your Fridge',
    uploadDescription: 'Snap a photo of your fridge shelves to find ingredients you already have',
    cameraButtonLabel: 'Take Fridge Photo',
    galleryButtonLabel: 'Upload Fridge Photo',
    frameGuideText: 'Fill the frame with your fridge contents',
    cameraTip: 'Open the fridge and make sure the shelves are well lit before taking the photo.',
    fileNamePrefix: 'fridge' as const,
  },
} as const;

type UploadMode = keyof typeof uploadModeConfig;

export default function Home() {
  const [uploadMode, setUploadMode] = useState<UploadMode>('receipt');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingSource, setProcessingSource] = useState<UploadMode | null>(null);
  const isProcessing = processingSource !== null;
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isGeneratingMealPlans, setIsGeneratingMealPlans] = useState(false);
  const [lastDetectionMode, setLastDetectionMode] = useState<UploadMode | null>(null);
  const [newIngredient, setNewIngredient] = useState('');
  const { toast } = useToast();
  const activeConfig = uploadModeConfig[uploadMode];
  const processingText = processingSource
    ? uploadModeConfig[processingSource].processingText
    : activeConfig.processingText;
  const confirmationConfig = lastDetectionMode
    ? uploadModeConfig[lastDetectionMode]
    : activeConfig;

  const processImage = async (file: File, source: UploadMode) => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setProcessingSource(source);
    setRecipes([]);
    setMealPlans([]);
    setIngredients([]);
    setNeedsConfirmation(false);
    setLastDetectionMode(null);

    const config = uploadModeConfig[source];

    try {
      // Check file size (mobile browsers have stricter limits)
      const maxSizeMB = 10; // 10MB limit
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File too large. Please use an image smaller than ${maxSizeMB}MB.`);
      }

      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const result = reader.result as string;
            if (!result || typeof result !== 'string') {
              reject(new Error('Failed to read file as data URL'));
              return;
            }
            const base64 = result.split(',')[1];
            if (!base64) {
              reject(new Error('Failed to extract base64 from data URL'));
              return;
            }
            resolve(base64);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
      });

      const processResponse = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image })
      });

      if (!processResponse.ok) {
        const errorText = await processResponse.text();
        throw new Error(`Failed to process image: ${errorText}`);
      }

      const processedResult = await processResponse.json();
      const nextIngredients: string[] = processedResult.ingredients || [];
      
      if (nextIngredients.length === 0) {
        toast({
          title: config.noIngredientsTitle,
          description: config.noIngredientsDescription,
          variant: 'destructive'
        });
        setNeedsConfirmation(false);
        setLastDetectionMode(null);
        return;
      }

      setIngredients(nextIngredients);
      setLastDetectionMode(source);
      setNeedsConfirmation(true);

      toast({
        title: config.detectionSuccessTitle,
        description: config.detectionSuccessDescription(nextIngredients.length)
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: config.detectionErrorTitle,
        description: config.detectionErrorDescription,
        variant: "destructive"
      });
      setIngredients([]);
      setNeedsConfirmation(false);
      setLastDetectionMode(null);
    } finally {
      setProcessingSource(null);
    }
  };

  const handleReceiptUpload = (file: File) => processImage(file, 'receipt');
  const handleFridgeUpload = (file: File) => processImage(file, 'fridge');

  const handleIngredientsChange = (updatedIngredients: string[]) => {
    setIngredients(updatedIngredients);
    if (updatedIngredients.length === 0) {
      setMealPlans([]);
      setRecipes([]);
      setNeedsConfirmation(false);
      return;
    }
    setMealPlans([]);
    setRecipes([]);
    setNeedsConfirmation(true);
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setIngredients([]);
    setRecipes([]);
    setMealPlans([]);
    setProcessingSource(null);
    setNeedsConfirmation(false);
    setIsGeneratingMealPlans(false);
    setLastDetectionMode(null);
  };

  const handleConfirmIngredients = async () => {
    if (ingredients.length === 0) {
      toast({
        title: 'No ingredients to process',
        description: 'Add at least one ingredient before generating meal plans.',
        variant: 'destructive'
      });
      return;
    }

    const mode = lastDetectionMode ?? uploadMode;
    const config = uploadModeConfig[mode];

    try {
      setIsGeneratingMealPlans(true);
      const response = await fetch('/api/meal-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      const generatedMealPlans: MealPlan[] = data.mealPlans || [];
      setMealPlans(generatedMealPlans);

      const allRecipes: Recipe[] = [];
      generatedMealPlans.forEach((mealPlan) => {
        allRecipes.push(...mealPlan.recipes);
      });
      setRecipes(allRecipes);
      setNeedsConfirmation(false);

      toast({
        title: config.generationSuccessTitle,
        description: config.generationSuccessDescription(allRecipes.length)
      });
    } catch (error) {
      console.error('Error generating meal plans:', error);
      toast({
        title: config.generationErrorTitle,
        description: config.generationErrorDescription,
        variant: 'destructive'
      });
      setNeedsConfirmation(true);
    } finally {
      setIsGeneratingMealPlans(false);
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const generateMoreRecipes = async () => {
    if (ingredients.length === 0) {
      toast({
        title: 'No ingredients available',
        description: 'Add ingredients first to generate more recipes.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsGeneratingMealPlans(true);
      const response = await fetch('/api/meal-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      const newMealPlans: MealPlan[] = data.mealPlans || [];

      // Add new meal plans to existing ones
      setMealPlans(prevMealPlans => [...prevMealPlans, ...newMealPlans]);

      // Add new recipes to existing ones
      const newRecipes: Recipe[] = [];
      newMealPlans.forEach((mealPlan) => {
        newRecipes.push(...mealPlan.recipes);
      });
      setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]);

      toast({
        title: 'More recipes generated!',
        description: `Added ${newRecipes.length} new recipe${newRecipes.length === 1 ? '' : 's'} to your collection.`
      });
    } catch (error) {
      console.error('Error generating more recipes:', error);
      toast({
        title: 'Failed to generate more recipes',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingMealPlans(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile First */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <img 
                  src="/icons/icon.png" 
                  alt="ReceiptChef" 
                  className="h-8 w-8 md:h-10 md:w-10 hover:scale-105 transition-all duration-200 cursor-pointer" 
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold" data-testid="text-app-title">ReceiptChef</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Transform receipts into meal plans</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AffiliateSettings />
              <ThemeToggle />
            </div>
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
                  Upload your grocery receipt or snap your fridge and let AI create personalized meal plans from what you already have
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        {(ingredients.length === 0 || isProcessing) && (
          <section className="mb-8 md:mb-12">
            <div className="flex justify-center gap-2 mb-4">
              <Button
                variant={uploadMode === 'receipt' ? 'default' : 'outline'}
                className="flex-1 sm:flex-none sm:min-w-[160px]"
                onClick={() => setUploadMode('receipt')}
                disabled={isProcessing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Receipt
              </Button>
              <Button
                variant={uploadMode === 'fridge' ? 'default' : 'outline'}
                className="flex-1 sm:flex-none sm:min-w-[160px]"
                onClick={() => setUploadMode('fridge')}
                disabled={isProcessing}
              >
                <Refrigerator className="h-4 w-4 mr-2" />
                Fridge
              </Button>
            </div>
            <ReceiptUpload
              key={uploadMode}
              onImageUpload={uploadMode === 'receipt' ? handleReceiptUpload : handleFridgeUpload}
              isProcessing={isProcessing}
              uploadedImage={uploadedImage}
              onRemoveImage={handleRemoveImage}
              title={activeConfig.uploadTitle}
              description={activeConfig.uploadDescription}
              cameraButtonLabel={activeConfig.cameraButtonLabel}
              galleryButtonLabel={activeConfig.galleryButtonLabel}
              frameGuideText={activeConfig.frameGuideText}
              processingText={processingText}
              cameraTip={activeConfig.cameraTip}
              fileNamePrefix={activeConfig.fileNamePrefix}
            />
          </section>
        )}

        {/* Results Section - Mobile First */}
        {(ingredients.length > 0 || isProcessing) && (
          <section className="space-y-6 md:space-y-8">
            {/* Compact source indicator when receipt is hidden */}
            {ingredients.length > 0 && !needsConfirmation && (
              <div className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {uploadMode === 'receipt' ? (
                    <Upload className="h-4 w-4" />
                  ) : (
                    <Refrigerator className="h-4 w-4" />
                  )}
                  <span>Ingredients from {uploadMode === 'receipt' ? 'receipt' : 'fridge scan'}</span>
                </div>
                <Button
                  onClick={handleRemoveImage}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Start Over
                </Button>
              </div>
            )}
            {/* Mobile: Stack all components, Desktop: 1/3 - 2/3 layout */}
            {/* Compact Ingredients Display for Mobile, Sidebar for Desktop */}
            <div className={`${recipes.length > 0 ? 'md:grid md:grid-cols-1 lg:grid-cols-4 md:gap-6' : ''}`}>
              {/* Ingredients Section */}
              <div className={`${recipes.length > 0 ? 'lg:col-span-1' : ''} mb-6 md:mb-0`}>
                {recipes.length > 0 ? (
                  /* Clean list view when recipes exist */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Ingredients</h3>
                      <span className="text-sm text-muted-foreground">{ingredients.length} items</span>
                    </div>

                    {/* Ingredients list */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm font-medium flex-1">{ingredient}</span>
                          <button
                            onClick={() => {
                              const updated = ingredients.filter(item => item !== ingredient);
                              handleIngredientsChange(updated);
                            }}
                            className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                            aria-label={`Remove ${ingredient}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add ingredient input */}
                    <div className="pt-3 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add ingredient..."
                          value={newIngredient}
                          onChange={(e) => setNewIngredient(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newIngredient.trim()) {
                              handleIngredientsChange([...ingredients, newIngredient.trim()]);
                              setNewIngredient('');
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => {
                            if (newIngredient.trim()) {
                              handleIngredientsChange([...ingredients, newIngredient.trim()]);
                              setNewIngredient('');
                            }
                          }}
                          disabled={!newIngredient.trim()}
                          size="icon"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Full view when no recipes */
                  <IngredientsList
                    ingredients={ingredients}
                    onIngredientsChange={handleIngredientsChange}
                  />
                )}

                {/* Initial generation controls */}
                {ingredients.length > 0 && needsConfirmation && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-xs sm:text-sm text-muted-foreground">
                      {confirmationConfig.reviewMessage}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        onClick={handleConfirmIngredients}
                        disabled={isGeneratingMealPlans || isProcessing}
                        className="h-12 flex-1"
                      >
                        {isGeneratingMealPlans ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </span>
                        ) : (
                          confirmationConfig.confirmButtonLabel
                        )}
                      </Button>
                      <Button
                        onClick={handleRemoveImage}
                        variant="outline"
                        className="h-12 flex-1"
                      >
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Generated Recipes */}
              <div className={`${recipes.length > 0 ? 'lg:col-span-3' : ''} space-y-6`}>
                {recipes.length > 0 && (
                  <div>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2" data-testid="text-recipes-title">
                            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            Generated Recipes
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Based on {ingredients.length} ingredients
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={handleConfirmIngredients}
                            variant="outline"
                            size="default"
                            disabled={isGeneratingMealPlans || isProcessing}
                            className="w-full sm:w-auto"
                          >
                            {isGeneratingMealPlans ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </span>
                            ) : (
                              'Update with New Ingredients'
                            )}
                          </Button>
                          <Button
                            onClick={generateMoreRecipes}
                            variant="default"
                            size="default"
                            disabled={isGeneratingMealPlans || isProcessing}
                            data-testid="button-generate-more"
                          >
                            {isGeneratingMealPlans ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </span>
                            ) : (
                              'Add More Recipes'
                            )}
                          </Button>
                        </div>
                      </div>
                      {ingredients.length > 0 && (
                        <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
                          💡 <strong>Tip:</strong> Add ingredients in the sidebar, then choose "Update" to replace current recipes or "Add More" to expand your collection.
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recipes.map((recipe, index) => (
                        <React.Fragment key={recipe.id}>
                          <RecipeCard
                            recipe={recipe}
                            onViewDetails={handleViewRecipe}
                          />
                          {/* Show affiliate recommendation after first 2 recipes */}
                          {index === 1 && recipes.length > 2 && (
                            <div className="col-span-1 md:col-span-2">
                              <AffiliateRecommendations
                                context="recipe"
                                recipeType={recipes[0]?.mealType}
                                recipes={recipes}
                                maxItems={2}
                                title="Perfect for these recipes"
                                subtitle="Tools recommended based on your meal plan"
                              />
                            </div>
                          )}
                        </React.Fragment>
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
                      {mealPlans.map((mealPlan, index) => (
                        <React.Fragment key={mealPlan.id}>
                          <MealPlanCard
                            mealPlan={mealPlan}
                            onRecipeClick={(recipeId) => {
                              const recipe = [...recipes, ...mealPlans.flatMap(mp => mp.recipes)]
                                .find(r => r.id === recipeId);
                              if (recipe) handleViewRecipe(recipe);
                            }}
                          />
                          {/* Show affiliate recommendation after first meal plan */}
                          {index === 0 && mealPlans.length > 1 && (
                            <div className="col-span-1 md:col-span-2">
                              <AffiliateRecommendations
                                context="meal-plan"
                                ingredients={ingredients}
                                maxItems={1}
                                title="Meal prep must-haves"
                                subtitle="Save time with these kitchen essentials"
                              />
                            </div>
                          )}
                        </React.Fragment>
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
