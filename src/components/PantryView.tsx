import React, { useState } from 'react';
import { Recipe, PANTRY_INGREDIENTS } from '../data/recipes';
import { DifficultyBadge } from './DifficultyBadge';
import { PantryPhotoScanner } from './PantryPhotoScanner';

interface PantryViewProps {
  selectedPantryItems: string[];
  onTogglePantryItem: (item: string) => void;
  onAddPantryItems: (items: string[]) => void;
  onClearPantryItems?: () => void;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onNotification?: (message: string, icon?: string) => void;
  onRecipeGenerated?: (recipe: Recipe) => void;
}

export const PantryView: React.FC<PantryViewProps> = ({
  selectedPantryItems,
  onTogglePantryItem,
  onAddPantryItems,
  onClearPantryItems,
  recipes,
  onSelectRecipe,
  onNotification,
  onRecipeGenerated,
}) => {
  const [activeTabSection, setActiveTabSection] = useState<'all' | 'photo' | 'manual'>('all');

  // Calculate match percentage for each recipe based on selected items
  const recipesWithMatch = recipes.map((recipe) => {
    const totalCount = recipe.ingredients.length;
    if (totalCount === 0) return { ...recipe, liveMatch: 100, missingCount: 0, missingItems: [] };

    const matchedIngredients = recipe.ingredients.filter((ing) => {
      const targetCat = (ing.pantryCategory || '').toLowerCase();
      const targetName = ing.name.toLowerCase();

      return selectedPantryItems.some((sel) => {
        const s = sel.toLowerCase();
        return (
          s === targetCat ||
          s === targetName ||
          targetName.includes(s) ||
          s.includes(targetName)
        );
      });
    });

    const missingItems = recipe.ingredients.filter(
      (ing) => !matchedIngredients.some((m) => m.id === ing.id)
    );

    const matchScore = Math.round((matchedIngredients.length / totalCount) * 100);

    return {
      ...recipe,
      liveMatch: matchScore,
      missingCount: missingItems.length,
      missingItems,
    };
  });

  // Sort by highest match
  const sortedRecipes = [...recipesWithMatch].sort((a, b) => b.liveMatch - a.liveMatch);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-6 pb-28 gap-6 animate-in fade-in duration-200">
      {/* View Section Segmented Switch */}
      <div className="flex items-center justify-between bg-[#ffffff] p-1.5 rounded-2xl border border-[#dbc1bb]/40 shadow-2xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTabSection('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all select-none ${
              activeTabSection === 'all'
                ? 'bg-[#8c3d2b] text-[#ffffff] shadow-2xs'
                : 'text-[#55433e] hover:bg-[#f6f3ed]'
            }`}
          >
            Full Inventory
          </button>
          <button
            onClick={() => setActiveTabSection('photo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none ${
              activeTabSection === 'photo'
                ? 'bg-[#8c3d2b] text-[#ffffff] shadow-2xs'
                : 'text-[#55433e] hover:bg-[#f6f3ed]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            <span>Fridge & Pantry Photos</span>
          </button>
          <button
            onClick={() => setActiveTabSection('manual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none ${
              activeTabSection === 'manual'
                ? 'bg-[#8c3d2b] text-[#ffffff] shadow-2xs'
                : 'text-[#55433e] hover:bg-[#f6f3ed]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">checklist</span>
            <span>Manual Staples</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d0e5d2] text-[#546758] text-[11px] font-bold">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          <span>{selectedPantryItems.length} Active Ingredients</span>
        </div>
      </div>

      {/* 1. Photo Submission Area (Scanner & Gallery) */}
      {(activeTabSection === 'all' || activeTabSection === 'photo') && (
        <PantryPhotoScanner
          currentPantryItems={selectedPantryItems}
          onAddPantryItems={onAddPantryItems}
          onNotification={onNotification}
          onRecipeGenerated={onRecipeGenerated}
        />
      )}

      {/* 2. Manual Checklist Banner */}
      {(activeTabSection === 'all' || activeTabSection === 'manual') && (
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#dbc1bb]/40 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#506354] mb-1">
            <span className="material-symbols-outlined text-[24px]">kitchen</span>
            <span className="text-[11px] uppercase font-bold tracking-wider">
              Pantry Staples & Produce
            </span>
          </div>
          <h3 className="font-serif text-2xl font-semibold text-[#1c1c18]">
            What's in your pantry today?
          </h3>
          <p className="mt-1 text-sm text-[#55433e]">
            Tap items you currently have in stock. Your active pantry updates recipe matches automatically so you know what can be made immediately.
          </p>

          {/* Selected count pill & quick actions */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#f0eee8]">
            <span className="text-xs text-[#55433e]">
              Selected: <strong className="text-[#1c1c18]">{selectedPantryItems.length}</strong> items in pantry
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  PANTRY_INGREDIENTS.forEach((item) => {
                    if (!selectedPantryItems.includes(item.id)) {
                      onTogglePantryItem(item.id);
                    }
                  });
                }}
                className="text-xs text-[#8c3d2b] font-semibold hover:underline"
              >
                Select All
              </button>
              {onClearPantryItems && selectedPantryItems.length > 0 && (
                <button
                  onClick={onClearPantryItems}
                  className="text-xs text-[#88726d] hover:text-[#1c1c18]"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Interactive Ingredient Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {PANTRY_INGREDIENTS.map((item) => {
              const isSelected = selectedPantryItems.some(
                (p) =>
                  p.toLowerCase() === item.id.toLowerCase() ||
                  p.toLowerCase() === item.label.toLowerCase()
              );
              return (
                <button
                  key={item.id}
                  onClick={() => onTogglePantryItem(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-[#506354] text-[#ffffff] shadow-xs ring-1 ring-[#506354]'
                      : 'bg-[#f6f3ed] text-[#1c1c18] hover:bg-[#f0eee8] border border-[#dbc1bb]/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSelected ? 'check' : item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom user items added from photos or typing */}
          {selectedPantryItems.filter(
            (p) => !PANTRY_INGREDIENTS.some((i) => i.id.toLowerCase() === p.toLowerCase())
          ).length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#f0eee8]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c3d2b] block mb-2">
                Custom & Photo-Extracted Ingredients:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPantryItems
                  .filter(
                    (p) =>
                      !PANTRY_INGREDIENTS.some((i) => i.id.toLowerCase() === p.toLowerCase())
                  )
                  .map((customItem, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#d8edd9] text-[#1c4724] border border-[#a3d4a7] text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[13px]">eco</span>
                      <span>{customItem}</span>
                      <button
                        onClick={() => onTogglePantryItem(customItem)}
                        className="text-[#1c4724] hover:text-[#801908] ml-0.5"
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matched Recipes Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8c3d2b]"></span>
            <h3 className="font-serif text-xl font-semibold text-[#1c1c18]">
              Pantry-Matched Recipes
            </h3>
          </div>
          <span className="text-xs text-[#55433e]">
            {sortedRecipes.filter((r) => r.liveMatch === 100).length} Ready to cook now
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedRecipes.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectRecipe(item)}
              className="bg-[#ffffff] rounded-xl overflow-hidden border border-[#dbc1bb]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-[#f6f3ed]">
                  <img
                    src={item.heroImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[calc(100%-1.5rem)]">
                    <DifficultyBadge difficulty={item.difficulty} size="sm" />
                    {item.source === 'photo-generated' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-[#ffdad2] text-[#8c3d2b]">
                        <span className="material-symbols-outlined text-[13px]">soup_kitchen</span>
                        <span>Photo Recipe</span>
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        item.liveMatch === 100
                          ? 'bg-[#d0e5d2] text-[#546758]'
                          : item.liveMatch >= 60
                          ? 'bg-[#ffdcbf] text-[#5e3400]'
                          : 'bg-[#ebe8e2] text-[#55433e]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {item.liveMatch === 100 ? 'verified' : 'eco'}
                      </span>
                      <span>{item.liveMatch}% Match</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 text-white text-xs font-medium">
                    {item.totalTime} • {item.method}
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c3d2b] block mb-1">
                    {item.series} • {item.seriesNumber}
                  </span>
                  <h4 className="font-serif text-lg font-semibold text-[#1c1c18] leading-tight group-hover:text-[#8c3d2b] transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-[#55433e] line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Missing ingredients status */}
              <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-[#f0eee8] text-xs">
                {item.missingCount === 0 ? (
                  <span className="text-[#506354] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>100% Complete Pantry</span>
                  </span>
                ) : (
                  <span className="text-[#88726d]">
                    Missing {item.missingCount} item{item.missingCount > 1 ? 's' : ''}:{' '}
                    <strong className="text-[#55433e]">
                      {item.missingItems.map((m) => m.name).slice(0, 2).join(', ')}
                    </strong>
                  </span>
                )}

                <span className="text-[#8c3d2b] font-semibold flex items-center text-xs group-hover:translate-x-0.5 transition-transform">
                  Cook <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
