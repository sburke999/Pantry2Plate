import React, { useState } from 'react';
import { Recipe } from '../data/recipes';

interface ShareModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ recipe, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-[#ffffff] rounded-2xl p-5 shadow-2xl border border-[#dbc1bb]/40 text-[#1c1c18]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#f0eee8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8c3d2b] text-[22px]">menu_book</span>
            <h3 className="font-serif text-[19px] font-semibold text-[#1c1c18]">Share Recipe</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#55433e] hover:bg-[#f0eee8] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 flex gap-3 items-center p-2.5 rounded-xl bg-[#f6f3ed]">
          <img 
            src={recipe.heroImage} 
            alt={recipe.title} 
            className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c3d2b] block">
              {recipe.series} • {recipe.seriesNumber}
            </span>
            <p className="font-serif text-[14px] font-medium text-[#1c1c18] truncate leading-snug">
              {recipe.title}
            </p>
            <p className="text-[12px] text-[#55433e]">
              {recipe.totalTime} • {recipe.method}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#55433e]">
            Direct Journal Link
          </label>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f0eee8] border border-[#dbc1bb]/60">
            <span className="text-[12px] text-[#55433e] truncate flex-1 font-mono">
              {shareUrl || 'https://savor.journal/recipe/shakshuka-skillet'}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-md bg-[#8c3d2b] text-[#ffffff] text-[12px] font-semibold hover:bg-[#6e2717] transition-colors flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: recipe.title,
                  text: recipe.description,
                  url: shareUrl,
                }).catch(() => {});
              } else {
                handleCopy();
              }
            }}
            className="w-full py-2.5 px-3 rounded-lg border border-[#8c3d2b] text-[#8c3d2b] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#ffdad2]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>Device Share</span>
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="w-full py-2.5 px-3 rounded-lg bg-[#506354] text-[#ffffff] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#394b3d] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Recipe</span>
          </button>
        </div>
      </div>
    </div>
  );
};
