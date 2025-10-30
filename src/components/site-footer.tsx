import React from 'react';
import { Shield, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/i18n/LanguageProvider';

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="py-8 px-4 border-t bg-card/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold">{t('app.name')}</span>
            <span className="text-muted-foreground">{t('app.by')}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/Kosmio/open-badge-reader-4de656ac"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  {t('app.github')}
                </a>
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('index.footer.license')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">🌐</span>
              <LanguageSwitcher className="bg-background/80" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
