import React, { useState } from 'react';
import { Recipe, DifficultyLevel } from '../data/recipes';
import { DifficultyBadge } from './DifficultyBadge';

interface JournalCatalogViewProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
}

export const JournalCatalogView: React.FC<JournalCatalogViewProps> = ({
  recipes,
  onSelectRecipe,
  savedRecipeIds,
  onToggleSave,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');

  const hasPhotoRecipes = recipes.some((r) => r.source === 'photo-generated');
  const categories = hasPhotoRecipes
    ? ['All', 'From Photos', 'Skillet', 'Pasta', 'Seafood', 'Baking']
    : ['All', 'Skillet', 'Pasta', 'Seafood', 'Baking'];
  const difficultyOptions: ('All' | DifficultyLevel)[] = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (activeCategory === 'From Photos'
        ? recipe.source === 'photo-generated'
        : recipe.category === activeCategory);
    const matchesDifficulty =
      activeDifficulty === 'All' || recipe.difficulty === activeDifficulty;
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-6 pb-28 gap-6 animate-in fade-in duration-200">
      {/* Editorial Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#8c3d2b] font-bold text-xs uppercase tracking-widest">
          <span>Savor Culinary Monograph</span>
          <span>•</span>
          <span>Autumn Edition</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1c1c18] leading-tight">
          The Kitchen Journal
        </h2>
        <p className="text-sm text-[#55433e] max-w-xl leading-relaxed">
          Tactile, intentional recipes crafted for cast-iron skillets, heavy bronze pans, and wood-fired tables. Rooted in seasonal pantry staples and slow technique.
        </p>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col gap-3">
        {/* Search input */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-3 text-[#88726d] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ingredient, difficulty (Easy, Medium, Hard), or title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#ffffff] border border-[#dbc1bb]/50 text-sm text-[#1c1c18] placeholder-[#88726d] focus:outline-none focus:ring-1 focus:ring-[#8c3d2b] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#88726d] hover:text-[#1c1c18]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category Pills (Functional filter buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors select-none ${
                activeCategory === cat
                  ? 'bg-[#8c3d2b] text-[#ffffff] shadow-xs'
                  : 'bg-[#ffffff] text-[#55433e] hover:bg-[#f6f3ed] border border-[#dbc1bb]/40'
              }`}
            >
              {cat === 'All' ? 'All Editions' : `${cat} Series`}
            </button>
          ))}
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#88726d] mr-1 shrink-0">
            Difficulty:
          </span>
          {difficultyOptions.map((diff) => {
            const isSelected = activeDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all select-none ${
                  isSelected
                    ? 'bg-[#1c1c18] text-[#ffffff] shadow-xs'
                    : 'bg-[#ffffff] text-[#55433e] hover:bg-[#f6f3ed] border border-[#dbc1bb]/40'
                }`}
              >
                {diff === 'Easy' && <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />}
                {diff === 'Medium' && <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />}
                {diff === 'Hard' && <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />}
                <span>{diff === 'All' ? 'All Levels' : diff}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Recipe Hero Card (if All is selected and no search) */}
      {activeCategory === 'All' && activeDifficulty === 'All' && !searchQuery && (
        <div
          onClick={() => onSelectRecipe(recipes[0])}
          className="relative rounded-2xl overflow-hidden bg-[#ffffff] border border-[#dbc1bb]/40 shadow-sm cursor-pointer group"
        >
          <div className="relative h-64 sm:h-72 w-full overflow-hidden">
            <img
              src={recipes[0].heroImage}
              alt={recipes[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c18]/90 via-[#1c1c18]/30 to-transparent"></div>

            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#d0e5d2] text-[#546758] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                ★ Editor's Feature
              </span>
              <DifficultyBadge difficulty={recipes[0].difficulty} size="md" />
              <span className="px-2.5 py-1 rounded-full bg-[#ffffff]/90 text-[#6e2717] text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                {recipes[0].matchPercentage}% Pantry Match
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-[#ffffff]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffbaaa] block mb-1">
                {recipes[0].series} • {recipes[0].seriesNumber}
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#ffffff] leading-tight mb-1">
                {recipes[0].title}
              </h3>
              <p className="text-xs text-[#dbc1bb] line-clamp-2">
                {recipes[0].description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-[#f3f0ea]">
                <span>{recipes[0].totalTime}</span>
                <span>•</span>
                <span>{recipes[0].method}</span>
                <span>•</span>
                <DifficultyBadge difficulty={recipes[0].difficulty} size="xs" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => {
          const isSaved = savedRecipeIds.includes(recipe.id);

          return (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>

                  {/* Top Left Badges: Difficulty Badge + Total Time + Match */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap max-w-[calc(100%-3.5rem)]">
                    <DifficultyBadge difficulty={recipe.difficulty} size="sm" />
                    {recipe.source === 'photo-generated' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#8c3d2b] text-[10px] font-bold shadow-2xs">
                        <span className="material-symbols-outlined text-[12px]">soup_kitchen</span>
                        <span>Photo Recipe</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-[#ffffff]/90 text-[#1c1c18] text-[10px] font-bold shadow-2xs backdrop-blur-xs">
                      {recipe.totalTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#d0e5d2] text-[#546758] text-[10px] font-bold shadow-2xs">
                      {recipe.matchPercentage}% Match
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(recipe.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#ffffff]/90 hover:bg-[#ffffff] text-[#8c3d2b] flex items-center justify-center shadow-xs transition-transform active:scale-90"
                    aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isSaved ? 'text-[#8c3d2b]' : 'text-[#88726d]'
                      }`}
                      style={{
                        fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>

                  <div className="absolute bottom-2 left-3 text-white text-xs font-semibold flex items-center gap-2">
                    <span>{recipe.method}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c3d2b] truncate">
                      {recipe.series} • {recipe.seriesNumber}
                    </span>
                    <DifficultyBadge difficulty={recipe.difficulty} size="xs" />
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-[#1c1c18] leading-tight group-hover:text-[#8c3d2b] transition-colors">
                    {recipe.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#55433e] line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 border-t border-[#f0eee8] flex items-center justify-between text-xs text-[#55433e]">
                <span>{recipe.ingredients.length} Ingredients</span>
                <button
                  onClick={() => onSelectRecipe(recipe)}
                  className="text-[#8c3d2b] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Open Recipe</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 bg-[#ffffff] rounded-2xl border border-[#dbc1bb]/30 p-6">
          <span className="material-symbols-outlined text-4xl text-[#88726d] mb-2">
            menu_book
          </span>
          <h3 className="font-serif text-lg font-semibold text-[#1c1c18]">
            No Journal Entries Found
          </h3>
          <p className="text-xs text-[#55433e] mt-1">
            Try adjusting your search query, category, or difficulty level.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
              setActiveDifficulty('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-[#8c3d2b] text-[#ffffff] text-xs font-semibold hover:bg-[#6e2717]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
