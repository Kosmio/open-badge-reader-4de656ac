import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/i18n/LanguageProvider';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { t } = useTranslation();

  const mockQRDetection = () => {
    setTimeout(() => {
      const mockBadgeUrl = 'https://example.com/badge.json';
      onScan(mockBadgeUrl);
      setIsOpen(false);
      stopCamera();
    }, 3000);
  };

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      mockQRDetection();

    } catch (err) {
      setError(t('qrScanner.error'));
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="w-full transition-smooth"
        >
          <QrCode className="mr-2 h-4 w-4" />
          {t('qrScanner.button')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5 text-primary" />
            <span>{t('qrScanner.dialogTitle')}</span>
          </DialogTitle>
          <DialogDescription>
            {t('qrScanner.dialogDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <p className="text-destructive text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={startCamera}
              >
                {t('qrScanner.retry')}
              </Button>
            </Card>
          ) : (
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {isScanning ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />

                  <div className="absolute inset-4 border-2 border-primary rounded-lg">
                    <div className="absolute inset-0 border border-primary/50 rounded-lg animate-pulse">
                      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary"></div>
                    </div>
                  </div>

                  <div className="absolute inset-x-4 top-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {t('qrScanner.cameraStarting')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {isScanning && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('qrScanner.searching')}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
