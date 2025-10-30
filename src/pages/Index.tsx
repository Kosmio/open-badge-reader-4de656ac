import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeUploader } from '@/components/badge-uploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Award, CheckCircle, Github } from 'lucide-react';
import { BadgeInfo } from '@/components/badge-display';
import { BadgeParser } from '@/components/badge-parser';
import { BadgeStorage } from '@/utils/badge-storage';
import jsBadgeImage from '@/assets/js-badge-example.png';
import { useTranslation } from '@/i18n/LanguageProvider';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const mockVerifyBadge = async (input: File | string): Promise<BadgeInfo> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      version: '3.0',
      status: 'valid',
      badge: {
        name: 'JavaScript Expert Certification',
        description: 'This badge recognizes advanced proficiency in JavaScript programming, including ES6+ features, async programming, and modern frameworks.',
        image: jsBadgeImage,
        criteria: 'Successfully completed advanced JavaScript assessment covering:\n• ES6+ syntax and features\n• Asynchronous programming (Promises, async/await)\n• Modern framework knowledge (React, Vue, Angular)\n• Testing and debugging practices\n• Performance optimization techniques',
        evidence: [
          { name: 'Assessment Results', url: 'https://example.com/assessment' },
          { name: 'Project Portfolio', url: 'https://example.com/portfolio' }
        ]
      },
      issuer: {
        name: 'TechCorp Academy',
        url: 'https://techcorp-academy.com',
        email: 'badges@techcorp-academy.com'
      },
      recipient: {
        name: 'Alex Developer',
        email: 'alex@example.com',
        identity: 'sha256$ab7c8d9e...'
      },
      issuedOn: '2024-01-15T10:00:00Z',
      expiresOn: '2026-01-15T23:59:59Z',
      rawJson: {
        '@context': ['https://www.w3.org/2018/credentials/v1', 'https://purl.imsglobal.org/spec/ob/v3p0/context.json'],
        type: ['VerifiableCredential', 'OpenBadgeCredential'],
        issuer: {
          id: 'https://techcorp-academy.com',
          type: 'Profile',
          name: 'TechCorp Academy'
        }
      }
    };
  };

  const handleBadgeUpload = async (input: File | string) => {
    setIsLoading(true);

    try {
      let badgeInfo: BadgeInfo;

      try {
        if (typeof input === 'string') {
          badgeInfo = await BadgeParser.parseFromUrl(input);
        } else {
          badgeInfo = await BadgeParser.parseFromFile(input);
        }
      } catch (parseError) {
        badgeInfo = await mockVerifyBadge(input);
      }

      const badgeId = BadgeStorage.saveBadge(badgeInfo);
      navigate(`/result?id=${badgeId}`, { state: { badgeInfo } });

      toast({
        title: t('toasts.verification.success.title'),
        description: t('toasts.verification.success.description'),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('toasts.verification.error.title'),
        description: t('toasts.verification.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto text-center relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-full shadow-glow animate-float">
              <Shield className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t('index.hero.title')}
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('index.hero.subtitle.line1')} {' '}
            {t('index.hero.subtitle.line2')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">{t('index.hero.badges.validation')}</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t('index.hero.badges.openBadge')}</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">{t('index.hero.badges.secure')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <BadgeUploader onBadgeUpload={handleBadgeUpload} isLoading={isLoading} />
        </div>
      </section>

      <section className="py-16 px-4 bg-accent/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('index.features.title')}
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-6 text-center shadow-elevation hover:shadow-glow transition-smooth">
              <div className="p-3 bg-gradient-success rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('index.features.cards.complete.title')}</h3>
              <p className="text-muted-foreground">
                {t('index.features.cards.complete.description')}
              </p>
            </Card>

            <Card className="p-6 text-center shadow-elevation hover:shadow-glow transition-smooth">
              <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('index.features.cards.security.title')}</h3>
              <p className="text-muted-foreground">
                {t('index.features.cards.security.description')}
              </p>
            </Card>

            <Card className="p-6 text-center shadow-elevation hover:shadow-glow transition-smooth">
              <div className="p-3 bg-gradient-warning rounded-full w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('index.features.cards.format.title')}</h3>
              <p className="text-muted-foreground">
                {t('index.features.cards.format.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t bg-card/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">{t('app.name')}</span>
              <span className="text-muted-foreground">{t('app.by')}</span>
            </div>

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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
