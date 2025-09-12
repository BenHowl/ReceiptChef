import { Check, X, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface IngredientsListProps {
  ingredients: string[];
  onIngredientsChange?: (ingredients: string[]) => void;
  readOnly?: boolean;
  title?: string;
}

export default function IngredientsList({ 
  ingredients, 
  onIngredientsChange, 
  readOnly = false,
  title = "Detected Ingredients"
}: IngredientsListProps) {
  const [newIngredient, setNewIngredient] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      const updated = [...ingredients, newIngredient.trim()];
      onIngredientsChange?.(updated);
      setNewIngredient('');
      console.log('Added ingredient:', newIngredient.trim());
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    const updated = ingredients.filter(item => item !== ingredient);
    onIngredientsChange?.(updated);
    console.log('Removed ingredient:', ingredient);
  };

  const toggleIngredientCheck = (ingredient: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient);
    } else {
      newChecked.add(ingredient);
    }
    setCheckedIngredients(newChecked);
    console.log('Toggled ingredient check:', ingredient);
  };

  return (
    <Card data-testid="card-ingredients-list">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="text-base sm:text-lg" data-testid="text-ingredients-title">
          {title}
        </CardTitle>
        {ingredients.length > 0 && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} found
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3 md:space-y-4">
        {ingredients.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-muted-foreground">
            <p className="text-sm" data-testid="text-no-ingredients">No ingredients detected yet</p>
            <p className="text-xs sm:text-sm">Upload a receipt to get started</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {ingredients.map((ingredient, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 md:p-4 rounded-md md:rounded-lg border bg-card/50 min-h-12 md:min-h-14"
                data-testid={`ingredient-item-${index}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 md:h-8 md:w-8 shrink-0"
                    onClick={() => toggleIngredientCheck(ingredient)}
                    data-testid={`button-check-ingredient-${index}`}
                  >
                    {checkedIngredients.has(ingredient) ? (
                      <Check className="h-5 w-5 md:h-4 md:w-4 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 md:h-4 md:w-4 rounded border-2 border-muted-foreground" />
                    )}
                  </Button>
                  <span 
                    className={`flex-1 text-sm md:text-base truncate ${checkedIngredients.has(ingredient) ? 'line-through text-muted-foreground' : ''}`}
                    data-testid={`text-ingredient-${index}`}
                  >
                    {ingredient}
                  </span>
                </div>
                
                {!readOnly && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 md:h-8 md:w-8 text-destructive hover:text-destructive shrink-0"
                    onClick={() => handleRemoveIngredient(ingredient)}
                    data-testid={`button-remove-ingredient-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!readOnly && (
          <div className="flex flex-col gap-2 sm:flex-row pt-2">
            <Input
              placeholder="Add custom ingredient..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
              className="flex-1 h-11"
              data-testid="input-new-ingredient"
            />
            <Button 
              onClick={handleAddIngredient}
              disabled={!newIngredient.trim()}
              className="h-11 w-full sm:w-auto px-6"
              data-testid="button-add-ingredient"
            >
              <Plus className="h-4 w-4 mr-2 sm:mr-0" />
              <span className="sm:hidden">Add Ingredient</span>
            </Button>
          </div>
        )}

        {checkedIngredients.size > 0 && (
          <div className="pt-3 border-t">
            <Badge variant="secondary" className="text-xs" data-testid="badge-checked-count">
              {checkedIngredients.size} ingredient{checkedIngredients.size !== 1 ? 's' : ''} checked off
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}