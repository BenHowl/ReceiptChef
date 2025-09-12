import IngredientsList from '../IngredientsList';
import { useState } from 'react';

export default function IngredientsListExample() {
  // todo: remove mock functionality
  const [ingredients, setIngredients] = useState([
    'Chicken breast',
    'Cherry tomatoes',
    'Fresh basil',
    'Olive oil',
    'Garlic',
    'Pasta',
    'Parmesan cheese',
    'Bell peppers'
  ]);

  return (
    <div className="p-6 max-w-md">
      <IngredientsList 
        ingredients={ingredients}
        onIngredientsChange={setIngredients}
      />
    </div>
  );
}