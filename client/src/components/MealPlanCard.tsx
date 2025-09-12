import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MealPlan } from '@shared/schema';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onRecipeClick?: (recipeId: string) => void;
}

export default function MealPlanCard({ mealPlan, onRecipeClick }: MealPlanCardProps) {
  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'lunch': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'dinner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'snack': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const totalCookingTime = mealPlan.recipes.reduce((total, recipe) => total + recipe.cookingTime, 0);

  return (
    <Card className="hover-elevate" data-testid={`card-meal-plan-${mealPlan.id}`}>
      <CardHeader className="pb-3 md:pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span data-testid={`text-meal-plan-day-${mealPlan.id}`}>{mealPlan.day}</span>
          </CardTitle>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span data-testid={`text-total-time-${mealPlan.id}`} className="whitespace-nowrap">{totalCookingTime}m total</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {mealPlan.recipes.length} recipe{mealPlan.recipes.length !== 1 ? 's' : ''} planned
        </p>
      </CardHeader>

      <CardContent className="space-y-2 md:space-y-3">
        {mealPlan.recipes.map((recipe) => (
          <div 
            key={recipe.id}
            className="p-3 md:p-4 rounded-md md:rounded-lg border bg-card/50 hover-elevate cursor-pointer transition-colors min-h-16 md:min-h-20 flex items-center"
            onClick={() => {
              console.log('Recipe clicked:', recipe.title);
              onRecipeClick?.(recipe.id);
            }}
            data-testid={`recipe-item-${recipe.id}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <h4 className="font-medium text-sm sm:text-base truncate" data-testid={`text-recipe-name-${recipe.id}`}>
                    {recipe.title}
                  </h4>
                  <Badge 
                    className={`${getMealTypeColor(recipe.mealType)} text-xs w-fit`}
                    data-testid={`badge-recipe-type-${recipe.id}`}
                  >
                    {recipe.mealType}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
                  {recipe.description}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end text-xs text-muted-foreground mt-1 sm:mt-0">
                <span data-testid={`text-recipe-time-${recipe.id}`} className="whitespace-nowrap">{recipe.cookingTime}m</span>
                <span data-testid={`text-recipe-servings-${recipe.id}`} className="whitespace-nowrap">{recipe.servings} servings</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}