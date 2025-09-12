import { Clock, Users, ChefHat } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@shared/schema';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onViewDetails }: RecipeCardProps) {
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
    <Card className="hover-elevate transition-all duration-200" data-testid={`card-recipe-${recipe.id}`}>
      <CardHeader className="pb-3">
        {recipe.image && (
          <div className="aspect-video rounded-lg overflow-hidden mb-3">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
              data-testid={`img-recipe-${recipe.id}`}
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight" data-testid={`text-recipe-title-${recipe.id}`}>
              {recipe.title}
            </h3>
            <Badge className={getMealTypeColor(recipe.mealType)} data-testid={`badge-meal-type-${recipe.id}`}>
              {recipe.mealType}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2" data-testid={`text-recipe-description-${recipe.id}`}>
            {recipe.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span data-testid={`text-cooking-time-${recipe.id}`}>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span data-testid={`text-servings-${recipe.id}`}>{recipe.servings} servings</span>
          </div>
          <Badge className={getDifficultyColor(recipe.difficulty)} data-testid={`badge-difficulty-${recipe.id}`}>
            <ChefHat className="h-3 w-3 mr-1" />
            {recipe.difficulty}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => {
            console.log('View recipe details:', recipe.title);
            onViewDetails?.(recipe);
          }}
          data-testid={`button-view-recipe-${recipe.id}`}
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}