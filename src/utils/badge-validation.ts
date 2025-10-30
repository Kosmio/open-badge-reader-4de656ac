import { BadgeInfo } from '@/components/badge-display';

export type ValidationStatus = 'pass' | 'warning' | 'fail' | 'info';

export interface ValidationRule {
  id: string;
  name: string;
  status: ValidationStatus;
  message: string;
  details?: string;
}

export type TranslateFunction = (key: string, values?: Record<string, string | number>) => string;

export const createValidationRules = (badgeInfo: BadgeInfo, t: TranslateFunction): ValidationRule[] => {
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

export const getValidationSummary = (rules: ValidationRule[]) => ({
  passCount: rules.filter(rule => rule.status === 'pass').length,
  warningCount: rules.filter(rule => rule.status === 'warning').length,
  failCount: rules.filter(rule => rule.status === 'fail').length,
});
