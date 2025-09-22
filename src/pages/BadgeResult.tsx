import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BadgeDisplay, BadgeInfo } from '@/components/badge-display';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BadgeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const badgeInfo = location.state?.badgeInfo as BadgeInfo;

  if (!badgeInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aucun badge trouvé</h1>
          <p className="text-muted-foreground mb-6">
            Veuillez retourner à l'accueil pour vérifier un badge.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Badge: ${badgeInfo.badge.name}`,
          text: `Vérification du badge "${badgeInfo.badge.name}" émis par ${badgeInfo.issuer.name}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papiers",
      });
    }
  };

  const handleDownloadReport = () => {
    // TODO: Implement PDF report generation
    toast({
      title: "Fonctionnalité en développement",
      description: "Le téléchargement de rapport PDF sera bientôt disponible",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-accent/20 transition-smooth"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <h1 className="text-xl font-semibold">Résultat de vérification</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="hover:bg-accent/20 transition-smooth"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                className="hover:bg-accent/20 transition-smooth"
              >
                <Download className="mr-2 h-4 w-4" />
                Rapport PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <BadgeDisplay badgeInfo={badgeInfo} />
      </main>
    </div>
  );
}