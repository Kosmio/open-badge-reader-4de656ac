import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgeInfo } from './badge-display';
import { useTranslation } from '@/i18n/LanguageProvider';

interface ValidationRule {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail' | 'info';
  message: string;
  details?: string;
}

interface BadgeValidatorProps {
  badgeInfo: BadgeInfo;
}

export function BadgeValidator({ badgeInfo }: BadgeValidatorProps) {
  const { t } = useTranslation();

  const validateBadge = (): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    if (badgeInfo.version === '2.0' || badgeInfo.version === '3.0') {
      rules.push({
        id: 'version',
        name: t('badgeValidator.rules.version.name'),
        status: 'pass',
        message: t('badgeValidator.rules.version.detected', { version: badgeInfo.version }),
        details: t('badgeValidator.rules.version.details', { version: badgeInfo.version })
      });
    } else {
      rules.push({
        id: 'version',
        name: t('badgeValidator.rules.version.name'),
        status: 'warning',
        message: t('badgeValidator.rules.version.unknown'),
        details: t('badgeValidator.rules.version.unknownDetails')
      });
    }

    if (badgeInfo.badge.name && badgeInfo.badge.name.trim()) {
      rules.push({
        id: 'name',
        name: t('badgeValidator.rules.name.name'),
        status: 'pass',
        message: t('badgeValidator.rules.name.present')
      });
    } else {
      rules.push({
        id: 'name',
        name: t('badgeValidator.rules.name.name'),
        status: 'fail',
        message: t('badgeValidator.rules.name.missing')
      });
    }

    if (badgeInfo.issuer.name && badgeInfo.issuer.name.trim()) {
      rules.push({
        id: 'issuer',
        name: t('badgeValidator.rules.issuer.name'),
        status: 'pass',
        message: t('badgeValidator.rules.issuer.present')
      });
    } else {
      rules.push({
        id: 'issuer',
        name: t('badgeValidator.rules.issuer.name'),
        status: 'fail',
        message: t('badgeValidator.rules.issuer.missing')
      });
    }

    if (badgeInfo.recipient.email || badgeInfo.recipient.name || badgeInfo.recipient.identity) {
      rules.push({
        id: 'recipient',
        name: t('badgeValidator.rules.recipient.name'),
        status: 'pass',
        message: t('badgeValidator.rules.recipient.present')
      });
    } else {
      rules.push({
        id: 'recipient',
        name: t('badgeValidator.rules.recipient.name'),
        status: 'warning',
        message: t('badgeValidator.rules.recipient.limited'),
        details: t('badgeValidator.rules.recipient.details')
      });
    }

    if (badgeInfo.badge.criteria && badgeInfo.badge.criteria.trim()) {
      rules.push({
        id: 'criteria',
        name: t('badgeValidator.rules.criteria.name'),
        status: 'pass',
        message: t('badgeValidator.rules.criteria.present')
      });
    } else {
      rules.push({
        id: 'criteria',
        name: t('badgeValidator.rules.criteria.name'),
        status: 'warning',
        message: t('badgeValidator.rules.criteria.missing')
      });
    }

    if (badgeInfo.issuedOn) {
      const issuedDate = new Date(badgeInfo.issuedOn);
      const now = new Date();

      if (issuedDate <= now) {
        rules.push({
          id: 'issued_date',
          name: t('badgeValidator.rules.issuedDate.name'),
          status: 'pass',
          message: t('badgeValidator.rules.issuedDate.valid')
        });
      } else {
        rules.push({
          id: 'issued_date',
          name: t('badgeValidator.rules.issuedDate.name'),
          status: 'fail',
          message: t('badgeValidator.rules.issuedDate.future')
        });
      }
    } else {
      rules.push({
        id: 'issued_date',
        name: t('badgeValidator.rules.issuedDate.name'),
        status: 'info',
        message: t('badgeValidator.rules.issuedDate.missing')
      });
    }

    if (badgeInfo.expiresOn) {
      const expiryDate = new Date(badgeInfo.expiresOn);
      const now = new Date();

      if (expiryDate > now) {
        rules.push({
          id: 'expiry_date',
          name: t('badgeValidator.rules.expiryDate.name'),
          status: 'pass',
          message: t('badgeValidator.rules.expiryDate.valid')
        });
      } else {
        rules.push({
          id: 'expiry_date',
          name: t('badgeValidator.rules.expiryDate.name'),
          status: 'warning',
          message: t('badgeValidator.rules.expiryDate.expired')
        });
      }
    } else {
      rules.push({
        id: 'expiry_date',
        name: t('badgeValidator.rules.expiryDate.name'),
        status: 'info',
        message: t('badgeValidator.rules.expiryDate.permanent')
      });
    }

    if (badgeInfo.badge.evidence && badgeInfo.badge.evidence.length > 0) {
      rules.push({
        id: 'evidence',
        name: t('badgeValidator.rules.evidence.name'),
        status: 'pass',
        message: t('badgeValidator.rules.evidence.available', { count: badgeInfo.badge.evidence.length })
      });
    } else {
      rules.push({
        id: 'evidence',
        name: t('badgeValidator.rules.evidence.name'),
        status: 'info',
        message: t('badgeValidator.rules.evidence.none')
      });
    }

    return rules;
  };

  const rules = validateBadge();
  const passCount = rules.filter(r => r.status === 'pass').length;
  const warningCount = rules.filter(r => r.status === 'warning').length;
  const failCount = rules.filter(r => r.status === 'fail').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'info':
        return <Info className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'fail':
        return 'bg-destructive/10 border-destructive/20';
      case 'info':
        return 'bg-muted/50 border-muted';
      default:
        return 'bg-muted/50 border-muted';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('badgeValidator.title')}</h3>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
            ✓ {passCount}
          </Badge>
          {warningCount > 0 && (
            <Badge variant="outline" className="bg-warning/10 border-warning/20 text-warning">
              ⚠ {warningCount}
            </Badge>
          )}
          {failCount > 0 && (
            <Badge variant="outline" className="bg-destructive/10 border-destructive/20 text-destructive">
              ✗ {failCount}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-lg border transition-smooth ${getStatusColor(rule.status)}`}
          >
            <div className="flex items-start space-x-3">
              {getStatusIcon(rule.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{rule.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{rule.message}</p>
                {rule.details && (
                  <p className="text-xs text-foreground/80 mt-1">{rule.details}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <h4 className="font-medium text-sm flex items-center">
          <Info className="mr-2 h-4 w-4 text-accent" />
          {t('badgeValidator.summary.title')}
        </h4>
        <p className="text-sm text-foreground/90 mt-1">
          {failCount > 0 ? (
            t('badgeValidator.summary.fail', { count: failCount })
          ) : warningCount > 0 ? (
            t('badgeValidator.summary.warning', { count: warningCount })
          ) : (
            t('badgeValidator.summary.success')
          )}
        </p>
      </div>
    </Card>
  );
}
