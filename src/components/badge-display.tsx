import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge, BadgeStatus } from './status-badge';
import { Award, User, Building, Calendar, ExternalLink, FileText } from 'lucide-react';

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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Badge Image and Status */}
      <Card className="p-6 bg-gradient-card shadow-elevation">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Badge Image */}
          <div className="flex-shrink-0">
            {badgeInfo.badge.image ? (
              <img
                src={badgeInfo.badge.image}
                alt={badgeInfo.badge.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg shadow-elevation animate-float"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-primary rounded-lg flex items-center justify-center animate-float">
                <Award className="h-12 w-12 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Badge Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-0">
                {badgeInfo.badge.name}
              </h1>
              <StatusBadge status={badgeInfo.status} />
            </div>
            
            <p className="text-muted-foreground mb-4">
              {badgeInfo.badge.description}
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline">Open Badge {badgeInfo.version}</Badge>
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

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recipient Info */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Bénéficiaire</h3>
              </div>
              <div className="space-y-1 text-sm">
                {badgeInfo.recipient.name && (
                  <p><span className="font-medium">Nom :</span> {badgeInfo.recipient.name}</p>
                )}
                {badgeInfo.recipient.email && (
                  <p><span className="font-medium">Email :</span> {badgeInfo.recipient.email}</p>
                )}
                {badgeInfo.recipient.identity && (
                  <p><span className="font-medium">Identité :</span> {badgeInfo.recipient.identity}</p>
                )}
              </div>
            </Card>

            {/* Issuer Info */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Émetteur</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Nom :</span> {badgeInfo.issuer.name}</p>
                {badgeInfo.issuer.url && (
                  <a 
                    href={badgeInfo.issuer.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary-glow transition-smooth"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Site web
                  </a>
                )}
                {badgeInfo.issuer.email && (
                  <p><span className="font-medium">Email :</span> {badgeInfo.issuer.email}</p>
                )}
              </div>
            </Card>

            {/* Dates */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Dates</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Émis le :</span> {formatDate(badgeInfo.issuedOn)}</p>
                <p><span className="font-medium">Expire le :</span> {formatDate(badgeInfo.expiresOn)}</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Critères d'obtention
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {badgeInfo.badge.criteria || 'Aucun critère spécifié'}
            </p>
          </Card>

          {badgeInfo.badge.evidence && badgeInfo.badge.evidence.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Preuves
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
                    {evidence.name || `Preuve ${index + 1}`}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* JSON Tab */}
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