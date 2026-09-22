import { useState, useEffect } from 'react';
import { SAVOR_RECIPES, Recipe } from './data/recipes';
import { Header } from './components/Header';
import { RecipeDetailView } from './components/RecipeDetailView';
import { JournalCatalogView } from './components/JournalCatalogView';
import { PantryView } from './components/PantryView';
import { SavedCookbookView } from './components/SavedCookbookView';
import { HandsFreeCookModeModal } from './components/HandsFreeCookModeModal';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';
import { soundFx } from './utils/audio';

export default function App() {
  // Navigation tabs: 'recipe' | 'catalog' | 'pantry' | 'saved'
  const [currentTab, setCurrentTab] = useState<'recipe' | 'catalog' | 'pantry' | 'saved'>('recipe');

  // All recipes (built-in monograph + user generated recipes from photos)
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem('savor_custom_recipes');
      if (stored) {
        const custom: Recipe[] = JSON.parse(stored);
        const customIds = new Set(custom.map((c) => c.id));
        const defaultFiltered = SAVOR_RECIPES.filter((r) => !customIds.has(r.id));
        return [...custom, ...defaultFiltered];
      }
    } catch {
      // fallback
    }
    return SAVOR_RECIPES;
  });

  // Currently viewed recipe (defaults to the flagship Shakshuka)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(allRecipes[0] || SAVOR_RECIPES[0]);

  // Saved / bookmarked recipe IDs
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('savor_saved_recipes');
      return stored ? JSON.parse(stored) : ['shakshuka-skillet'];
    } catch {
      return ['shakshuka-skillet'];
    }
  });

  // Selected pantry staples (defaults so Shakshuka has 100% pantry match initially)
  const [selectedPantryItems, setSelectedPantryItems] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('savor_pantry_items');
      return stored
        ? JSON.parse(stored)
        : ['Eggs', 'Cherry Tomatoes', 'Bell Pepper', 'Olive Oil', 'Rosemary', 'Sourdough'];
    } catch {
      return ['Eggs', 'Cherry Tomatoes', 'Bell Pepper', 'Olive Oil', 'Rosemary', 'Sourdough'];
    }
  });

  // Hands-free cook mode modal state
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [cookModeInitialStep, setCookModeInitialStep] = useState(0);

  // Share modal state
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; icon?: string } | null>(null);

  const showToast = (message: string, icon = 'info') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 2400);
  };

  // Sync saved recipes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savor_saved_recipes', JSON.stringify(savedRecipeIds));
    } catch {
      // ignore
    }
  }, [savedRecipeIds]);

  // Sync pantry items with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savor_pantry_items', JSON.stringify(selectedPantryItems));
    } catch {
      // ignore
    }
  }, [selectedPantryItems]);

  const toggleSaveRecipe = (recipeId: string) => {
    soundFx.playTactileClick();
    if (savedRecipeIds.includes(recipeId)) {
      setSavedRecipeIds(savedRecipeIds.filter((id) => id !== recipeId));
      showToast('Removed from saved recipes', 'bookmark_remove');
    } else {
      setSavedRecipeIds([...savedRecipeIds, recipeId]);
      showToast('Saved to your Cookbook!', 'bookmark_added');
    }
  };

  const togglePantryItem = (item: string) => {
    soundFx.playTactileClick();
    if (selectedPantryItems.includes(item)) {
      setSelectedPantryItems(selectedPantryItems.filter((i) => i !== item));
    } else {
      setSelectedPantryItems([...selectedPantryItems, item]);
    }
  };

  const handleAddPantryItems = (newItems: string[]) => {
    setSelectedPantryItems((prev) => {
      const combined = Array.from(new Set([...prev, ...newItems]));
      return combined;
    });
  };

  const handleClearPantryItems = () => {
    soundFx.playTactileClick();
    setSelectedPantryItems([]);
    showToast('Pantry items cleared', 'delete');
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    soundFx.playTactileClick();
    setSelectedRecipe(recipe);
    setCurrentTab('recipe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCookMode = (stepIndex: number) => {
    soundFx.playTactileClick();
    setCookModeInitialStep(stepIndex);
    setIsCookModeOpen(true);
  };

  const handleAddGeneratedRecipe = (newRecipe: Recipe) => {
    setAllRecipes((prev) => {
      const filtered = prev.filter((r) => r.id !== newRecipe.id);
      const updated = [newRecipe, ...filtered];
      try {
        const customOnly = updated.filter((r) => r.source === 'photo-generated');
        localStorage.setItem('savor_custom_recipes', JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return updated;
    });

    // Auto-save this crafted recipe into user bookmarks
    setSavedRecipeIds((prev) => (prev.includes(newRecipe.id) ? prev : [newRecipe.id, ...prev]));

    // Navigate directly to the recipe detail view
    setSelectedRecipe(newRecipe);
    setCurrentTab('recipe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Created: ${newRecipe.title}`, 'soup_kitchen');
  };

  // Dynamic header title based on current screen
  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'recipe':
        return 'Recipe Detail';
      case 'catalog':
        return 'Culinary Journal';
      case 'pantry':
        return 'Pantry Matcher';
      case 'saved':
        return 'Cookbook';
      default:
        return 'Recipe Detail';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18] font-sans antialiased flex flex-col selection:bg-[#ffdad2] selection:text-[#3d0600]">
      {/* Toast Feedback */}
      <Toast message={toast?.message ?? null} icon={toast?.icon} />

      {/* Header */}
      <Header
        title={getHeaderTitle()}
        showBack={currentTab === 'recipe'}
        onBack={() => {
          soundFx.playTactileClick();
          setCurrentTab('catalog');
        }}
        onOpenShare={() => setIsShareOpen(true)}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          soundFx.playTactileClick();
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedRecipeIds.length}
      />

      {/* Main Content Area */}
      <main className="flex flex-col relative w-full pt-16 flex-1">
        {currentTab === 'recipe' && (
          <RecipeDetailView
            recipe={selectedRecipe}
            isSaved={savedRecipeIds.includes(selectedRecipe.id)}
            onToggleSave={toggleSaveRecipe}
            onOpenCookMode={handleOpenCookMode}
            onOpenShare={() => setIsShareOpen(true)}
            onPantryBadgeClick={() => setCurrentTab('pantry')}
          />
        )}

        {currentTab === 'catalog' && (
          <JournalCatalogView
            recipes={allRecipes}
            onSelectRecipe={handleSelectRecipe}
            savedRecipeIds={savedRecipeIds}
            onToggleSave={toggleSaveRecipe}
          />
        )}

        {currentTab === 'pantry' && (
          <PantryView
            selectedPantryItems={selectedPantryItems}
            onTogglePantryItem={togglePantryItem}
            onAddPantryItems={handleAddPantryItems}
            onClearPantryItems={handleClearPantryItems}
            recipes={allRecipes}
            onSelectRecipe={handleSelectRecipe}
            onNotification={showToast}
            onRecipeGenerated={handleAddGeneratedRecipe}
          />
        )}

        {currentTab === 'saved' && (
          <SavedCookbookView
            savedRecipeIds={savedRecipeIds}
            recipes={allRecipes}
            onSelectRecipe={handleSelectRecipe}
            onToggleSave={toggleSaveRecipe}
            onExploreJournal={() => setCurrentTab('catalog')}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar for non-recipe views or quick access */}
      {currentTab !== 'recipe' && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#ffffff]/90 backdrop-blur-md border-t border-[#dbc1bb]/40 shadow-lg md:hidden">
          <div className="grid grid-cols-4 items-center h-16 pb-safe">
            <button
              onClick={() => {
                soundFx.playTactileClick();
                setCurrentTab('recipe');
              }}
              className="flex flex-col items-center justify-center h-full transition-colors text-[#88726d] hover:text-[#8c3d2b]"
            >
              <span className="material-symbols-outlined text-[20px]">skillet</span>
              <span className="text-[10px] font-semibold mt-0.5">Recipe</span>
            </button>

            <button
              onClick={() => {
                soundFx.playTactileClick();
                setCurrentTab('catalog');
              }}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                currentTab === 'catalog' ? 'text-[#8c3d2b]' : 'text-[#88726d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              <span className="text-[10px] font-semibold mt-0.5">Journal</span>
            </button>

            <button
              onClick={() => {
                soundFx.playTactileClick();
                setCurrentTab('pantry');
              }}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                currentTab === 'pantry' ? 'text-[#8c3d2b]' : 'text-[#88726d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">kitchen</span>
              <span className="text-[10px] font-semibold mt-0.5">Pantry</span>
            </button>

            <button
              onClick={() => {
                soundFx.playTactileClick();
                setCurrentTab('saved');
              }}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                currentTab === 'saved' ? 'text-[#8c3d2b]' : 'text-[#88726d]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: currentTab === 'saved' ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                bookmark
              </span>
              <span className="text-[10px] font-semibold mt-0.5">Cookbook</span>
            </button>
          </div>
        </div>
      )}

      {/* Hands-Free Voice Cook Mode Fullscreen Modal */}
      <HandsFreeCookModeModal
        recipe={selectedRecipe}
        initialStepIndex={cookModeInitialStep}
        isOpen={isCookModeOpen}
        onClose={() => setIsCookModeOpen(false)}
        onStepChange={(newStepIndex) => setCookModeInitialStep(newStepIndex)}
      />

      {/* Share Modal */}
      <ShareModal
        recipe={selectedRecipe}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
