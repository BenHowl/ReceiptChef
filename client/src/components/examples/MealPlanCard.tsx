import MealPlanCard from '../MealPlanCard';
import type { MealPlan } from '@shared/schema';

export default function MealPlanCardExample() {
  // todo: remove mock functionality
  const mockMealPlan: MealPlan = {
    id: '1',
    day: 'Monday',
    generatedAt: new Date().toISOString(),
    recipes: [
      {
        id: '1',
        title: 'Avocado Toast',
        description: 'Whole grain toast topped with mashed avocado and cherry tomatoes',
        ingredients: ['Bread', 'Avocado', 'Cherry tomatoes'],
        instructions: ['Toast bread', 'Mash avocado', 'Top with tomatoes'],
        cookingTime: 10,
        servings: 1,
        difficulty: 'easy',
        mealType: 'breakfast'
      },
      {
        id: '2',
        title: 'Chicken Caesar Salad',
        description: 'Fresh romaine lettuce with grilled chicken and Caesar dressing',
        ingredients: ['Chicken breast', 'Romaine lettuce', 'Caesar dressing'],
        instructions: ['Grill chicken', 'Prepare salad', 'Add dressing'],
        cookingTime: 20,
        servings: 2,
        difficulty: 'medium',
        mealType: 'lunch'
      },
      {
        id: '3',
        title: 'Spaghetti Bolognese',
        description: 'Classic Italian pasta with rich meat sauce',
        ingredients: ['Spaghetti', 'Ground beef', 'Tomato sauce'],
        instructions: ['Cook pasta', 'Prepare sauce', 'Combine'],
        cookingTime: 45,
        servings: 4,
        difficulty: 'medium',
        mealType: 'dinner'
      }
    ]
  };

  return (
    <div className="p-6 max-w-md">
      <MealPlanCard mealPlan={mockMealPlan} />
    </div>
  );
}