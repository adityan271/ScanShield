import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] shrink-0 shadow-xs cursor-pointer ${className}`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
};
