import React from 'react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { Language } from '@/i18n/translations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LanguageSwitcher() {
  const { language, setLanguage, t, availableLanguages } = useTranslation();

  return (
    <div className="fixed top-4 right-4 z-50 w-40">
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger
          aria-label={t('language.switcher.label')}
          className="bg-card/80 backdrop-blur border border-border text-sm"
        >
          <SelectValue placeholder={t('language.switcher.label')} />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {t(`language.${lang}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
