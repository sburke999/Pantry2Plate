import React, { useState } from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  onOpenShare: () => void;
  currentTab: 'recipe' | 'catalog' | 'pantry' | 'saved';
  onSelectTab: (tab: 'recipe' | 'catalog' | 'pantry' | 'saved') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  showBack = false,
  onOpenShare,
  currentTab,
  onSelectTab,
  savedCount,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#fcf9f3]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(74,45,36,0.04)] pt-safe transition-all">
      <div className="max-w-3xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Left Side: Back / Logo / Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <button
              aria-label="Go back"
              className="w-11 h-11 -ml-1.5 flex items-center justify-center text-[#1c1c18] hover:text-[#6e2717] transition-colors rounded-xl active:bg-[#f0eee8]"
              onClick={onBack}
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <button
              aria-label="Home"
              className="w-11 h-11 -ml-1.5 flex items-center justify-center text-[#1c1c18] hover:text-[#6e2717] transition-colors rounded-xl"
              onClick={() => onSelectTab('catalog')}
            >
              <span className="material-symbols-outlined text-[22px]">restaurant_menu</span>
            </button>
          )}

          <img
            alt="Savor Pantry Logo"
            className="h-7 w-auto object-contain flex-shrink-0 hidden sm:block cursor-pointer"
            onClick={() => onSelectTab('catalog')}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFw-0kMzlGvXINhgGAakIAIBwn5B_3EbOgUS_zperCHqBqpetm7Zzfyf-4sBaF8vfpCcO7OVhQKU4F2614r4OtssIW9RhsUQMucR-z0tOddwwCFjaozcYMBtJuuuFufR3bX0DdQPbV9fux-QeVHkk6-e7-pEButwPa1pagVyHcc7HXG_EzU0vJT2JKw0iQpr-F9LSUf3wsIiRPkoA51yF8p1I8lWnma4A-DTnALfFWivarMsd_-t8_"
          />

          <h1 className="font-serif text-[19px] font-semibold text-[#1c1c18] truncate leading-tight">
            {title}
          </h1>
        </div>

        {/* Center / Navigation Bar for Larger screens & Quick switches */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f0eee8] p-1 rounded-xl">
          <button
            onClick={() => onSelectTab('recipe')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              currentTab === 'recipe'
                ? 'bg-[#ffffff] text-[#1c1c18] shadow-xs'
                : 'text-[#55433e] hover:text-[#1c1c18]'
            }`}
          >
            Recipe Detail
          </button>
          <button
            onClick={() => onSelectTab('catalog')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              currentTab === 'catalog'
                ? 'bg-[#ffffff] text-[#1c1c18] shadow-xs'
                : 'text-[#55433e] hover:text-[#1c1c18]'
            }`}
          >
            Culinary Journal
          </button>
          <button
            onClick={() => onSelectTab('pantry')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              currentTab === 'pantry'
                ? 'bg-[#ffffff] text-[#1c1c18] shadow-xs'
                : 'text-[#55433e] hover:text-[#1c1c18]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#506354]">kitchen</span>
            <span>Pantry Match</span>
          </button>
          <button
            onClick={() => onSelectTab('saved')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              currentTab === 'saved'
                ? 'bg-[#ffffff] text-[#1c1c18] shadow-xs'
                : 'text-[#55433e] hover:text-[#1c1c18]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#8c3d2b]">bookmark</span>
            <span>Cookbook ({savedCount})</span>
          </button>
        </nav>

        {/* Right Side: Share & Profile */}
        <div className="flex items-center gap-1 flex-shrink-0 relative">
          <button
            aria-label="Share recipe"
            onClick={onOpenShare}
            className="w-11 h-11 flex items-center justify-center text-[#55433e] hover:text-[#6e2717] hover:bg-[#f0eee8] transition-colors rounded-xl"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>

          <button
            aria-label="View Profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#8c3d2b]/20 transition-all"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_1px_4px_rgba(74,45,36,0.12)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTTDAOSy4gd1EdVuNZ_hpJhYLiC-0rO6Qj3rRPuaqLfAOdd99FLIj-ZGFHlK_oOeN18i9Bd-CZd3Smpre1MCLtKJHN5YhrH99if9oHc5y0EH7BAlsLy15-KoPmIA4rL2uZh8n0sSMZvppQObDkcNW8AfUwoncaZkyz0pPbyHbXLspGotGvyVKDCaJgFFJsNDFuWwJGn9jnu5DQSmB8H7cAOzti-WBY-KGg_NftZSlJMl_PwE-ZHT9g"
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-14 right-0 w-60 bg-[#ffffff] rounded-xl shadow-xl border border-[#dbc1bb]/40 p-3 z-50 text-[#1c1c18] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f0eee8]">
                <img
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTTDAOSy4gd1EdVuNZ_hpJhYLiC-0rO6Qj3rRPuaqLfAOdd99FLIj-ZGFHlK_oOeN18i9Bd-CZd3Smpre1MCLtKJHN5YhrH99if9oHc5y0EH7BAlsLy15-KoPmIA4rL2uZh8n0sSMZvppQObDkcNW8AfUwoncaZkyz0pPbyHbXLspGotGvyVKDCaJgFFJsNDFuWwJGn9jnu5DQSmB8H7cAOzti-WBY-KGg_NftZSlJMl_PwE-ZHT9g"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-[#1c1c18] truncate">Chef Sam Burke</p>
                  <p className="text-[11px] text-[#55433e]">Artisanal Kitchen</p>
                </div>
              </div>
              <div className="pt-2 flex flex-col gap-1 text-xs">
                <button
                  onClick={() => {
                    onSelectTab('saved');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-[#f6f3ed] flex items-center justify-between text-[#1c1c18]"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#8c3d2b]">bookmark</span>
                    <span>Saved Recipes</span>
                  </span>
                  <span className="bg-[#ffdad2] text-[#3d0600] text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {savedCount}
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('pantry');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-[#f6f3ed] flex items-center gap-2 text-[#1c1c18]"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#506354]">shelves</span>
                  <span>My Kitchen Pantry</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('catalog');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-[#f6f3ed] flex items-center gap-2 text-[#1c1c18]"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#5e3400]">auto_stories</span>
                  <span>All Journal Editions</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
