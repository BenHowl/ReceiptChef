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
      <CardHeader className="pb-4">
        <CardTitle className="text-lg" data-testid="text-ingredients-title">
          {title}
        </CardTitle>
        {ingredients.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} found
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {ingredients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p data-testid="text-no-ingredients">No ingredients detected yet</p>
            <p className="text-sm">Upload a receipt to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                data-testid={`ingredient-item-${index}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => toggleIngredientCheck(ingredient)}
                    data-testid={`button-check-ingredient-${index}`}
                  >
                    {checkedIngredients.has(ingredient) ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded border-2 border-muted-foreground" />
                    )}
                  </Button>
                  <span 
                    className={`flex-1 ${checkedIngredients.has(ingredient) ? 'line-through text-muted-foreground' : ''}`}
                    data-testid={`text-ingredient-${index}`}
                  >
                    {ingredient}
                  </span>
                </div>
                
                {!readOnly && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive hover:text-destructive"
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
          <div className="flex gap-2 pt-2">
            <Input
              placeholder="Add custom ingredient..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
              data-testid="input-new-ingredient"
            />
            <Button 
              onClick={handleAddIngredient}
              disabled={!newIngredient.trim()}
              data-testid="button-add-ingredient"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {checkedIngredients.size > 0 && (
          <div className="pt-2 border-t">
            <Badge variant="secondary" data-testid="badge-checked-count">
              {checkedIngredients.size} ingredient{checkedIngredients.size !== 1 ? 's' : ''} checked off
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}