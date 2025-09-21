import { useState, useEffect } from 'react';
import { Settings, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface AffiliatePreferences {
  showAds: boolean;
  showInRecipes: boolean;
  showInMealPlans: boolean;
  showInIngredients: boolean;
  maxAdsPerPage: number;
}

const DEFAULT_PREFERENCES: AffiliatePreferences = {
  showAds: true,
  showInRecipes: true,
  showInMealPlans: true,
  showInIngredients: false,
  maxAdsPerPage: 2,
};

export default function AffiliateSettings() {
  const [preferences, setPreferences] = useState<AffiliatePreferences>(DEFAULT_PREFERENCES);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('affiliatePreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        setPreferences(DEFAULT_PREFERENCES);
      }
    }
  }, []);

  const savePreferences = (newPrefs: AffiliatePreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem('affiliatePreferences', JSON.stringify(newPrefs));

    // Update the simple flag for backward compatibility
    localStorage.setItem('hideAffiliateAds', (!newPrefs.showAds).toString());
  };

  const handleToggle = (field: keyof AffiliatePreferences) => {
    const newPrefs = { ...preferences, [field]: !preferences[field] };

    // If turning off main toggle, turn off all sub-toggles
    if (field === 'showAds' && !newPrefs.showAds) {
      newPrefs.showInRecipes = false;
      newPrefs.showInMealPlans = false;
      newPrefs.showInIngredients = false;
    }

    // If turning on a sub-toggle, ensure main toggle is on
    if (['showInRecipes', 'showInMealPlans', 'showInIngredients'].includes(field) && newPrefs[field]) {
      newPrefs.showAds = true;
    }

    savePreferences(newPrefs);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-9 w-9"
        aria-label="Affiliate settings"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Recommendations</DialogTitle>
            <DialogDescription>
              Control how and where you see product recommendations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="show-ads" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Show recommendations</div>
                  <div className="text-xs text-muted-foreground">
                    Display helpful product suggestions
                  </div>
                </div>
              </Label>
              <Switch
                id="show-ads"
                checked={preferences.showAds}
                onCheckedChange={() => handleToggle('showAds')}
              />
            </div>

            {preferences.showAds && (
              <div className="space-y-3 pl-4 border-l-2 border-border">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-recipes" className="flex-1 cursor-pointer">
                    <div>
                      <div className="text-sm">In recipe cards</div>
                      <div className="text-xs text-muted-foreground">
                        Show relevant tools and ingredients
                      </div>
                    </div>
                  </Label>
                  <Switch
                    id="show-recipes"
                    checked={preferences.showInRecipes}
                    onCheckedChange={() => handleToggle('showInRecipes')}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-meal-plans" className="flex-1 cursor-pointer">
                    <div>
                      <div className="text-sm">In meal plans</div>
                      <div className="text-xs text-muted-foreground">
                        Show meal prep essentials
                      </div>
                    </div>
                  </Label>
                  <Switch
                    id="show-meal-plans"
                    checked={preferences.showInMealPlans}
                    onCheckedChange={() => handleToggle('showInMealPlans')}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-ingredients" className="flex-1 cursor-pointer">
                    <div>
                      <div className="text-sm">In ingredients list</div>
                      <div className="text-xs text-muted-foreground">
                        Suggest missing ingredients
                      </div>
                    </div>
                  </Label>
                  <Switch
                    id="show-ingredients"
                    checked={preferences.showInIngredients}
                    onCheckedChange={() => handleToggle('showInIngredients')}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="max-ads" className="flex-1">
                    <div>
                      <div className="text-sm">Max per page</div>
                      <div className="text-xs text-muted-foreground">
                        Limit recommendations shown
                      </div>
                    </div>
                  </Label>
                  <select
                    id="max-ads"
                    className="w-20 px-2 py-1 text-sm border rounded-md bg-background"
                    value={preferences.maxAdsPerPage}
                    onChange={(e) => savePreferences({
                      ...preferences,
                      maxAdsPerPage: parseInt(e.target.value)
                    })}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
            )}

            <Card className="bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Affiliate Disclosure</p>
                    <p>
                      ReceiptChef earns small commissions from purchases made through our
                      partner links. This helps keep the app free while providing you with
                      quality recommendations. Your privacy is protected and no personal
                      data is shared with partners.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                savePreferences(DEFAULT_PREFERENCES);
                setIsOpen(false);
              }}
            >
              Reset to defaults
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}