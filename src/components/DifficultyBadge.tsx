import React from 'react';
import { DifficultyLevel } from '../data/recipes';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'sm',
  showIcon = true,
  className = '',
}) => {
  const getBadgeStyle = (level: DifficultyLevel) => {
    switch (level) {
      case 'Easy':
        return {
          container: 'bg-[#d8edd9] text-[#1c4724] border-[#a3d4a7]/90',
          dot: 'bg-[#2e7d32]',
          icon: 'eco',
          label: 'Easy',
        };
      case 'Medium':
        return {
          container: 'bg-[#fef3c7] text-[#854d0e] border-[#fde047]/90',
          dot: 'bg-[#d97706]',
          icon: 'speed',
          label: 'Medium',
        };
      case 'Hard':
        return {
          container: 'bg-[#ffdad2] text-[#801908] border-[#f8aba0]/90',
          dot: 'bg-[#dc2626]',
          icon: 'local_fire_department',
          label: 'Hard',
        };
    }
  };

  const config = getBadgeStyle(difficulty);

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-[11px] gap-1.5',
  }[size];

  const iconSizes = {
    xs: 'text-[11px]',
    sm: 'text-[13px]',
    md: 'text-[14px]',
  }[size];

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border shadow-2xs backdrop-blur-xs select-none transition-transform ${config.container} ${sizeClasses} ${className}`}
      title={`Difficulty: ${config.label}`}
    >
      {showIcon ? (
        <span className={`material-symbols-outlined ${iconSizes} leading-none`}>
          {config.icon}
        </span>
      ) : (
        <span className={`rounded-full shrink-0 ${dotSizes} ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
