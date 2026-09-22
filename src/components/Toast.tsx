import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'info' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1c1c18] text-[#fcf9f3] text-xs font-semibold shadow-xl flex items-center gap-2 border border-[#55433e] animate-in fade-in slide-in-from-top-2 duration-150">
      <span className="material-symbols-outlined text-[16px] text-[#ffdad2]">
        {icon}
      </span>
      <span>{message}</span>
    </div>
  );
};
