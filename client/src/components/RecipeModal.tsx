import { Clock, Users, ChefHat, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import type { Recipe } from '@shared/schema';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

// Custom hook to detect if screen is mobile sized
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

export default function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  const isMobile = useIsMobile();
  
  if (!recipe) return null;

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

  // Shared content component for both mobile and desktop
  const recipeContent = (
    <div className="space-y-4 md:space-y-6">
      {recipe.image && (
        <div className="aspect-video rounded-md md:rounded-lg overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
            data-testid="img-modal-recipe"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Badge className={getMealTypeColor(recipe.mealType)} data-testid="badge-modal-meal-type">
          {recipe.mealType}
        </Badge>
        <Badge className={getDifficultyColor(recipe.difficulty)} data-testid="badge-modal-difficulty">
          <ChefHat className="h-3 w-3 mr-1" />
          {recipe.difficulty}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span data-testid="text-modal-cooking-time">{recipe.cookingTime} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span data-testid="text-modal-servings">{recipe.servings} servings</span>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground text-sm md:text-base" data-testid="text-modal-description">
          {recipe.description}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-base md:text-lg mb-3">Ingredients</h3>
        <ul className="space-y-2" data-testid="list-modal-ingredients">
          {recipe.ingredients.map((ingredient, index) => (
            <li 
              key={index}
              className="flex items-center gap-2 text-sm md:text-base"
              data-testid={`ingredient-modal-${index}`}
            >
              <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
              <span className="flex-1">{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-base md:text-lg mb-3">Instructions</h3>
        <ol className="space-y-3" data-testid="list-modal-instructions">
          {recipe.instructions.map((instruction, index) => (
            <li 
              key={index}
              className="flex gap-3 text-sm md:text-base"
              data-testid={`instruction-modal-${index}`}
            >
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <span className="flex-1 leading-relaxed">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  // Render mobile drawer or desktop dialog based on screen size
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[95vh]" data-testid="modal-recipe-details">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-base font-semibold truncate" data-testid="text-modal-recipe-title">
                {recipe.title}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  data-testid="button-close-modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-4 pb-4">
            {recipeContent}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]" data-testid="modal-recipe-details">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span data-testid="text-modal-recipe-title">{recipe.title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          {recipeContent}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}