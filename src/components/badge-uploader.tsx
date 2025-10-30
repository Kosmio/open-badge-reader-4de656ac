import React, { useCallback, useState } from 'react';
import { Upload, FileText, Link2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QRScanner } from './qr-scanner';
import { useTranslation } from '@/i18n/LanguageProvider';

interface BadgeUploaderProps {
  onBadgeUpload: (file: File | string) => void;
  isLoading?: boolean;
}

export function BadgeUploader({ onBadgeUpload, isLoading = false }: BadgeUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

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

    const validTypes = ['image/png', 'image/svg+xml', 'application/json', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: t('badgeUploader.toasts.unsupportedType.title'),
        description: t('badgeUploader.toasts.unsupportedType.description'),
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t('badgeUploader.toasts.fileTooLarge.title'),
        description: t('badgeUploader.toasts.fileTooLarge.description'),
        variant: 'destructive',
      });
      return;
    }

    onBadgeUpload(file);
  }, [onBadgeUpload, toast, t]);

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
        title: t('badgeUploader.toasts.invalidUrl.title'),
        description: t('badgeUploader.toasts.invalidUrl.description'),
        variant: 'destructive',
      });
    }
  }, [urlInput, onBadgeUpload, toast, t]);

  return (
    <div className="space-y-8">
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
              {t('badgeUploader.dropzone.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('badgeUploader.dropzone.supportedFormats')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('badgeUploader.dropzone.maxSize')}
            </p>
          </div>

          <Button variant="outline" disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            {t('badgeUploader.dropzone.button')}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Link2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{t('badgeUploader.urlSection.title')}</h3>
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder={t('badgeUploader.urlSection.placeholder')}
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
              {t('badgeUploader.urlSection.button')}
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

      <Card className="p-4 bg-accent/10 border-accent/30">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">{t('badgeUploader.help.title')}</h4>
            <p className="text-sm text-foreground/90 mt-1">
              {t('badgeUploader.help.description')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
