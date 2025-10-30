import React, { useCallback, useState } from 'react';
import { Upload, FileText, Link2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QRScanner } from './qr-scanner';

interface BadgeUploaderProps {
  onBadgeUpload: (file: File | string) => void;
  isLoading?: boolean;
}

export function BadgeUploader({ onBadgeUpload, isLoading = false }: BadgeUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/png', 'image/svg+xml', 'application/json', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez uploader un fichier PNG, SVG, JSON ou JPEG.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximum autorisée est de 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    onBadgeUpload(file);
  }, [onBadgeUpload, toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onBadgeUpload(file);
    }
  }, [onBadgeUpload]);

  const handleUrlSubmit = useCallback(() => {
    if (!urlInput.trim()) return;
    
    try {
      new URL(urlInput);
      onBadgeUpload(urlInput.trim());
      setUrlInput('');
    } catch {
      toast({
        title: "URL invalide",
        description: "Veuillez saisir une URL valide.",
        variant: "destructive",
      });
    }
  }, [urlInput, onBadgeUpload, toast]);

  return (
    <div className="space-y-8">
      {/* Drag & Drop Zone */}
      <Card
        className={`relative p-12 text-center border-2 border-dashed transition-smooth cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/5'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".png,.svg,.json,.jpeg,.jpg"
          onChange={handleFileSelect}
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full bg-gradient-primary transition-smooth
            ${isDragOver ? 'animate-pulse scale-110' : ''}
          `}>
            <Upload className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Glissez-déposez votre badge ici
            </h3>
            <p className="text-muted-foreground">
              Formats supportés : PNG, SVG, JSON, JPEG
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Taille maximum : 10MB
            </p>
          </div>
          
          <Button variant="outline" disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            Sélectionner un fichier
          </Button>
        </div>
      </Card>

      {/* URL Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Link2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Ou saisissez une URL</h3>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="https://exemple.com/badge.png"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              disabled={isLoading}
              className="flex-1"
            />
          <Button 
            onClick={handleUrlSubmit} 
            disabled={!urlInput.trim() || isLoading}
            className="bg-gradient-primary hover:shadow-glow transition-smooth"
          >
            Vérifier
          </Button>
        </div>
        
        <div className="mt-4">
          <QRScanner onScan={(url) => {
            setUrlInput(url);
            onBadgeUpload(url);
          }} />
        </div>
      </div>
    </Card>

      {/* Help Section */}
      <Card className="p-4 bg-accent/10 border-accent/30">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">À propos des Open Badges</h4>
            <p className="text-sm text-foreground/90 mt-1">
              Les Open Badges V2 et V3 sont des certificats numériques vérifiables. 
              Ils peuvent être intégrés dans des images PNG/SVG ou fournis en format JSON.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}