'use client';

import { SUPPORTED_LANGUAGES } from '@/types';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export function LanguageSelector({ value, onChange, label, className = '' }: LanguageSelectorProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 border-2 border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
}
