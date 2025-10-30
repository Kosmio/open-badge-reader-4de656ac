import { BadgeInfo } from './badge-display';
import { DEFAULT_LANGUAGE, Language, translations } from '@/i18n/translations';

type TranslationValues = Record<string, string | number>;

const LANGUAGE_STORAGE_KEY = 'app-language';

const getActiveLanguage = (): Language => {
  if (typeof document !== 'undefined') {
    const langAttr = document.documentElement.lang as Language | undefined;
    if (langAttr && langAttr in translations) {
      return langAttr;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (stored && stored in translations) {
        return stored;
      }
    } catch {
      // Ignore storage access issues
    }
  }

  return DEFAULT_LANGUAGE;
};

const formatTemplate = (template: string, values?: TranslationValues) => {
  if (!values) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (values[key] !== undefined ? String(values[key]) : ''));
};

const translate = (key: string, values?: TranslationValues) => {
  const language = getActiveLanguage();
  const template = translations[language]?.[key] ?? translations[DEFAULT_LANGUAGE]?.[key] ?? key;
  return formatTemplate(template, values);
};

export class BadgeParserError extends Error {}

export class BadgeParser {
  static async parseFromFile(file: File): Promise<BadgeInfo> {
    const fileType = file.type;

    if (fileType === 'application/json') {
      return this.parseJsonFile(file);
    } else if (fileType.startsWith('image/')) {
      return this.parseImageFile(file);
    } else {
      throw new BadgeParserError(translate('badgeParser.errors.unsupportedFileType'));
    }
  }

  static async parseFromUrl(url: string): Promise<BadgeInfo> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new BadgeParserError(translate('badgeParser.errors.http', { status: response.status }));
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const json = await response.json();
        return this.parseJsonData(json, url);
      } else if (contentType.startsWith('image/')) {
        return this.simulateImageParsing(url);
      } else {
        throw new BadgeParserError(translate('badgeParser.errors.unsupportedContent'));
      }
    } catch (error) {
      if (error instanceof BadgeParserError) {
        throw error;
      }
      throw new BadgeParserError(translate('badgeParser.errors.url', {
        message: error instanceof Error ? error.message : String(error)
      }));
    }
  }

  private static async parseJsonFile(file: File): Promise<BadgeInfo> {
    const text = await file.text();
    const json = JSON.parse(text);
    return this.parseJsonData(json);
  }

  private static async parseImageFile(file: File): Promise<BadgeInfo> {
    const imageUrl = URL.createObjectURL(file);
    return this.simulateImageParsing(imageUrl, file.name);
  }

  private static parseJsonData(json: any, source?: string): BadgeInfo {
    const version = this.detectVersion(json);

    if (version === '3.0') {
      return this.parseV3Badge(json, source);
    }

    return this.parseV2Badge(json, source);
  }

  private static detectVersion(json: any): '2.0' | '3.0' {
    const context = json['@context'];
    if (context) {
      if (typeof context === 'string' && context.includes('spec/ob/v3p0')) {
        return '3.0';
      }
      if (Array.isArray(context) && context.some(c => typeof c === 'string' && (c.includes('spec/ob/v3p0') || c.includes('credentials/v1')))) {
        return '3.0';
      }
    }
    return '2.0';
  }

  private static parseV2Badge(json: any, source?: string): BadgeInfo {
    const status = this.determineStatus(json);

    return {
      version: '2.0',
      status,
      badge: {
        name: json.badge?.name || json.name || '',
        description: json.badge?.description || json.description || '',
        image: json.badge?.image || json.image || source,
        criteria: json.badge?.criteria?.narrative || json.criteria || '',
        evidence: this.parseEvidence(json.evidence)
      },
      issuer: {
        name: json.badge?.issuer?.name || json.issuer?.name || '',
        url: json.badge?.issuer?.url || json.issuer?.url,
        email: json.badge?.issuer?.email || json.issuer?.email
      },
      recipient: {
        name: json.recipient?.name,
        email: json.recipient?.identity,
        identity: json.recipient?.identity
      },
      issuedOn: json.issuedOn,
      expiresOn: json.expires,
      rawJson: json
    };
  }

  private static parseV3Badge(json: any, source?: string): BadgeInfo {
    const credentialSubject = json.credentialSubject || {};
    const status = this.determineStatus(json);

    const achievement = credentialSubject.achievement || json;
    const issuerData = json.issuer || achievement.issuer || {};

    let criteria = '';
    const criteriaData = achievement.criteria;
    if (typeof criteriaData === 'string') {
      criteria = criteriaData;
    } else if (criteriaData && typeof criteriaData === 'object') {
      criteria = criteriaData.narrative || criteriaData.id || '';
    }

    return {
      version: '3.0',
      status,
      badge: {
        name: achievement.name || json.name || '',
        description: achievement.description || json.description || '',
        image: achievement.image?.id || achievement.image || json.image || source,
        criteria,
        evidence: this.parseEvidence(achievement.evidence || json.evidence)
      },
      issuer: {
        name: issuerData.name || '',
        url: issuerData.url,
        email: issuerData.email
      },
      recipient: {
        name: credentialSubject.name,
        email: credentialSubject.email,
        identity: credentialSubject.id
      },
      issuedOn: json.issuanceDate || json.validFrom,
      expiresOn: json.expirationDate || json.validUntil,
      rawJson: json
    };
  }

  private static parseEvidence(evidence: any): Array<{ name: string; url: string }> {
    if (!evidence) return [];

    if (Array.isArray(evidence)) {
      return evidence.map((item) => ({
        name: item.name || item.narrative || '',
        url: item.id || item.url || '#'
      }));
    }

    if (typeof evidence === 'object') {
      return [{
        name: evidence.name || evidence.narrative || '',
        url: evidence.id || evidence.url || '#'
      }];
    }

    return [];
  }

  private static determineStatus(json: any): 'valid' | 'expired' | 'invalid' {
    const expiryDate = json.expirationDate || json.expires;
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return 'expired';
    }

    const hasRequiredFields = json.badge || json.credentialSubject;
    if (!hasRequiredFields) {
      return 'invalid';
    }

    return 'valid';
  }

  private static simulateImageParsing(imageUrl: string, filename?: string): BadgeInfo {
    return {
      version: '2.0',
      status: 'valid',
      badge: {
        name: filename ? filename.replace(/\.[^/.]+$/, '') : translate('badgeParser.simulated.name'),
        description: translate('badgeParser.simulated.description'),
        image: imageUrl,
        criteria: translate('badgeParser.simulated.criteria'),
        evidence: []
      },
      issuer: {
        name: translate('badgeParser.simulated.issuer'),
        url: undefined,
        email: undefined
      },
      recipient: {
        name: undefined,
        email: undefined,
        identity: undefined
      },
      issuedOn: undefined,
      expiresOn: undefined,
      rawJson: {
        note: translate('badgeParser.simulated.note'),
        source: imageUrl
      }
    };
  }
}
