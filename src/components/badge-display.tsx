import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge, BadgeStatus } from './status-badge';
import { BadgeValidator } from './badge-validator';
import { Award, User, Building, Calendar, ExternalLink, FileText } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';

export interface BadgeInfo {
  version: '2.0' | '3.0';
  status: BadgeStatus;
  badge: {
    name: string;
    description: string;
    image?: string;
    criteria: string;
    evidence?: Array<{
      name: string;
      url: string;
    }>;
  };
  issuer: {
    name: string;
    url?: string;
    email?: string;
  };
  recipient: {
    name?: string;
    email?: string;
    identity?: string;
  };
  issuedOn?: string;
  expiresOn?: string;
  rawJson: any;
}

interface BadgeDisplayProps {
  badgeInfo: BadgeInfo;
}

export function BadgeDisplay({ badgeInfo }: BadgeDisplayProps) {
  const { t, language } = useTranslation();
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('badgeDisplay.notSpecified');
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-elevation">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            {badgeInfo.badge.image ? (
              <img
                src={badgeInfo.badge.image}
                alt={badgeInfo.badge.name || t('badgeDisplay.badgeNameFallback')}
                className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg shadow-elevation animate-float"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-primary rounded-lg flex items-center justify-center animate-float">
                <Award className="h-12 w-12 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-0">
                {badgeInfo.badge.name || t('badgeDisplay.badgeNameFallback')}
              </h1>
              <StatusBadge status={badgeInfo.status} />
            </div>

            <p className="text-muted-foreground mb-4">
              {badgeInfo.badge.description}
            </p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline">{t('badgeDisplay.versionLabel', { version: badgeInfo.version })}</Badge>
              {badgeInfo.issuer.name && (
                <Badge variant="secondary">
                  <Building className="mr-1 h-3 w-3" />
                  {badgeInfo.issuer.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">{t('badgeDisplay.tabs.summary')}</TabsTrigger>
          <TabsTrigger value="details">{t('badgeDisplay.tabs.details')}</TabsTrigger>
          <TabsTrigger value="validation">{t('badgeDisplay.tabs.validation')}</TabsTrigger>
          <TabsTrigger value="json">{t('badgeDisplay.tabs.json')}</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('badgeDisplay.recipient.title')}</h3>
              </div>
              <div className="space-y-1 text-sm">
                {badgeInfo.recipient.name && (
                  <p><span className="font-medium">{t('badgeDisplay.recipient.name')}</span> {badgeInfo.recipient.name}</p>
                )}
                {badgeInfo.recipient.email && (
                  <p><span className="font-medium">{t('badgeDisplay.recipient.email')}</span> {badgeInfo.recipient.email}</p>
                )}
                {badgeInfo.recipient.identity && (
                  <p><span className="font-medium">{t('badgeDisplay.recipient.identity')}</span> {badgeInfo.recipient.identity}</p>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('badgeDisplay.issuer.title')}</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">{t('badgeDisplay.issuer.name')}</span> {badgeInfo.issuer.name || t('badgeDisplay.issuer.unknown')}</p>
                {badgeInfo.issuer.url && (
                  <a
                    href={badgeInfo.issuer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary-glow transition-smooth"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    {t('badgeDisplay.issuer.website')}
                  </a>
                )}
                {badgeInfo.issuer.email && (
                  <p><span className="font-medium">{t('badgeDisplay.issuer.email')}</span> {badgeInfo.issuer.email}</p>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('badgeDisplay.dates.title')}</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">{t('badgeDisplay.dates.issued')}</span> {formatDate(badgeInfo.issuedOn)}</p>
                <p><span className="font-medium">{t('badgeDisplay.dates.expires')}</span> {formatDate(badgeInfo.expiresOn)}</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              {t('badgeDisplay.criteria.title')}
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {typeof badgeInfo.badge.criteria === 'string'
                ? badgeInfo.badge.criteria
                : t('badgeDisplay.criteria.empty')}
            </p>
          </Card>

          {badgeInfo.badge.evidence && badgeInfo.badge.evidence.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                {t('badgeDisplay.evidence.title')}
              </h3>
              <div className="space-y-2">
                {badgeInfo.badge.evidence.map((evidence, index) => (
                  <a
                    key={index}
                    href={evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary-glow transition-smooth"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {evidence.name || t('badgeDisplay.evidence.itemFallback', { index: index + 1 })}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="validation">
          <BadgeValidator badgeInfo={badgeInfo} />
        </TabsContent>

        <TabsContent value="json">
          <Card className="p-6">
            <pre className="text-xs overflow-auto bg-muted p-4 rounded-lg max-h-96">
              {JSON.stringify(badgeInfo.rawJson, null, 2)}
            </pre>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
