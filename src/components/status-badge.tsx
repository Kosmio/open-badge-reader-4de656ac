import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/LanguageProvider';

export type BadgeStatus = 'valid' | 'expired' | 'invalid' | 'loading';

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation();

  const statusConfig = {
    valid: {
      icon: CheckCircle,
      label: t('status.valid'),
      variant: 'default' as const,
      className: 'bg-gradient-success text-success-foreground shadow-success border-success/20 animate-glow',
    },
    expired: {
      icon: AlertTriangle,
      label: t('status.expired'),
      variant: 'secondary' as const,
      className: 'bg-gradient-warning text-warning-foreground shadow-warning border-warning/20',
    },
    invalid: {
      icon: XCircle,
      label: t('status.invalid'),
      variant: 'destructive' as const,
      className: 'bg-destructive text-destructive-foreground border-destructive/20',
    },
    loading: {
      icon: Clock,
      label: t('status.loading'),
      variant: 'secondary' as const,
      className: 'bg-muted text-muted-foreground animate-pulse-slow',
    },
  } as const;

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 transition-smooth ${config.className} ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span>{config.label}</span>
    </Badge>
  );
}
