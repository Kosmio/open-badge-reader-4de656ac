import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgeInfo } from './badge-display';

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
  const validateBadge = (): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // Version validation
    if (badgeInfo.version === '2.0' || badgeInfo.version === '3.0') {
      rules.push({
        id: 'version',
        name: 'Version Open Badge',
        status: 'pass',
        message: `Version ${badgeInfo.version} détectée`,
        details: `Ce badge utilise la spécification Open Badge ${badgeInfo.version}`
      });
    } else {
      rules.push({
        id: 'version',
        name: 'Version Open Badge',
        status: 'warning',
        message: 'Version non reconnue',
        details: 'La version du badge ne correspond pas aux standards Open Badge connus'
      });
    }

    // Required fields validation
    if (badgeInfo.badge.name && badgeInfo.badge.name.trim()) {
      rules.push({
        id: 'name',
        name: 'Nom du badge',
        status: 'pass',
        message: 'Nom présent et valide'
      });
    } else {
      rules.push({
        id: 'name',
        name: 'Nom du badge',
        status: 'fail',
        message: 'Nom manquant ou vide'
      });
    }

    // Issuer validation
    if (badgeInfo.issuer.name && badgeInfo.issuer.name.trim()) {
      rules.push({
        id: 'issuer',
        name: 'Émetteur',
        status: 'pass',
        message: 'Informations émetteur présentes'
      });
    } else {
      rules.push({
        id: 'issuer',
        name: 'Émetteur',
        status: 'fail',
        message: 'Informations émetteur manquantes'
      });
    }

    // Recipient validation
    if (badgeInfo.recipient.email || badgeInfo.recipient.name || badgeInfo.recipient.identity) {
      rules.push({
        id: 'recipient',
        name: 'Bénéficiaire',
        status: 'pass',
        message: 'Informations bénéficiaire présentes'
      });
    } else {
      rules.push({
        id: 'recipient',
        name: 'Bénéficiaire',
        status: 'warning',
        message: 'Informations bénéficiaire limitées',
        details: 'Aucune information d\'identification du bénéficiaire trouvée'
      });
    }

    // Criteria validation
    if (badgeInfo.badge.criteria && badgeInfo.badge.criteria.trim()) {
      rules.push({
        id: 'criteria',
        name: 'Critères',
        status: 'pass',
        message: 'Critères d\'obtention définis'
      });
    } else {
      rules.push({
        id: 'criteria',
        name: 'Critères',
        status: 'warning',
        message: 'Critères d\'obtention manquants'
      });
    }

    // Date validation
    if (badgeInfo.issuedOn) {
      const issuedDate = new Date(badgeInfo.issuedOn);
      const now = new Date();
      
      if (issuedDate <= now) {
        rules.push({
          id: 'issued_date',
          name: 'Date d\'émission',
          status: 'pass',
          message: 'Date d\'émission valide'
        });
      } else {
        rules.push({
          id: 'issued_date',
          name: 'Date d\'émission',
          status: 'fail',
          message: 'Date d\'émission dans le futur'
        });
      }
    } else {
      rules.push({
        id: 'issued_date',
        name: 'Date d\'émission',
        status: 'info',
        message: 'Date d\'émission non spécifiée'
      });
    }

    // Expiration validation
    if (badgeInfo.expiresOn) {
      const expiryDate = new Date(badgeInfo.expiresOn);
      const now = new Date();
      
      if (expiryDate > now) {
        rules.push({
          id: 'expiry_date',
          name: 'Date d\'expiration',
          status: 'pass',
          message: 'Badge encore valide'
        });
      } else {
        rules.push({
          id: 'expiry_date',
          name: 'Date d\'expiration',
          status: 'warning',
          message: 'Badge expiré'
        });
      }
    } else {
      rules.push({
        id: 'expiry_date',
        name: 'Date d\'expiration',
        status: 'info',
        message: 'Pas de date d\'expiration (badge permanent)'
      });
    }

    // Evidence validation
    if (badgeInfo.badge.evidence && badgeInfo.badge.evidence.length > 0) {
      rules.push({
        id: 'evidence',
        name: 'Preuves',
        status: 'pass',
        message: `${badgeInfo.badge.evidence.length} preuve(s) disponible(s)`
      });
    } else {
      rules.push({
        id: 'evidence',
        name: 'Preuves',
        status: 'info',
        message: 'Aucune preuve fournie'
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
        <h3 className="text-lg font-semibold">Rapport de validation</h3>
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
          Résumé de validation
        </h4>
        <p className="text-sm text-foreground/90 mt-1">
          {failCount > 0 ? (
            `Ce badge présente ${failCount} erreur(s) critique(s) qui peuvent affecter sa validité.`
          ) : warningCount > 0 ? (
            `Ce badge est globalement valide mais présente ${warningCount} avertissement(s) à considérer.`
          ) : (
            'Ce badge respecte tous les critères de validation et semble parfaitement conforme.'
          )}
        </p>
      </div>
    </Card>
  );
}