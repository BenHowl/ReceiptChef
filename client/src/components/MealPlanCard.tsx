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
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            <span data-testid={`text-meal-plan-day-${mealPlan.id}`}>{mealPlan.day}</span>
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span data-testid={`text-total-time-${mealPlan.id}`}>{totalCookingTime} min total</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {mealPlan.recipes.length} recipe{mealPlan.recipes.length !== 1 ? 's' : ''} planned
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {mealPlan.recipes.map((recipe) => (
          <div 
            key={recipe.id}
            className="p-3 rounded-lg border bg-card/50 hover-elevate cursor-pointer transition-colors"
            onClick={() => {
              console.log('Recipe clicked:', recipe.title);
              onRecipeClick?.(recipe.id);
            }}
            data-testid={`recipe-item-${recipe.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate" data-testid={`text-recipe-name-${recipe.id}`}>
                    {recipe.title}
                  </h4>
                  <Badge 
                    className={`${getMealTypeColor(recipe.mealType)} text-xs`}
                    data-testid={`badge-recipe-type-${recipe.id}`}
                  >
                    {recipe.mealType}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {recipe.description}
                </p>
              </div>
              <div className="flex flex-col items-end text-xs text-muted-foreground">
                <span data-testid={`text-recipe-time-${recipe.id}`}>{recipe.cookingTime}m</span>
                <span data-testid={`text-recipe-servings-${recipe.id}`}>{recipe.servings} servings</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}