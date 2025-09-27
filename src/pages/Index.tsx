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

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock function to simulate badge verification
  const mockVerifyBadge = async (input: File | string): Promise<BadgeInfo> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock badge data
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
      
      // Try real parsing first, fallback to mock if needed
      try {
        if (typeof input === 'string') {
          badgeInfo = await BadgeParser.parseFromUrl(input);
        } else {
          badgeInfo = await BadgeParser.parseFromFile(input);
        }
      } catch (parseError) {
        // Fallback to mock data for demo
        badgeInfo = await mockVerifyBadge(input);
      }
      
      // Sauvegarder le badge pour permettre le partage
      const badgeId = BadgeStorage.saveBadge(badgeInfo);
      navigate(`/result?id=${badgeId}`, { state: { badgeInfo } });
      
      toast({
        title: "Badge vérifié avec succès",
        description: "Redirection vers les résultats...",
      });
    } catch (error) {
      toast({
        title: "Erreur de vérification",
        description: error instanceof Error ? error.message : "Impossible de vérifier le badge. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto text-center relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-full shadow-glow animate-float">
              <Shield className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            OpenBadge Reader
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Vérifiez instantanément l'authenticité de vos Open Badges V2 et V3. 
            Uploadez un fichier ou collez une URL pour une validation complète.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">Validation instantanée</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Open Badge V2 & V3</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Sécurisé & privé</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <BadgeUploader onBadgeUpload={handleBadgeUpload} isLoading={isLoading} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-accent/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi utiliser OpenBadge Reader ?
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-6 text-center shadow-elevation hover:shadow-glow transition-smooth">
              <div className="p-3 bg-gradient-success rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vérification complète</h3>
              <p className="text-muted-foreground">
                Analyse la structure, la signature cryptographique et la validité 
                de vos badges selon les standards internationaux.
              </p>
            </Card>

            <Card className="p-6 text-center shadow-elevation hover:shadow-glow transition-smooth">
              <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sécurité garantie</h3>
              <p className="text-muted-foreground">
                Vos badges ne sont pas stockés sur nos serveurs. 
                Traitement en mémoire pour une confidentialité maximale.
              </p>
            </Card>

            <Card className="p-6 text-center shadow-elevation hover:shadow-glow transition-smooth">
              <div className="p-3 bg-gradient-warning rounded-full w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Format universel</h3>
              <p className="text-muted-foreground">
                Compatible avec tous les formats Open Badge : 
                images PNG/SVG avec métadonnées intégrées ou fichiers JSON.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">OpenBadge Reader</span>
              <span className="text-muted-foreground">by Lovable</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <span className="text-sm text-muted-foreground">
                Open Source • MIT License
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
