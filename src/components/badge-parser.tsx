import { BadgeInfo } from './badge-display';

export class BadgeParser {
  static async parseFromFile(file: File): Promise<BadgeInfo> {
    const fileType = file.type;
    
    if (fileType === 'application/json') {
      return this.parseJsonFile(file);
    } else if (fileType.startsWith('image/')) {
      return this.parseImageFile(file);
    } else {
      throw new Error('Type de fichier non supporté');
    }
  }

  static async parseFromUrl(url: string): Promise<BadgeInfo> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        const json = await response.json();
        return this.parseJsonData(json, url);
      } else if (contentType.startsWith('image/')) {
        // Pour les images, on simule l'extraction de métadonnées
        return this.simulateImageParsing(url);
      } else {
        throw new Error('Type de contenu non supporté');
      }
    } catch (error) {
      throw new Error(`Impossible de charger l'URL: ${error}`);
    }
  }

  private static async parseJsonFile(file: File): Promise<BadgeInfo> {
    const text = await file.text();
    const json = JSON.parse(text);
    return this.parseJsonData(json);
  }

  private static async parseImageFile(file: File): Promise<BadgeInfo> {
    // Simulation de l'extraction de métadonnées depuis une image
    const imageUrl = URL.createObjectURL(file);
    
    // Dans une vraie implémentation, on extrairait les métadonnées EXIF ou les données JSON-LD intégrées
    return this.simulateImageParsing(imageUrl, file.name);
  }

  private static parseJsonData(json: any, source?: string): BadgeInfo {
    // Détection de la version Open Badge
    const version = this.detectVersion(json);
    
    if (version === '3.0') {
      return this.parseV3Badge(json, source);
    } else {
      return this.parseV2Badge(json, source);
    }
  }

  private static detectVersion(json: any): '2.0' | '3.0' {
    // V3 utilise des Verifiable Credentials avec @context
    if (json['@context'] && 
        (Array.isArray(json['@context']) && json['@context'].includes('https://www.w3.org/2018/credentials/v1')) ||
        json['@context'] === 'https://www.w3.org/2018/credentials/v1') {
      return '3.0';
    }
    
    // V2 utilise le format Open Badges 2.0
    return '2.0';
  }

  private static parseV2Badge(json: any, source?: string): BadgeInfo {
    const status = this.determineStatus(json);
    
    return {
      version: '2.0',
      status,
      badge: {
        name: json.badge?.name || json.name || 'Badge sans nom',
        description: json.badge?.description || json.description || '',
        image: json.badge?.image || json.image || source,
        criteria: json.badge?.criteria?.narrative || json.criteria || '',
        evidence: this.parseEvidence(json.evidence)
      },
      issuer: {
        name: json.badge?.issuer?.name || json.issuer?.name || 'Émetteur inconnu',
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
    
    return {
      version: '3.0',
      status,
      badge: {
        name: credentialSubject.achievement?.name || 'Badge sans nom',
        description: credentialSubject.achievement?.description || '',
        image: credentialSubject.achievement?.image?.id || source,
        criteria: credentialSubject.achievement?.criteria?.narrative || '',
        evidence: this.parseEvidence(credentialSubject.evidence)
      },
      issuer: {
        name: json.issuer?.name || credentialSubject.achievement?.issuer?.name || 'Émetteur inconnu',
        url: json.issuer?.url || credentialSubject.achievement?.issuer?.url,
        email: json.issuer?.email
      },
      recipient: {
        name: credentialSubject.name,
        email: credentialSubject.email,
        identity: credentialSubject.id
      },
      issuedOn: json.issuanceDate,
      expiresOn: json.expirationDate,
      rawJson: json
    };
  }

  private static parseEvidence(evidence: any): Array<{ name: string; url: string }> {
    if (!evidence) return [];
    
    if (Array.isArray(evidence)) {
      return evidence.map((item, index) => ({
        name: item.name || item.narrative || `Preuve ${index + 1}`,
        url: item.id || item.url || '#'
      }));
    }
    
    if (typeof evidence === 'object') {
      return [{
        name: evidence.name || evidence.narrative || 'Preuve',
        url: evidence.id || evidence.url || '#'
      }];
    }
    
    return [];
  }

  private static determineStatus(json: any): 'valid' | 'expired' | 'invalid' {
    // Vérification de l'expiration
    const expiryDate = json.expirationDate || json.expires;
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return 'expired';
    }
    
    // Vérification basique de la structure
    const hasRequiredFields = json.badge || json.credentialSubject;
    if (!hasRequiredFields) {
      return 'invalid';
    }
    
    return 'valid';
  }

  private static simulateImageParsing(imageUrl: string, filename?: string): BadgeInfo {
    // Simulation d'un badge extrait d'une image
    return {
      version: '2.0',
      status: 'valid',
      badge: {
        name: filename ? filename.replace(/\.[^/.]+$/, '') : 'Badge à partir d\'image',
        description: 'Badge extrait d\'un fichier image. Les métadonnées complètes ne sont pas disponibles.',
        image: imageUrl,
        criteria: 'Critères non disponibles depuis l\'image',
        evidence: []
      },
      issuer: {
        name: 'Métadonnées limitées',
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
        note: 'Badge extrait d\'une image - métadonnées limitées',
        source: imageUrl
      }
    };
  }
}