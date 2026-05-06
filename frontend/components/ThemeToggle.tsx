"use client";

type Props = {
  isDark: boolean;
  onToggle: () => void;
};

export function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 dark:border-white dark:bg-[#1b1c1c] dark:text-slate-100 dark:hover:bg-[#252626]"
      aria-label="Toggle theme"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
