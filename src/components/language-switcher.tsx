import React from 'react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { Language } from '@/i18n/translations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

const languageFlags: Record<Language, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage, t, availableLanguages } = useTranslation();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger
        aria-label={t('language.switcher.label')}
        className={cn('w-[160px] bg-card border border-border text-sm', className)}
      >
        <SelectValue placeholder={t('language.switcher.label')} />
      </SelectTrigger>
      <SelectContent align="end">
        {availableLanguages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{languageFlags[lang]}</span>
              <span>{t(`language.${lang}`)}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
