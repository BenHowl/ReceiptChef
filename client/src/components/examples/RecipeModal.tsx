import RecipeModal from '../RecipeModal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Recipe } from '@shared/schema';

export default function RecipeModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  // todo: remove mock functionality
  const mockRecipe: Recipe = {
    id: '1',
    title: 'Creamy Mushroom Risotto',
    description: 'Rich and creamy Arborio rice cooked with mixed mushrooms, white wine, and finished with Parmesan cheese and fresh herbs.',
    ingredients: [
      '1 cup Arborio rice',
      '4 cups warm chicken broth',
      '8 oz mixed mushrooms, sliced',
      '1/2 cup white wine',
      '1/2 cup grated Parmesan cheese',
      '2 tbsp butter',
      '1 onion, finely chopped',
      '2 cloves garlic, minced',
      'Fresh thyme and parsley',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat the chicken broth in a separate pot and keep warm.',
      'In a large pan, melt 1 tbsp butter and sauté mushrooms until golden. Set aside.',
      'In the same pan, add remaining butter and cook onion until translucent.',
      'Add garlic and rice, stirring for 1-2 minutes until rice is lightly toasted.',
      'Pour in white wine and stir until absorbed.',
      'Add warm broth one ladle at a time, stirring constantly until absorbed.',
      'Continue adding broth and stirring for 18-20 minutes until rice is creamy.',
      'Stir in cooked mushrooms, Parmesan cheese, and fresh herbs.',
      'Season with salt and pepper. Serve immediately.'
    ],
    cookingTime: 35,
    servings: 4,
    difficulty: 'medium',
    mealType: 'dinner'
  };

  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)}>
        Open Recipe Modal
      </Button>
      <RecipeModal 
        recipe={mockRecipe}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}