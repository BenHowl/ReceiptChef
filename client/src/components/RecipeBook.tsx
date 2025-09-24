import { useState, useEffect } from 'react';
import { BookOpen, Trash2, Clock, Users, ChefHat, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecipeModal from './RecipeModal';
import type { Recipe } from '@shared/schema';

interface RecipeBookProps {
  onBack?: () => void;
}

export default function RecipeBook({ onBack }: RecipeBookProps) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load saved recipes from API
    const loadSavedRecipes = async () => {
      try {
        const response = await fetch('/api/saved-recipes');
        if (response.ok) {
          const recipes = await response.json();
          setSavedRecipes(recipes);
        } else {
          console.error('Failed to load saved recipes');
        }
      } catch (error) {
        console.error('Error loading saved recipes:', error);
      }
    };

    loadSavedRecipes();
  }, []);

  const removeRecipe = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/saved-recipes/${recipeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updated = savedRecipes.filter(recipe => recipe.id !== recipeId);
        setSavedRecipes(updated);
      } else {
        console.error('Failed to delete saved recipe');
      }
    } catch (error) {
      console.error('Error deleting saved recipe:', error);
    }
  };

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Recipe Book</h1>
                <p className="text-sm text-muted-foreground">
                  {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto">
        {savedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No saved recipes yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start creating recipes from your receipts and save your favorites here.
            </p>
            {onBack && (
              <Button onClick={onBack}>
                <ChefHat className="h-4 w-4 mr-2" />
                Create Recipes
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedRecipes.map((recipe) => (
              <Card key={recipe.id} className="group hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle
                      className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                      onClick={() => openRecipeModal(recipe)}
                    >
                      {recipe.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecipe(recipe.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {recipe.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {recipe.cookingTime && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {recipe.cookingTime}
                      </Badge>
                    )}
                    {recipe.servings && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {recipe.servings} servings
                      </Badge>
                    )}
                    {recipe.difficulty && (
                      <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0" onClick={() => openRecipeModal(recipe)}>
                  <div className="space-y-3">
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Ingredients</h4>
                        <div className="text-xs text-muted-foreground">
                          {recipe.ingredients.slice(0, 3).join(', ')}
                          {recipe.ingredients.length > 3 && ` +${recipe.ingredients.length - 3} more`}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRecipeModal(recipe);
                      }}
                    >
                      View Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
}