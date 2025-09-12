import RecipeCard from '../RecipeCard';
import type { Recipe } from '@shared/schema';

export default function RecipeCardExample() {
  // todo: remove mock functionality
  const mockRecipe: Recipe = {
    id: '1',
    title: 'Mediterranean Pasta Salad',
    description: 'A refreshing pasta salad with cherry tomatoes, olives, feta cheese, and fresh herbs tossed in olive oil dressing.',
    ingredients: ['Pasta', 'Cherry tomatoes', 'Olives', 'Feta cheese', 'Basil', 'Olive oil'],
    instructions: [
      'Cook pasta according to package directions',
      'Chop vegetables and herbs',
      'Mix everything with olive oil dressing'
    ],
    cookingTime: 25,
    servings: 4,
    difficulty: 'easy',
    mealType: 'lunch'
  };

  return (
    <div className="p-6 max-w-sm">
      <RecipeCard recipe={mockRecipe} />
    </div>
  );
}