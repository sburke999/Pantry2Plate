import React from 'react';
import { Recipe } from '../data/recipes';
import { DifficultyBadge } from './DifficultyBadge';

interface SavedCookbookViewProps {
  savedRecipeIds: string[];
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleSave: (recipeId: string) => void;
  onExploreJournal: () => void;
}

export const SavedCookbookView: React.FC<SavedCookbookViewProps> = ({
  savedRecipeIds,
  recipes,
  onSelectRecipe,
  onToggleSave,
  onExploreJournal,
}) => {
  const savedRecipes = recipes.filter((r) => savedRecipeIds.includes(r.id));

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-6 pb-28 gap-6 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dbc1bb]/40">
        <div>
          <div className="flex items-center gap-2 text-[#8c3d2b] font-bold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">bookmark</span>
            <span>Personal Collection</span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#1c1c18] mt-1">
            My Kitchen Cookbook
          </h2>
          <p className="text-xs text-[#55433e] mt-1">
            Your bookmarked culinary editions and annotated kitchen recipes.
          </p>
        </div>
        <div className="text-right">
          <span className="font-serif text-3xl font-semibold text-[#8c3d2b]">
            {savedRecipes.length}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#55433e] block">
            Saved Dishes
          </span>
        </div>
      </div>

      {savedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-[#ffffff] rounded-xl overflow-hidden border border-[#dbc1bb]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div
                onClick={() => onSelectRecipe(recipe)}
                className="cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#f6f3ed]">
                  <img
                    src={recipe.heroImage}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap max-w-[calc(100%-3.5rem)]">
                    <DifficultyBadge difficulty={recipe.difficulty} size="sm" />
                    {recipe.source === 'photo-generated' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#8c3d2b] text-[10px] font-bold shadow-2xs">
                        <span className="material-symbols-outlined text-[12px]">soup_kitchen</span>
                        <span>Photo Recipe</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-[#ffffff]/90 text-[#1c1c18] text-[10px] font-bold">
                      {recipe.totalTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#d0e5d2] text-[#546758] text-[10px] font-bold">
                      {recipe.matchPercentage}% Match
                    </span>
                  </div>

                  {/* Remove Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(recipe.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#ffffff] text-[#8c3d2b] flex items-center justify-center shadow-xs transition-transform active:scale-90"
                    title="Remove from saved"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>

                <div className="p-4">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#8c3d2b] mb-1">
                    {recipe.series} • {recipe.seriesNumber}
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-[#1c1c18] leading-tight group-hover:text-[#8c3d2b] transition-colors">
                    {recipe.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#55433e] line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 border-t border-[#f0eee8] flex items-center justify-between text-xs text-[#55433e]">
                <span>Method: {recipe.method}</span>
                <button
                  onClick={() => onSelectRecipe(recipe)}
                  className="text-[#8c3d2b] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Start Cooking</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#ffffff] rounded-2xl border border-[#dbc1bb]/40 p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#ffdad2] text-[#8c3d2b] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
          </div>
          <h3 className="font-serif text-xl font-semibold text-[#1c1c18]">
            Your Cookbook is Empty
          </h3>
          <p className="text-xs text-[#55433e] max-w-sm mt-1 mb-5">
            Bookmark recipes from the Culinary Journal to save them to your personal kitchen collection for quick weeknight access.
          </p>
          <button
            onClick={onExploreJournal}
            className="px-5 py-2.5 rounded-xl bg-[#8c3d2b] text-[#ffffff] font-semibold text-xs hover:bg-[#6e2717] transition-all active:scale-95 shadow-xs"
          >
            Explore Journal Recipes
          </button>
        </div>
      )}
    </div>
  );
};
