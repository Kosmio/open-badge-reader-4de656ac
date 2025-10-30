import { BadgeInfo } from '@/components/badge-display';
import { Language } from '@/i18n/translations';
import { createValidationRules, getValidationSummary } from './badge-validation';

interface GenerateBadgePdfOptions {
  badgeInfo: BadgeInfo;
  language: Language;
  t: (key: string, values?: Record<string, string | number>) => string;
}

interface PdfLine {
  text: string;
  fontSize?: number;
  leading?: number;
}

const sanitizeText = (value?: string) => {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[^\x20-\x7E]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const wrapText = (value: string, maxLength = 90) => {
  if (!value) return [''];
  const words = value.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const tentative = current ? `${current} ${word}` : word;
    if (tentative.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = tentative;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [''];
};

const escapePdfText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const sanitizeFileName = (name: string) =>
  (sanitizeText(name).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'badge').replace(/(^-|-$)/g, '');

const buildPdfPages = (lines: PdfLine[]) => {
  const startY = 800;
  const bottomMargin = 60;
  const pages: string[] = [];
  let currentY = startY;
  let currentContent: string[] = [];

  const startPage = () => {
    if (currentContent.length) {
      currentContent.push('ET');
      pages.push(currentContent.join('\n'));
    }
    currentContent = ['BT', '72 800 Td'];
    currentY = startY;
  };

  const addLine = (line: PdfLine) => {
    const fontSize = line.fontSize ?? 12;
    const leading = line.leading ?? fontSize + 4;

    if (currentY - leading < bottomMargin) {
      startPage();
    } else if (currentContent.length === 0) {
      startPage();
    }

    currentContent.push(`/F1 ${fontSize} Tf`);
    currentContent.push(`(${escapePdfText(line.text || ' ')}) Tj`);
    currentContent.push(`0 -${leading.toFixed(2)} Td`);
    currentY -= leading;
  };

  startPage();
  lines.forEach(addLine);
  if (currentContent.length) {
    currentContent.push('ET');
    pages.push(currentContent.join('\n'));
  }

  return pages;
};

const createPdfDocument = (pages: string[]) => {
  const encoder = new TextEncoder();
  const header = '%PDF-1.4\n';
  const chunks: string[] = [header];
  let currentOffset = encoder.encode(header).length;
  const totalObjects = 2 + pages.length * 2 + 1; // catalog + pages + (page + content)*n + font
  const fontObjectNumber = totalObjects;
  const objectOffsets = new Array(totalObjects + 1).fill(0);

  const addObject = (index: number, body: string) => {
    const chunk = `${index} 0 obj\n${body}\nendobj\n`;
    objectOffsets[index] = currentOffset;
    chunks.push(chunk);
    currentOffset += encoder.encode(chunk).length;
  };

  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');

  const pageObjectNumbers = pages.map((_, i) => 3 + i * 2);
  const pageRefs = pageObjectNumbers.map(num => `${num} 0 R`).join(' ');
  addObject(2, `<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>`);

  pages.forEach((content, index) => {
    const pageObjNumber = 3 + index * 2;
    const contentObjNumber = pageObjNumber + 1;
    const stream = `${content}\n`;
    const length = encoder.encode(stream).length;

    addObject(
      pageObjNumber,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectNumber} 0 R >> >> /Contents ${contentObjNumber} 0 R >>`
    );

    const streamBody = `<< /Length ${length} >>\nstream\n${stream}endstream`;
    addObject(contentObjNumber, streamBody);
  });

  addObject(fontObjectNumber, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  const xrefStart = currentOffset;
  const xrefLines = ['xref', `0 ${totalObjects + 1}`, '0000000000 65535 f '];
  for (let i = 1; i <= totalObjects; i += 1) {
    xrefLines.push(`${objectOffsets[i].toString().padStart(10, '0')} 00000 n `);
  }

  const trailer = [
    'trailer',
    `<< /Size ${totalObjects + 1} /Root 1 0 R >>`,
    'startxref',
    `${xrefStart}`,
    '%%EOF',
  ].join('\n');

  const xrefChunk = `${xrefLines.join('\n')}\n${trailer}`;
  chunks.push(xrefChunk);

  return encoder.encode(chunks.join(''));
};

export const generateBadgePdfReport = ({ badgeInfo, language, t }: GenerateBadgePdfOptions) => {
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  const formatDate = (value?: string) => {
    if (!value) {
      return sanitizeText(t('badgeResult.report.labels.notProvided'));
    }
    return sanitizeText(
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(value))
    );
  };

  const lines: PdfLine[] = [];
  const pushBlank = (count = 1) => {
    for (let i = 0; i < count; i += 1) {
      lines.push({ text: ' ', leading: 12 });
    }
  };

  const addWrappedText = (text: string, fontSize = 11, leading = fontSize + 4) => {
    const sanitized = sanitizeText(text);
    if (!sanitized) return;
    wrapText(sanitized).forEach(line => {
      lines.push({ text: line, fontSize, leading });
    });
  };

  const addKeyValue = (label: string, value?: string) => {
    const sanitizedLabel = sanitizeText(label);
    const sanitizedValue = sanitizeText(value) || sanitizeText(t('badgeResult.report.labels.notProvided'));
    wrapText(`${sanitizedLabel}: ${sanitizedValue}`).forEach(line => {
      lines.push({ text: line, fontSize: 11, leading: 16 });
    });
  };

  const addSection = (title: string) => {
    lines.push({ text: sanitizeText(title).toUpperCase(), fontSize: 13, leading: 20 });
  };

  lines.push({ text: sanitizeText(t('badgeResult.report.title')), fontSize: 16, leading: 26 });
  lines.push({
    text: sanitizeText(
      t('badgeResult.report.generatedOn', {
        date: new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      })
    ),
    fontSize: 11,
    leading: 18,
  });

  pushBlank();
  addSection(t('badgeResult.report.sections.badge'));
  addKeyValue(t('badgeResult.report.labels.name'), badgeInfo.badge.name || t('badgeDisplay.badgeNameFallback'));
  addWrappedText(`${sanitizeText(t('badgeResult.report.labels.description'))}:`);
  addWrappedText(sanitizeText(badgeInfo.badge.description));
  addKeyValue(t('badgeResult.report.labels.version'), t('badgeDisplay.versionLabel', { version: badgeInfo.version }));
  addKeyValue(t('badgeResult.report.labels.status'), t(`status.${badgeInfo.status}`));

  pushBlank();
  addSection(t('badgeResult.report.sections.issuer'));
  addKeyValue(t('badgeResult.report.labels.name'), badgeInfo.issuer.name || t('badgeDisplay.issuer.unknown'));
  addKeyValue(t('badgeResult.report.labels.website'), badgeInfo.issuer.url);
  addKeyValue(t('badgeResult.report.labels.email'), badgeInfo.issuer.email);

  pushBlank();
  addSection(t('badgeResult.report.sections.recipient'));
  addKeyValue(t('badgeResult.report.labels.name'), badgeInfo.recipient.name);
  addKeyValue(t('badgeResult.report.labels.email'), badgeInfo.recipient.email);
  addKeyValue(t('badgeResult.report.labels.identity'), badgeInfo.recipient.identity);

  pushBlank();
  addSection(t('badgeResult.report.sections.dates'));
  addKeyValue(t('badgeResult.report.labels.issuedOn'), formatDate(badgeInfo.issuedOn));
  addKeyValue(t('badgeResult.report.labels.expiresOn'), formatDate(badgeInfo.expiresOn));

  pushBlank();
  addSection(t('badgeResult.report.sections.evidence'));
  if (badgeInfo.badge.evidence && badgeInfo.badge.evidence.length > 0) {
    badgeInfo.badge.evidence.forEach((evidence, index) => {
      const name = evidence.name || t('badgeDisplay.evidence.itemFallback', { index: index + 1 });
      wrapText(`• ${sanitizeText(name)} — ${sanitizeText(evidence.url)}`).forEach(line => {
        lines.push({ text: line, fontSize: 11, leading: 16 });
      });
    });
  } else {
    addWrappedText(`• ${sanitizeText(t('badgeResult.report.evidence.none'))}`);
  }

  pushBlank();
  addSection(t('badgeResult.report.sections.validation'));
  const validationRules = createValidationRules(badgeInfo, t);
  const { passCount, warningCount, failCount } = getValidationSummary(validationRules);
  addWrappedText(
    t('badgeResult.report.validation.summary', {
      pass: passCount,
      warnings: warningCount,
      fails: failCount,
    })
  );

  validationRules.forEach(rule => {
    const statusLabel = t(`badgeResult.report.validation.status.${rule.status}`);
    addWrappedText(`• ${sanitizeText(rule.name)} — ${sanitizeText(statusLabel)}`);
    addWrappedText(`  ${sanitizeText(rule.message)}`);
    if (rule.details) {
      addWrappedText(`  ${sanitizeText(rule.details)}`);
    }
  });

  const pages = buildPdfPages(lines);
  const pdfBytes = createPdfDocument(pages);

  const sanitizedName = sanitizeFileName(badgeInfo.badge.name || '');
  const baseFileName = sanitizeFileName(t('badgeResult.report.fileName'));
  const fileName = `${baseFileName}-${sanitizedName}.pdf`;

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
