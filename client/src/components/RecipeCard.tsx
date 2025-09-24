import { useState, useEffect } from 'react';
import { Clock, Users, ChefHat, Heart, HeartOff } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@shared/schema';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onViewDetails }: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if recipe is already saved via API
    const checkSavedStatus = async () => {
      try {
        const response = await fetch(`/api/saved-recipes/${recipe.id}/status`);
        if (response.ok) {
          const { saved } = await response.json();
          setIsSaved(saved);
        }
      } catch (error) {
        console.error('Error checking recipe save status:', error);
      }
    };

    checkSavedStatus();
  }, [recipe.id]);

  const toggleSaveRecipe = async () => {
    try {
      if (isSaved) {
        // Remove from saved recipes
        const response = await fetch(`/api/saved-recipes/${recipe.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setIsSaved(false);
        } else {
          console.error('Failed to delete saved recipe');
        }
      } else {
        // Add to saved recipes
        const response = await fetch('/api/saved-recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recipe)
        });

        if (response.ok) {
          setIsSaved(true);
        } else if (response.status === 409) {
          // Recipe already saved
          setIsSaved(true);
        } else {
          console.error('Failed to save recipe');
        }
      }
    } catch (error) {
      console.error('Error toggling recipe save status:', error);
    }
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'lunch': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'dinner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'snack': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="hover-elevate transition-all duration-200 cursor-pointer" data-testid={`card-recipe-${recipe.id}`} onClick={() => {
      console.log('Recipe card clicked:', recipe.title);
      onViewDetails?.(recipe);
    }}>
      <CardHeader className="pb-3 md:pb-4">
        {recipe.image && (
          <div className="aspect-video rounded-md md:rounded-lg overflow-hidden mb-3 md:mb-4">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              data-testid={`img-recipe-${recipe.id}`}
            />
          </div>
        )}
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-start justify-between gap-2 md:gap-3">
            <h3 className="font-semibold text-base sm:text-lg leading-tight flex-1 min-w-0" data-testid={`text-recipe-title-${recipe.id}`}>
              {recipe.title}
            </h3>
            <Badge className={`${getMealTypeColor(recipe.mealType)} text-xs shrink-0`} data-testid={`badge-meal-type-${recipe.id}`}>
              {recipe.mealType}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base line-clamp-2" data-testid={`text-recipe-description-${recipe.id}`}>
            {recipe.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span data-testid={`text-cooking-time-${recipe.id}`} className="whitespace-nowrap">{recipe.cookingTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span data-testid={`text-servings-${recipe.id}`} className="whitespace-nowrap">{recipe.servings} servings</span>
          </div>
          <Badge className={`${getDifficultyColor(recipe.difficulty)} text-xs`} data-testid={`badge-difficulty-${recipe.id}`}>
            <ChefHat className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
            {recipe.difficulty}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-3 md:pt-4 flex gap-2">
        <Button
          className="flex-1 min-h-11 text-sm md:text-base"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            console.log('View recipe details:', recipe.title);
            onViewDetails?.(recipe);
          }}
          data-testid={`button-view-recipe-${recipe.id}`}
        >
          View Recipe
        </Button>
        <Button
          variant={isSaved ? "default" : "outline"}
          size="icon"
          className="min-h-11 w-11"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveRecipe();
          }}
          data-testid={`button-save-recipe-${recipe.id}`}
        >
          {isSaved ? (
            <Heart className="h-4 w-4 fill-current" />
          ) : (
            <HeartOff className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}