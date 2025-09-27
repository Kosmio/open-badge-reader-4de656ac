import { BadgeInfo } from '@/components/badge-display';

export class BadgeStorage {
  private static readonly STORAGE_KEY = 'shared-badges';
  private static readonly EXPIRY_HOURS = 24; // Les badges partagés expirent après 24h

  static saveBadge(badgeInfo: BadgeInfo): string {
    // Générer un ID unique pour ce badge
    const badgeId = this.generateBadgeId(badgeInfo);
    
    // Récupérer les badges existants
    const existingBadges = this.getAllBadges();
    
    // Ajouter le nouveau badge avec timestamp
    existingBadges[badgeId] = {
      data: badgeInfo,
      timestamp: Date.now()
    };
    
    // Nettoyer les anciens badges
    this.cleanExpiredBadges(existingBadges);
    
    // Sauvegarder
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingBadges));
    
    return badgeId;
  }

  static getBadge(badgeId: string): BadgeInfo | null {
    const badges = this.getAllBadges();
    const badgeEntry = badges[badgeId];
    
    if (!badgeEntry) return null;
    
    // Vérifier si le badge n'a pas expiré
    const isExpired = Date.now() - badgeEntry.timestamp > (this.EXPIRY_HOURS * 60 * 60 * 1000);
    if (isExpired) {
      delete badges[badgeId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(badges));
      return null;
    }
    
    return badgeEntry.data;
  }

  private static getAllBadges(): Record<string, { data: BadgeInfo; timestamp: number }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static cleanExpiredBadges(badges: Record<string, { data: BadgeInfo; timestamp: number }>) {
    const now = Date.now();
    const expireThreshold = this.EXPIRY_HOURS * 60 * 60 * 1000;
    
    Object.keys(badges).forEach(id => {
      if (now - badges[id].timestamp > expireThreshold) {
        delete badges[id];
      }
    });
  }

  private static generateBadgeId(badgeInfo: BadgeInfo): string {
    // Créer un ID basé sur le contenu du badge pour éviter les doublons
    const content = JSON.stringify({
      name: badgeInfo.badge.name,
      issuer: badgeInfo.issuer.name,
      recipient: badgeInfo.recipient.email || badgeInfo.recipient.identity,
      issuedOn: badgeInfo.issuedOn
    });
    
    // Simple hash pour créer un ID court
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }
}