import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../data/recipes';
import { soundFx } from '../utils/audio';
import { DifficultyBadge } from './DifficultyBadge';

interface RecipeDetailViewProps {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (recipeId: string) => void;
  onOpenCookMode: (stepIndex: number) => void;
  onOpenShare: () => void;
  onPantryBadgeClick: () => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  isSaved,
  onToggleSave,
  onOpenCookMode,
  onOpenShare: _onOpenShare,
  onPantryBadgeClick,
}) => {
  // Servings multiplier (1, 2, or 4 plates)
  const [servings, setServings] = useState<number>(recipe.baseServings);
  
  // Ingredient checklist state
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Method steps accordion state (step 1 is expanded initially, or active step)
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  // Current active step for the bottom cook assistant
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Timers state for each step
  const [stepTimers, setStepTimers] = useState<Record<number, { remaining: number; running: boolean }>>({
    1: { remaining: 300, running: false },
    3: { remaining: 360, running: false },
  });

  const timerIntervals = useRef<Record<number, number | null>>({});

  // Cooking notes state
  const [cookingNotes, setCookingNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showNotesForm, setShowNotesForm] = useState(false);

  // Reset checked ingredients when recipe changes
  useEffect(() => {
    setCheckedIngredients({});
    setServings(recipe.baseServings);
    setActiveStepIndex(0);
    setExpandedSteps({ 1: true, 2: false, 3: false });
  }, [recipe.id, recipe.baseServings]);

  // Handle countdown intervals for active timers
  useEffect(() => {
    Object.entries(stepTimers).forEach(([stepStr, state]) => {
      const stepNum = Number(stepStr);
      if (state.running && state.remaining > 0) {
        if (!timerIntervals.current[stepNum]) {
          timerIntervals.current[stepNum] = window.setInterval(() => {
            setStepTimers((prev) => {
              const current = prev[stepNum];
              if (!current || !current.running) return prev;
              if (current.remaining <= 1) {
                if (timerIntervals.current[stepNum]) {
                  clearInterval(timerIntervals.current[stepNum]!);
                  timerIntervals.current[stepNum] = null;
                }
                soundFx.playTimerChime();
                return {
                  ...prev,
                  [stepNum]: { remaining: 0, running: false },
                };
              }
              return {
                ...prev,
                [stepNum]: { ...current, remaining: current.remaining - 1 },
              };
            });
          }, 1000);
        }
      } else if (!state.running && timerIntervals.current[stepNum]) {
        clearInterval(timerIntervals.current[stepNum]!);
        timerIntervals.current[stepNum] = null;
      }
    });

    return () => {
      Object.values(timerIntervals.current).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, [stepTimers]);

  const toggleTimer = (stepNum: number, defaultDuration: number) => {
    soundFx.playTactileClick();
    setStepTimers((prev) => {
      const current = prev[stepNum] || { remaining: defaultDuration, running: false };
      if (current.remaining === 0) {
        return {
          ...prev,
          [stepNum]: { remaining: defaultDuration, running: true },
        };
      }
      return {
        ...prev,
        [stepNum]: { ...current, running: !current.running },
      };
    });
  };

  const resetTimer = (stepNum: number, defaultDuration: number) => {
    soundFx.playTactileClick();
    if (timerIntervals.current[stepNum]) {
      clearInterval(timerIntervals.current[stepNum]!);
      timerIntervals.current[stepNum] = null;
    }
    setStepTimers((prev) => ({
      ...prev,
      [stepNum]: { remaining: defaultDuration, running: false },
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleStepAccordion = (stepNum: number) => {
    soundFx.playTactileClick();
    setExpandedSteps((prev) => {
      const willOpen = !prev[stepNum];
      if (willOpen) {
        setActiveStepIndex(stepNum - 1);
      }
      return {
        ...prev,
        [stepNum]: willOpen,
      };
    });
  };

  const navigateStep = (delta: number) => {
    const next = activeStepIndex + delta;
    if (next >= 0 && next < recipe.steps.length) {
      soundFx.playTactileClick();
      setActiveStepIndex(next);
      setExpandedSteps((prev) => ({
        ...prev,
        [next + 1]: true,
      }));
      // Scroll to step card
      const el = document.getElementById(`step-card-${next + 1}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const toggleIngredient = (id: string) => {
    soundFx.playTactileClick();
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalIngredients = recipe.ingredients.length;
  const checkedCount = recipe.ingredients.filter((ing) => checkedIngredients[ing.id]).length;
  const isAllChecked = checkedCount === totalIngredients && totalIngredients > 0;

  // Servings calculation helper
  const scaleQty = (baseQty: number | string) => {
    if (typeof baseQty !== 'number') return baseQty;
    const factor = servings / recipe.baseServings;
    const scaled = baseQty * factor;
    // Format nicely: e.g. 1.5, 2, 0.75
    return scaled % 1 === 0 ? scaled : scaled.toFixed(1).replace(/\.0$/, '');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      setCookingNotes([...cookingNotes, newNote.trim()]);
      setNewNote('');
      setShowNotesForm(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto pb-safe">
      {/* Recipe Hero Visual */}
      <div className="relative w-full overflow-hidden bg-[#f6f3ed]">
        <div className="relative w-full h-72 sm:h-84 md:h-96 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            src={recipe.heroImage}
            alt={recipe.altText || recipe.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f3] via-[#fcf9f3]/40 to-transparent"></div>

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            <button
              onClick={onPantryBadgeClick}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d0e5d2] text-[#546758] font-bold text-[10px] uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">eco</span>
              <span>{recipe.matchPercentage}% Pantry Match</span>
            </button>
            <DifficultyBadge difficulty={recipe.difficulty} size="sm" />
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fcf9f3]/95 text-[#6e2717] font-bold text-[10px] uppercase tracking-wider shadow-sm backdrop-blur-xs">
              <span className="material-symbols-outlined text-[14px]">counter_3</span>
              <span>{recipe.totalSteps} Steps</span>
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="absolute bottom-4 right-4">
            <button
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark recipe'}
              onClick={() => {
                soundFx.playTactileClick();
                onToggleSave(recipe.id);
              }}
              className="w-10 h-10 rounded-full bg-[#ffffff] text-[#8c3d2b] shadow-md flex items-center justify-center transition-transform active:scale-90 hover:shadow-lg"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isSaved ? 'text-[#8c3d2b]' : 'text-[#88726d]'
                }`}
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                {isSaved ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>
        </div>

        {/* Editorial Title & Intro */}
        <div className="px-4 pt-2 pb-5">
          {recipe.source === 'photo-generated' && (
            <div className="mb-3 px-3.5 py-2 rounded-xl bg-[#ffdad2]/60 border border-[#8c3d2b]/25 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8c3d2b] text-[18px]">
                  auto_awesome
                </span>
                <span className="text-xs font-semibold text-[#8c3d2b]">
                  Recipe crafted from {recipe.createdFromPhotoTitle || 'pantry photo'}
                </span>
              </div>
              {onPantryBadgeClick && (
                <button
                  onClick={onPantryBadgeClick}
                  className="text-[11px] text-[#8c3d2b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Pantry</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-[#8c3d2b] font-bold text-[10px] uppercase tracking-wider mb-1">
            <span>{recipe.series}</span>
            <span>•</span>
            <span>{recipe.seriesNumber}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1c18] font-medium leading-tight">
            {recipe.title}
          </h2>

          <p className="mt-2 text-sm text-[#55433e] leading-relaxed">
            {recipe.description}
          </p>

          {/* Cooking Meta Bento Strip with Interactive Servings Scaler */}
          <div className="mt-4 grid grid-cols-3 gap-2 bg-[#ffffff] p-3 rounded-xl shadow-xs border border-[#dbc1bb]/30">
            <div className="flex flex-col items-center justify-center text-center py-1">
              <span className="material-symbols-outlined text-[#8c3d2b] text-[20px] mb-1">
                timer
              </span>
              <span className="text-[10px] uppercase font-bold text-[#55433e] tracking-wider">
                Total Time
              </span>
              <span className="text-sm font-semibold text-[#1c1c18] mt-0.5 font-mono">
                {recipe.totalTime}
              </span>
            </div>

            {/* Interactive Servings Adjuster */}
            <div className="flex flex-col items-center justify-center text-center py-1 border-x border-[#f0eee8]">
              <span className="material-symbols-outlined text-[#506354] text-[20px] mb-1">
                restaurant
              </span>
              <span className="text-[10px] uppercase font-bold text-[#55433e] tracking-wider">
                Servings
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-5 h-5 rounded flex items-center justify-center bg-[#f0eee8] text-[#1c1c18] hover:bg-[#ebe8e2] text-xs font-bold active:scale-95"
                  title="Decrease servings"
                >
                  -
                </button>
                <span className="text-sm font-semibold text-[#1c1c18] min-w-[50px]">
                  {servings} {recipe.servingUnit}
                </span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-5 h-5 rounded flex items-center justify-center bg-[#f0eee8] text-[#1c1c18] hover:bg-[#ebe8e2] text-xs font-bold active:scale-95"
                  title="Increase servings"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-1">
              <span className="material-symbols-outlined text-[#5e3400] text-[20px] mb-1">
                skillet
              </span>
              <span className="text-[10px] uppercase font-bold text-[#55433e] tracking-wider">
                Method
              </span>
              <span className="text-sm font-semibold text-[#1c1c18] mt-0.5 truncate max-w-full px-1">
                {recipe.method}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-4 py-4 flex flex-col gap-6">
        {/* Interactive Ingredient Prep Checklist */}
        <div className="bg-[#ffffff] rounded-xl p-4 shadow-xs border border-[#dbc1bb]/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8c3d2b]"></span>
              <h3 className="font-serif text-lg font-semibold text-[#1c1c18]">Mise en Place</h3>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition-colors ${
                isAllChecked
                  ? 'bg-[#d0e5d2] text-[#546758]'
                  : 'bg-[#ebe8e2] text-[#55433e]'
              }`}
            >
              {isAllChecked ? '✓ All Prepped!' : `${checkedCount}/${totalIngredients} Checked`}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {recipe.ingredients.map((ing) => {
              const isChecked = !!checkedIngredients[ing.id];
              const qtyDisplay = scaleQty(ing.baseQty);

              return (
                <label
                  key={ing.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#f6f3ed] hover:bg-[#f0eee8] cursor-pointer transition-colors select-none group border border-transparent hover:border-[#dbc1bb]/40"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleIngredient(ing.id)}
                      className="w-5 h-5 rounded-md accent-[#8c3d2b] text-[#ffffff] cursor-pointer"
                    />
                    <span
                      className={`text-sm text-[#1c1c18] transition-all ${
                        isChecked ? 'line-through text-[#88726d] opacity-60' : 'font-medium'
                      }`}
                    >
                      {qtyDisplay ? `${qtyDisplay} ` : ''}
                      {ing.unit ? `${ing.unit} ` : ''}
                      {ing.name}
                    </span>
                  </div>

                  {ing.note && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        ing.badgeColor === 'secondary'
                          ? 'text-[#506354] bg-[#d3e8d5]'
                          : ing.badgeColor === 'primary'
                          ? 'text-[#6e2717] bg-[#ffdad2]'
                          : 'text-[#55433e] bg-[#ebe8e2]'
                      }`}
                    >
                      {ing.note}
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {/* Kitchen Staples Used Pill Strip */}
          {recipe.pantryBasics && recipe.pantryBasics.length > 0 && (
            <div className="mt-4 pt-3 bg-[#f6f3ed] p-2.5 rounded-lg flex items-center gap-2 flex-wrap">
              <span className="material-symbols-outlined text-[#88726d] text-[18px]">shelves</span>
              <span className="text-[10px] font-bold text-[#55433e] uppercase tracking-wide">
                Pantry Basics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recipe.pantryBasics.map((staple, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full bg-[#fcf9f3] text-xs text-[#1c1c18] border border-[#dbc1bb]/30"
                  >
                    {staple}
                  </span>
                ))}
              </div>
            </div>
          )}

          {onPantryBadgeClick && (
            <button
              onClick={onPantryBadgeClick}
              className="mt-3 w-full py-2 px-3.5 rounded-xl bg-[#fcf9f3] hover:bg-[#f6f3ed] text-[#8c3d2b] border border-[#dbc1bb]/50 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Check ingredients with your fridge & pantry photos</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Chef's Pro Tip Card */}
        {recipe.chefTipTitle && (
          <div className="bg-[#ffdcbf]/40 rounded-xl p-4 flex gap-3 shadow-xs border border-[#feb874]/40 relative overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#7c490e] text-[#ffbd7e] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div className="flex flex-col pr-1">
              <h4 className="font-serif text-[17px] font-semibold text-[#5e3400] leading-tight">
                {recipe.chefTipTitle}
              </h4>
              <p className="mt-1 text-xs text-[#55433e] leading-relaxed">
                {recipe.chefTipDescription}
              </p>
            </div>
          </div>
        )}

        {/* Step-by-Step Cooking Walkthrough (Accordion & Timer) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-[#1c1c18]">The Method</h3>
            <span className="text-[10px] font-bold text-[#506354] bg-[#d3e8d5] px-2 py-0.5 rounded-md uppercase tracking-wider">
              Active Cooking
            </span>
          </div>

          {recipe.steps.map((step) => {
            const isExpanded = !!expandedSteps[step.number];
            const timerState = stepTimers[step.number] || {
              remaining: step.timerSeconds || 0,
              running: false,
            };

            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className={`step-card rounded-xl p-4 transition-all duration-200 border border-[#dbc1bb]/30 ${
                  isExpanded
                    ? 'bg-[#ffffff] shadow-sm'
                    : 'bg-[#ffffff]/80 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Step Header Accordion Trigger */}
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleStepAccordion(step.number)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isExpanded
                          ? 'bg-[#6e2717] text-[#ffffff]'
                          : 'bg-[#ebe8e2] text-[#1c1c18]'
                      }`}
                    >
                      {step.number}
                    </span>
                    <div>
                      <h4 className="font-serif text-[17px] font-semibold text-[#1c1c18]">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-[#55433e]">{step.subtext}</p>
                    </div>
                  </div>
                  <button
                    aria-label={isExpanded ? 'Collapse step' : 'Expand step'}
                    className="w-8 h-8 rounded-full bg-[#f6f3ed] flex items-center justify-center text-[#55433e] hover:bg-[#ebe8e2] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {/* Step Collapsible Content */}
                {isExpanded && (
                  <div className="mt-3 flex flex-col gap-3 animate-in fade-in duration-200">
                    <p className="text-sm text-[#1c1c18] leading-relaxed">
                      {step.description}
                    </p>

                    {/* Visual Step Thumbnail */}
                    {step.image && (
                      <div className="w-full h-36 rounded-lg overflow-hidden relative shadow-xs">
                        <img
                          className="w-full h-full object-cover"
                          src={step.image}
                          alt={step.title}
                        />
                      </div>
                    )}

                    {/* Built-in Interactive Timer Pill */}
                    {step.timerSeconds && (
                      <div className="bg-[#f6f3ed] rounded-lg p-3 flex items-center justify-between border border-[#dbc1bb]/20">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[#8c3d2b] text-[20px]">
                            {timerState.running ? 'hourglass_top' : 'timer'}
                          </span>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#55433e]">
                              {step.timerLabel || 'Timer'}
                            </span>
                            <span className="font-mono text-base font-bold text-[#1c1c18] tracking-wider tabular-nums">
                              {timerState.remaining > 0
                                ? formatTime(timerState.remaining)
                                : 'Done!'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              toggleTimer(step.number, step.timerSeconds || 300)
                            }
                            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all ${
                              timerState.running
                                ? 'bg-[#7c490e] text-[#ffbd7e]'
                                : 'bg-[#8c3d2b] text-[#ffffff] hover:bg-[#6e2717]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {timerState.running ? 'pause' : 'play_arrow'}
                            </span>
                            <span>
                              {timerState.running
                                ? 'Pause'
                                : timerState.remaining === 0
                                ? 'Restart'
                                : `Start ${Math.round(step.timerSeconds / 60)}m`}
                            </span>
                          </button>

                          {timerState.remaining !== step.timerSeconds && (
                            <button
                              onClick={() =>
                                resetTimer(step.number, step.timerSeconds || 300)
                              }
                              className="w-8 h-8 rounded-lg bg-[#ebe8e2] text-[#55433e] hover:bg-[#dbc1bb] flex items-center justify-center text-xs"
                              title="Reset timer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                restart_alt
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Plating Ritual Note */}
        {recipe.platingRitual && (
          <div className="p-4 rounded-xl bg-[#f0eee8] flex items-center gap-3 border border-[#dbc1bb]/40">
            <span className="material-symbols-outlined text-[#506354] text-[24px]">
              soup_kitchen
            </span>
            <div className="flex-1">
              <p className="font-serif text-[17px] font-semibold text-[#1c1c18]">
                Plating Ritual
              </p>
              <p className="text-xs text-[#55433e] mt-0.5 leading-relaxed">
                {recipe.platingRitual}
              </p>
            </div>
          </div>
        )}

        {/* Chef's Personal Notes Section */}
        <div className="bg-[#ffffff] rounded-xl p-4 shadow-xs border border-[#dbc1bb]/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8c3d2b] text-[18px]">edit_note</span>
              <h4 className="font-serif text-[17px] font-semibold text-[#1c1c18]">
                Cook's Journal Notes
              </h4>
            </div>
            <button
              onClick={() => setShowNotesForm(!showNotesForm)}
              className="text-xs font-semibold text-[#8c3d2b] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {showNotesForm ? 'close' : 'add'}
              </span>
              <span>{showNotesForm ? 'Cancel' : 'Add Note'}</span>
            </button>
          </div>

          {showNotesForm && (
            <form onSubmit={handleAddNote} className="mb-3 flex flex-col gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Added a sprinkle of smoked paprika, paired with sourdough rye..."
                className="w-full p-2.5 rounded-lg bg-[#f6f3ed] border border-[#dbc1bb] text-xs text-[#1c1c18] focus:outline-none focus:ring-1 focus:ring-[#8c3d2b] resize-none h-20"
              />
              <button
                type="submit"
                className="self-end px-3 py-1.5 rounded-md bg-[#8c3d2b] text-[#ffffff] text-xs font-semibold hover:bg-[#6e2717]"
              >
                Save Note
              </button>
            </form>
          )}

          {cookingNotes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {cookingNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#f6f3ed] text-xs text-[#1c1c18] border-l-2 border-[#8c3d2b]"
                >
                  {note}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#88726d] italic">
              No journal notes yet. Record oven adjustments or spice tweaks for your next cook!
            </p>
          )}
        </div>

        {/* Padding spacer for sticky bottom action bar */}
        <div className="h-28"></div>
      </div>

      {/* Floating Tactile Hands-Free Cook Mode Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#fcf9f3]/95 backdrop-blur-md p-3 px-4 shadow-[0_-4px_16px_rgba(74,45,36,0.08)] border-t border-[#dbc1bb]/30">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          {/* Active Step Progress Indicator */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-[#55433e] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#506354] animate-pulse"></span>
              <span>
                Cooking Step <strong className="text-[#1c1c18]">{activeStepIndex + 1}</strong> of{' '}
                {recipe.steps.length}
              </span>
            </span>
            <span className="text-[10px] text-[#8c3d2b] uppercase font-bold tracking-wider">
              Cook Assistant
            </span>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-2">
            {/* Step Back */}
            <button
              aria-label="Previous Step"
              disabled={activeStepIndex === 0}
              onClick={() => navigateStep(-1)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                activeStepIndex === 0
                  ? 'bg-[#f0eee8] text-[#88726d]/40 cursor-not-allowed'
                  : 'bg-[#f0eee8] text-[#1c1c18] hover:bg-[#ebe8e2] active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
            </button>

            {/* Primary Action: Hands-free Voice Mode */}
            <button
              onClick={() => onOpenCookMode(activeStepIndex)}
              className="flex-1 h-12 rounded-lg bg-[#8c3d2b] text-[#ffffff] flex items-center justify-center gap-2 px-3 shadow-md active:scale-[0.99] hover:bg-[#6e2717] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-current rounded-full animate-bounce"></span>
                <span className="w-1 h-5 bg-current rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1 h-2.5 bg-current rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
              <span className="text-sm font-semibold tracking-wide">
                Hands-Free Cook Mode
              </span>
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                mic
              </span>
            </button>

            {/* Step Forward */}
            <button
              aria-label="Next Step"
              disabled={activeStepIndex === recipe.steps.length - 1}
              onClick={() => navigateStep(1)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                activeStepIndex === recipe.steps.length - 1
                  ? 'bg-[#f0eee8] text-[#88726d]/40 cursor-not-allowed'
                  : 'bg-[#f0eee8] text-[#1c1c18] hover:bg-[#ebe8e2] active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
