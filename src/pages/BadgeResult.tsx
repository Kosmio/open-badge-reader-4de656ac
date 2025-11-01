import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BadgeDisplay, BadgeInfo } from '@/components/badge-display';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BadgeStorage } from '@/utils/badge-storage';
import { useTranslation } from '@/i18n/LanguageProvider';
import { SiteFooter } from '@/components/site-footer';
import { generateBadgePdfReport } from '@/utils/pdf-report';

export default function BadgeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(location.state?.badgeInfo || null);

  useEffect(() => {
    if (!badgeInfo) {
      const badgeId = searchParams.get('id');
      if (badgeId) {
        const storedBadge = BadgeStorage.getBadge(badgeId);
        if (storedBadge) {
          setBadgeInfo(storedBadge);
        }
      }
    }
  }, [badgeInfo, searchParams]);

  if (!badgeInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('badgeResult.empty.title')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('badgeResult.empty.description')}
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('badgeResult.empty.cta')}
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (!badgeInfo) return;

    const badgeId = BadgeStorage.saveBadge(badgeInfo);
    const shareUrl = `${window.location.origin}/result?id=${badgeId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('badgeResult.share.title', { badgeName: badgeInfo.badge.name }),
          text: t('badgeResult.share.text', { badgeName: badgeInfo.badge.name, issuerName: badgeInfo.issuer.name }),
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('toasts.share.copied.title'),
        description: t('toasts.share.copied.description'),
      });
    }
  };

  const handleDownloadReport = async () => {
    if (!badgeInfo) return;

    try {
      await generateBadgePdfReport({ badgeInfo, language, t });
      toast({
        title: t('badgeResult.download.success.title'),
        description: t('badgeResult.download.success.description'),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('badgeResult.download.error.title'),
        description: t('badgeResult.download.error.description'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="transition-smooth"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('badgeResult.header.back')}
              </Button>
              <h1 className="text-xl font-semibold">{t('badgeResult.header.title')}</h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="transition-smooth"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {t('badgeResult.actions.share')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                className="transition-smooth"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('badgeResult.actions.download')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <BadgeDisplay badgeInfo={badgeInfo} />
      </main>
      <SiteFooter />
    </div>
  );
}
